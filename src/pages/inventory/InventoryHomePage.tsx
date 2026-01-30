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
  ClipboardList, CheckCircle, AlertCircle, Plus, Loader2,
  Wine, Beer, GlassWater, Martini, WineOff
} from 'lucide-react';

const CURRENT_LOCATION_ID = 'loc_main_bar'; // Mock location

// Category icon mapping
const getCategoryIcon = (categoryId: string) => {
  switch(categoryId) {
    case 'red_wine': return <Wine className="text-red-500" size={24} />;
    case 'white_wine': return <Wine className="text-yellow-500" size={24} />;
    case 'sparkling': return <GlassWater className="text-amber-500" size={24} />;
    case 'beer': return <Beer className="text-orange-500" size={24} />;
    default: return <Martini className="text-blue-500" size={24} />;
  }
};

export const InventoryHomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<InventorySession | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryProgress, setCategoryProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    if (!db) {
      setError("Database not connected");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
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
    } catch (e: any) {
      console.error("Error fetching sessions:", e);
      setError(e.message || "Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    setLoading(true);
    setError(null);
    
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
    } catch (e: any) {
      console.error("Session Start Error:", e);
      setError(`Error starting session: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!activeSession) return;
    if (!window.confirm("Finish Inventory? This will update stock levels.")) return;
    
    try {
      await completeInventorySession(activeSession.id, CURRENT_LOCATION_ID);
      setActiveSession(null);
      alert("Inventory session completed.");
    } catch (e: any) {
      console.error("Complete session error:", e);
      setError(`Error completing session: ${e.message}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (activeSession) {
      navigate(`/inventory/${activeSession.id}/${categoryId}`);
    } else {
      // If no session, prompt to start one
      if (window.confirm("Start an inventory session to count items in this category?")) {
        handleStartSession().then(() => {
          // Navigate after session starts
          setTimeout(() => navigate(`/inventory/${activeSession?.id}/${categoryId}`), 500);
        });
      }
    }
  };

  // Render category grid - always visible
  const renderCategoryGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {CATEGORIES.sort((a,b) => a.displayOrder - b.displayOrder).map(cat => {
        const counted = categoryProgress[cat.id] || 0;
        const isComplete = activeSession ? counted >= cat.targetItemCount : false;
        const progress = activeSession ? Math.min(100, (counted / cat.targetItemCount) * 100) : 0;

        return (
          <div 
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`
              relative p-4 rounded-xl border-2 cursor-pointer transition-all
              ${activeSession 
                ? 'bg-white hover:shadow-lg hover:border-blue-400' 
                : 'bg-gray-50 hover:bg-white hover:shadow-md hover:border-gray-300 border-gray-200'
              }
              ${isComplete ? 'border-green-400 bg-green-50' : ''}
            `}
          >
            {/* Icon */}
            <div className="flex justify-center mb-3">
              <div className={`p-3 rounded-full ${isComplete ? 'bg-green-100' : 'bg-gray-100'}`}>
                {getCategoryIcon(cat.id)}
              </div>
            </div>
            
            {/* Name */}
            <h3 className="text-center font-bold text-gray-900 mb-1 text-sm">{cat.name}</h3>
            
            {/* Item count */}
            <p className="text-center text-xs text-gray-500 mb-3">
              {cat.targetItemCount} items
            </p>
            
            {/* Progress bar - only show if active session */}
            {activeSession && (
              <div className="space-y-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-center text-gray-500">
                  {counted} / {cat.targetItemCount}
                </p>
              </div>
            )}
            
            {/* Complete badge */}
            {isComplete && (
              <div className="absolute top-2 right-2">
                <CheckCircle className="text-green-500" size={16} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bar Inventory</h1>
          <p className="text-gray-500 mt-1">Main Bar • {new Date().toLocaleDateString()}</p>
        </div>
        
        {activeSession ? (
          <button 
            onClick={handleCompleteSession}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center"
          >
            <CheckCircle className="mr-2" size={20} />
            Complete Session
          </button>
        ) : (
          <button 
            onClick={handleStartSession}
            disabled={loading}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Plus className="mr-2" size={20} />}
            Start New Count
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
          <AlertCircle className="mr-3 flex-shrink-0" size={20} />
          <div>
            <p className="font-bold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Session Status Banner */}
      {activeSession && (
        <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex justify-between items-center">
           <span className="text-blue-800 font-medium flex items-center">
             <Loader2 size={18} className="mr-2 animate-spin" />
             Session In Progress • Click a category to start counting
           </span>
           <span className="text-sm text-blue-600">
             Started {new Date(activeSession.startedAt.seconds * 1000).toLocaleTimeString()}
           </span>
        </div>
      )}

      {/* No Session State - Show template preview */}
      {!activeSession && !loading && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Inventory Template</h2>
              <p className="text-sm text-gray-500">Select a category to begin counting, or start a full session</p>
            </div>
            <ClipboardList className="text-gray-400" size={32} />
          </div>
        </div>
      )}

      {/* Category Grid - Always Visible */}
      {loading && !activeSession ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            {activeSession ? 'Categories' : 'Categories (Preview)'}
          </h3>
          {renderCategoryGrid()}
        </div>
      )}
    </div>
  );
};
