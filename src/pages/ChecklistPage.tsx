import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Building2, Beer, Music, Check, Loader2, Send } from 'lucide-react';
import { checklistTemplates, ChecklistItem } from '../data/checklistTemplates';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for classes
const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

const ChecklistPage = () => {
  const [activeTab, setActiveTab] = useState<'opening' | 'closing'>('opening');
  const [venueType, setVenueType] = useState<'restaurant' | 'bar' | 'nightclub'>('restaurant');
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Demo Context
  const venueId = 'demo-venue-123'; // Ideally from user profile
  const userId = user?.id || 'anonymous';
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Filter checklists
  const currentChecklist = checklistTemplates.find(
    (c) => c.venueType === venueType && c.type === activeTab
  );

  const completionId = `${venueId}_${currentChecklist?.id}_${today}`;

  // Load completion status from Firestore
  useEffect(() => {
    if (!currentChecklist) return;
    
    // Safety check for db
    if (!db || Object.keys(db).length === 0) {
      console.warn("Firebase DB not initialized, skipping load");
      return;
    }
    
    setLoading(true);
    try {
      const docRef = doc(db, 'checklistCompletions', completionId);
      
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompletedItems(data.itemsCompleted || []);
        } else {
          setCompletedItems([]);
        }
        setLoading(false);
      }, (err) => {
        console.error("Snapshot error:", err);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Error setting up snapshot listener:", e);
      setLoading(false);
    }
  }, [venueType, activeTab, completionId, currentChecklist]);

  // Handle Toggle
  const toggleItem = async (itemId: string) => {
    if (!currentChecklist) return;

    const isCompleted = completedItems.includes(itemId);
    let newCompleted = [];

    if (isCompleted) {
      newCompleted = completedItems.filter(id => id !== itemId);
    } else {
      newCompleted = [...completedItems, itemId];
    }

    // Optimistic update
    setCompletedItems(newCompleted);

    // Write to Firebase
    try {
      if (!db || Object.keys(db).length === 0) throw new Error("Firebase DB not initialized");

      const docRef = doc(db, 'checklistCompletions', completionId);
      await setDoc(docRef, {
        id: completionId,
        checklistId: currentChecklist.id,
        venueId,
        completedBy: userId,
        completionDate: today, // Storing as string for simpler querying in this demo
        itemsCompleted: newCompleted,
        updatedAt: new Date()
      }, { merge: true });
    } catch (err) {
      console.error("Failed to save checklist:", err);
      // Revert if failed (optional, but good UX)
      setCompletedItems(completedItems); 
      alert("Failed to save. Is Firebase configured?");
    }
  };

  const handleSendReport = async () => {
    if (!currentChecklist) return;

    try {
      // 1. Get recipient email
      let recipient = '';
      if (db) {
         const settingsRef = doc(db, 'venueSettings', 'default');
         const settingsSnap = await getDoc(settingsRef);
         if (settingsSnap.exists()) {
           recipient = settingsSnap.data().reportEmail;
         }
      }

      if (!recipient) {
        alert("Please configure a report email in Team Settings (Owner only).");
        return;
      }

      // 2. Format Data
      const subject = `Checklist Report: ${currentChecklist.title} - ${today}`;
      let body = `Daily Checklist Report\n`;
      body += `Date: ${today}\n`;
      body += `Venue: ${venueType.toUpperCase()}\n`;
      body += `List: ${currentChecklist.title}\n`;
      body += `Status: ${completedItems.length}/${currentChecklist.items.length} Completed\n\n`;
      
      body += `ITEMS:\n`;
      currentChecklist.items.forEach(item => {
        const isDone = completedItems.includes(item.id);
        body += `[${isDone ? 'x' : ' '}] ${item.task}`;
        if (item.critical) body += ` (CRITICAL)`;
        body += `\n`;
      });

      // 3. Open Mailto
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    } catch (err) {
      console.error("Error sending report:", err);
      alert("Failed to prepare report.");
    }
  };

  const progress = currentChecklist 
    ? Math.round((completedItems.length / currentChecklist.items.length) * 100) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Daily Checklists</h1>
          <p className="text-gray-500 mt-1">Track opening and closing procedures for {today}</p>
        </div>
        
        {/* Venue Type Pills */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          {(['restaurant', 'bar', 'nightclub'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setVenueType(type)}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                venueType === type 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {type === 'restaurant' && <Building2 size={16} className="mr-2" />}
              {type === 'bar' && <Beer size={16} className="mr-2" />}
              {type === 'nightclub' && <Music size={16} className="mr-2" />}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Tabs & Progress Header */}
        <div className="border-b border-gray-100 bg-gray-50/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('opening')}
                className={cn(
                  "px-6 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === 'opening' 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                Opening
              </button>
              <button
                onClick={() => setActiveTab('closing')}
                className={cn(
                  "px-6 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === 'closing' 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                Closing
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
               <span className="text-sm font-medium text-gray-600">
                 {completedItems.length} / {currentChecklist?.items.length || 0}
               </span>
               <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                   style={{ width: `${progress}%` }}
                 />
               </div>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
             <ClipboardList className="mr-3 text-blue-500" size={24} />
             {currentChecklist?.title}
          </h2>
        </div>

        {/* List Items */}
        <div className="divide-y divide-gray-50">
          {loading ? (
             <div className="p-12 flex justify-center text-gray-400">
               <Loader2 className="animate-spin" size={32} />
             </div>
          ) : (
            currentChecklist?.items.map((item) => {
              const isChecked = completedItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={cn(
                    "group p-4 flex items-start transition-colors duration-200 cursor-pointer select-none relative",
                    isChecked ? "bg-blue-50/30" : "hover:bg-gray-50"
                  )}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className={cn(
                    "flex-shrink-0 w-6 h-6 mt-0.5 rounded border-2 flex items-center justify-center transition-all duration-200",
                    isChecked 
                      ? "bg-blue-600 border-blue-600 shadow-sm" 
                      : "border-gray-300 bg-white group-hover:border-blue-400"
                  )}>
                    {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <span className={cn(
                      "text-base font-medium transition-all duration-200 block",
                      isChecked ? "text-gray-500 line-through decoration-gray-400" : "text-gray-900"
                    )}>
                      {item.task}
                    </span>
                    
                    <div className="flex items-center mt-1.5 space-x-2">
                      {item.critical && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-red-100 text-red-700">
                          Critical
                        </span>
                      )}
                      {item.time && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
                          Due: {item.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Submit Action */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSendReport}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="mr-2" size={18} />
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistPage;
