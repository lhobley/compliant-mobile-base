import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Camera, Loader2, Save, Upload 
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { MasterItem, InventoryLine, InventoryCategoryType, CATEGORIES } from '../../types/inventoryTypes';
import { saveInventoryLine } from '../../lib/inventoryService';
import { PhotoReviewModal } from '../../components/inventory/PhotoReviewModal';
import { VoiceInventoryAssistant } from '../../components/inventory/VoiceInventoryAssistant';

const LOCATION_ID = 'loc_main_bar';

export const CategoryDetailPage = () => {
  const { sessionId, categoryId } = useParams<{ sessionId: string, categoryId: string }>();
  const navigate = useNavigate();
  
  const [items, setItems] = useState<MasterItem[]>([]);
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Photo State
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const categoryName = CATEGORIES.find(c => c.id === categoryId)?.name || categoryId;

  useEffect(() => {
    loadData();
  }, [categoryId, sessionId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Master Items
      const itemsQ = query(collection(db, 'items'), where('categoryId', '==', categoryId));
      const itemsSnap = await getDocs(itemsQ);
      const fetchedItems = itemsSnap.docs.map(d => d.data() as MasterItem)
        .sort((a,b) => a.templateIndex - b.templateIndex);
      setItems(fetchedItems);

      // 2. Fetch Existing Counts
      if (sessionId) {
        const linesQ = query(
          collection(db, 'inventorySessions', sessionId, 'lines'),
          where('categoryId', '==', categoryId)
        );
        const linesSnap = await getDocs(linesQ);
        const initialCounts: Record<string, string> = {};
        linesSnap.docs.forEach(d => {
          const line = d.data() as InventoryLine;
          initialCounts[line.itemId] = line.countedBottles.toString();
        });
        setCounts(initialCounts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCount = async (item: MasterItem, valStr: string | number) => {
    const val = typeof valStr === 'string' ? parseFloat(valStr) : valStr;
    if (isNaN(val)) return;

    setSaving(item.id);
    // Optimistic UI update
    setCounts(prev => ({...prev, [item.id]: val.toString()}));
    
    try {
      if (sessionId) {
        await saveInventoryLine(sessionId, LOCATION_ID, item, val);
      }
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setSaving(null);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedPhoto(e.target.files[0]);
      setShowPhotoModal(true);
    }
  };

  const onPhotoProcessed = (updates: Record<string, number>) => {
    // Merge updates into local state
    setCounts(prev => {
      const next = { ...prev };
      Object.entries(updates).forEach(([itemId, addedQty]) => {
        const current = parseFloat(next[itemId] || '0');
        next[itemId] = (current + addedQty).toString();
      });
      return next;
    });
    // Re-fetch or rely on optimistic update logic? 
    // Ideally we should persist these immediately in the modal, 
    // but here we just update UI. The modal handles the saving.
    loadData(); 
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
            <p className="text-gray-500 text-sm ml-4 hidden sm:block">Inventory Check</p>
          </div>
          
          <div className="mt-2 sm:mt-0">
             {items.length > 0 && sessionId && (
               <VoiceInventoryAssistant 
                 sessionId={sessionId}
                 locationId={LOCATION_ID}
                 items={items}
                 onSave={handleSaveCount}
                 onComplete={() => alert("Category Complete!")}
               />
             )}
          </div>
        </div>

        <div className="flex gap-2">
          <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
            <Camera size={18} />
            <span className="hidden sm:inline">AI Photo Scan</span>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden"
              onChange={handlePhotoSelect}
            />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Par</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Count</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.templateCode} • {item.sizeMl}ml</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.defaultPar}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <input 
                        type="number"
                        inputMode="decimal"
                        className="block w-full text-right rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 pr-8 border"
                        placeholder="0"
                        value={counts[item.id] || ''}
                        onChange={(e) => setCounts(prev => ({...prev, [item.id]: e.target.value}))}
                        onBlur={(e) => handleSaveCount(item, e.target.value)}
                      />
                      {saving === item.id && (
                        <div className="absolute right-2 top-2.5">
                          <Loader2 size={14} className="animate-spin text-blue-500" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPhotoModal && selectedPhoto && sessionId && (
        <PhotoReviewModal
          file={selectedPhoto}
          sessionId={sessionId}
          locationId={LOCATION_ID}
          items={items}
          onClose={() => {
            setShowPhotoModal(false);
            setSelectedPhoto(null);
          }}
          onApply={onPhotoProcessed}
        />
      )}
    </div>
  );
};
