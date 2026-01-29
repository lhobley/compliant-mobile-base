import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, query, where, getDocs, orderBy, limit 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  CATEGORIES, InventorySession, InventoryCategory 
} from '../../types/inventoryTypes';
import { 
  startInventorySession, completeInventorySession, 
  seedMasterInventory, getCategoryProgress 
} from '../../lib/inventoryService';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ClipboardList, CheckCircle, AlertCircle, Plus, Loader2 
} from 'lucide-react';

const CURRENT_LOCATION_ID = 'loc_main_bar'; // Mock location

export const InventoryHomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<InventorySession | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryProgress, setCategoryProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'inventorySessions'),
        where('locationId', '==', CURRENT_LOCATION_ID),
        where('status', '==', 'in_progress'),
        orderBy('startedAt', 'desc'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const session = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as InventorySession;
        setActiveSession(session);
        
        // Load progress for each category
        const prog: Record<string, number> = {};
        for (const cat of CATEGORIES) {
          const count = await getCategoryProgress(session.id, cat.id);
          prog[cat.id] = count;
        }
        setCategoryProgress(prog);
      } else {
        setActiveSession(null);
      }
    } catch (e) {
      console.error("Error fetching sessions:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    setLoading(true);
    try {
      await seedMasterInventory(); // Ensure items exist
      const userId = user?.id || 'anonymous';
      const sessionId = await startInventorySession(CURRENT_LOCATION_ID, userId);
      
      setActiveSession({
        id: sessionId,
        locationId: CURRENT_LOCATION_ID,
        startedAt: new Date(),
        status: 'in_progress',
        createdBy: userId
      });
      setCategoryProgress({});
    } catch (e) {
      alert("Error starting session");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!activeSession) return;
    if (!window.confirm("Finish Inventory? This will update stock levels.")) return;
    
    await completeInventorySession(activeSession.id, CURRENT_LOCATION_ID);
    setActiveSession(null);
    alert("Inventory session completed.");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bar Inventory</h1>
          <p className="text-gray-500 mt-1">Main Bar • {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
      ) : !activeSession ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <ClipboardList className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-medium text-gray-900">No Active Session</h3>
          <p className="text-gray-500 mb-6">Start a new count to update inventory levels.</p>
          <button 
            onClick={handleStartSession}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all"
          >
            Start New Count
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex justify-between items-center">
             <span className="text-blue-800 font-medium flex items-center">
               <Loader2 size={18} className="mr-2 animate-spin" />
               Session In Progress
             </span>
             <button 
               onClick={handleCompleteSession}
               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
             >
               Complete Session
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.sort((a,b) => a.displayOrder - b.displayOrder).map(cat => {
              const counted = categoryProgress[cat.id] || 0;
              const isComplete = counted >= cat.targetItemCount;
              const progress = Math.min(100, (counted / cat.targetItemCount) * 100);

              return (
                <div 
                  key={cat.id}
                  onClick={() => navigate(`/inventory/${activeSession.id}/${cat.id}`)}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
                      <p className="text-sm text-gray-500">{cat.targetItemCount} items</p>
                    </div>
                    {isComplete ? (
                      <CheckCircle className="text-green-500" size={24} />
                    ) : (
                      <div className="text-sm font-bold text-gray-400">{Math.round(progress)}%</div>
                    )}
                  </div>
                  
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`} 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    {counted} / {cat.targetItemCount} counted
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
