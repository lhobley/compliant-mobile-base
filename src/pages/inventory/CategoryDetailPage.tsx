import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Camera, Loader2, Save, CheckCircle,
  Mic, FileSpreadsheet
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { MasterItem, InventoryLine, InventoryCategoryType, CATEGORIES } from '../../types/inventoryTypes';
import { saveInventoryLine } from '../../lib/inventoryService';
import { PhotoReviewModal } from '../../components/inventory/PhotoReviewModal';
import { VoiceInput } from '../../components/inventory/VoiceInput';
import { ExcelUpload } from '../../components/inventory/ExcelUpload';

const LOCATION_ID = 'loc_main_bar';

export const CategoryDetailPage = () => {
  const { sessionId, categoryId } = useParams<{ sessionId: string, categoryId: string }>();
  const navigate = useNavigate();
  
  const [items, setItems] = useState<MasterItem[]>([]);
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Photo State
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const categoryName = CATEGORIES.find(c => c.id === categoryId)?.name || categoryId;

  useEffect(() => {
    loadData();
  }, [categoryId, sessionId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
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
    } catch (e: any) {
      console.error(e);
      setError(`Failed to load data: ${e.message}`);
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
    } catch (e: any) {
      console.error("Save failed", e);
      setError(`Save failed: ${e.message}`);
    } finally {
      setSaving(null);
    }
  };

  const handleBulkUpload = async (uploadedCounts: Record<string, number>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update local state
      const newCounts: Record<string, string> = { ...counts };
      
      for (const [itemId, count] of Object.entries(uploadedCounts)) {
        newCounts[itemId] = count.toString();
        
        // Save to database
        const item = items.find(i => i.id === itemId);
        if (item && sessionId) {
          await saveInventoryLine(sessionId, LOCATION_ID, item, count);
        }
      }
      
      setCounts(newCounts);
      alert(`Successfully updated ${Object.keys(uploadedCounts).length} items!`);
    } catch (e: any) {
      setError(`Bulk upload failed: ${e.message}`);
    } finally {
      setLoading(false);
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
    loadData(); 
  };

  // Calculate progress
  const completedCount = Object.keys(counts).filter(k => counts[k] && parseFloat(counts[k]) > 0).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;
  const allComplete = completedCount === items.length && items.length > 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
            <p className="text-gray-500 text-sm">Inventory Check</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Excel Upload */}
          <ExcelUpload 
            items={items} 
            onUpload={handleBulkUpload}
            categoryName={categoryName}
          />

          {/* AI Photo */}
          <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
            <Camera size={18} />
            <span className="hidden sm:inline">AI Photo</span>
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

      {/* Progress Bar */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress: {completedCount} / {items.length} items
          </span>
          <span className={`text-sm font-bold ${allComplete ? 'text-green-600' : 'text-blue-600'}`}>
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${allComplete ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {allComplete && (
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <CheckCircle size={16} className="mr-1" />
            All items counted!
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Instructions */}
      <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Mic className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Voice Input Available</p>
            <p>Click the microphone icon next to any count field to speak the number. You can also type manually.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin" size={32} /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Par</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  <div className="flex items-center justify-end gap-2">
                    <Mic size={14} />
                    Count
                  </div>
                </th>
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
                      {/* Voice Input Component */}
                      <VoiceInput
                        value={counts[item.id] || ''}
                        onChange={(val) => setCounts(prev => ({...prev, [item.id]: val}))}
                        onBlur={() => handleSaveCount(item, counts[item.id] || '0')}
                      />
                      {saving === item.id && (
                        <div className="absolute right-10 top-2.5">
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
