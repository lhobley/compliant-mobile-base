import React, { useState, useEffect } from 'react';
import { 
  X, Check, AlertTriangle, Loader2, Image as ImageIcon 
} from 'lucide-react';
import { AIDetection, MasterItem } from '../../types/inventoryTypes';
import { useSettings } from '../../contexts/SettingsContext';
import { uploadInventoryPhoto, analyzeAlcoholPhoto, mapDetectionsToItems } from '../../lib/aiInventoryService';
import { saveInventoryLine } from '../../lib/inventoryService';

interface PhotoReviewModalProps {
  file: File;
  sessionId: string;
  locationId: string;
  items: MasterItem[]; // For mapping context
  onClose: () => void;
  onApply: (updates: Record<string, number>) => void;
}

export const PhotoReviewModal: React.FC<PhotoReviewModalProps> = ({
  file, sessionId, locationId, items, onClose, onApply
}) => {
  const { aiFeaturesEnabled } = useSettings();
  const [step, setStep] = useState<'uploading' | 'analyzing' | 'review'>('uploading');
  const [detections, setDetections] = useState<AIDetection[]>([]);
  const [mappedResults, setMappedResults] = useState<AIDetection[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    processPhoto();
  }, []);

  const processPhoto = async () => {
    try {
      // 1. Upload
      setStep('uploading');
      const url = await uploadInventoryPhoto(file, sessionId);
      setPhotoUrl(url);

      if (!aiFeaturesEnabled) {
        // Skip AI analysis, just show photo for manual reference
        setStep('review');
        setDetections([]);
        setMappedResults([]);
        return;
      }

      // 2. Analyze
      setStep('analyzing');
      const rawDetections = await analyzeAlcoholPhoto(url, sessionId, locationId);
      
      // 3. Map
      const mapped = mapDetectionsToItems(rawDetections, items);
      setDetections(rawDetections);
      setMappedResults(mapped);
      
      setStep('review');
    } catch (e) {
      console.error(e);
      alert("Failed to process photo.");
      onClose();
    }
  };

  const handleApply = async () => {
    // 1. Filter valid mapped items
    const validItems = mappedResults.filter(d => d.matchedItemId);
    const updates: Record<string, number> = {};

    // 2. Save to Firestore (Assuming +1 per detection for simplicity)
    // Real implementation: allow user to edit quantity in the UI first
    for (const det of validItems) {
      if (!det.matchedItemId) continue;
      
      const masterItem = items.find(i => i.id === det.matchedItemId);
      if (masterItem) {
        // Simple logic: We don't know the *current* count here easily without refetching.
        // For this demo, we assume the parent updates the UI.
        // But to be safe, we should fetch-and-increment in a transaction ideally.
        // Here we just save "1" or overwrite? 
        // Better pattern: Pass updates back to parent to handle "add to current".
        updates[masterItem.id] = (updates[masterItem.id] || 0) + 1;
        
        // Also save to DB immediately (optional, or let parent do it)
        // Let's assume parent handles state, but we save line here? 
        // Actually saveInventoryLine overwrites. 
        // So we really need to know the previous count.
        // Let's just return the diffs to parent.
      }
    }

    // Actually, let's just do a blind "save" of 1 for demo purposes if we don't have existing.
    // Ideally the UI allows editing the total count. 
    // We will just pass the delta to the parent onApply.
    onApply(updates);
    onClose();
  };

  const handleMatchChange = (index: number, newItemId: string) => {
    const newResults = [...mappedResults];
    newResults[index].matchedItemId = newItemId;
    setMappedResults(newResults);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            {step === 'review' ? 'Review AI Detections' : 'Processing Photo...'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step !== 'review' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                <div className="bg-blue-50 p-4 rounded-full relative z-10">
                  <Loader2 size={48} className="text-blue-600 animate-spin" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {step === 'uploading' ? 'Uploading Image...' : 'Analyzing Labels...'}
              </h4>
              <p className="text-gray-500 max-w-sm">
                Our AI is scanning the photo to identify bottles, brands, and fluid levels.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Photo Preview */}
              {photoUrl && (
                <div className="relative h-48 w-full bg-black rounded-lg overflow-hidden flex items-center justify-center group">
                  <img src={photoUrl} alt="Analyzed" className="h-full object-contain" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-xs font-medium">Original Capture</p>
                  </div>
                </div>
              )}

              {/* AI Disabled Message */}
              {!aiFeaturesEnabled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>AI Features Disabled:</strong> Photo uploaded for reference only. Manual input required.
                  </p>
                </div>
              )}

              {/* Detections List */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                  {aiFeaturesEnabled ? 'Detected Items' : 'Manual Entry'}
                  {aiFeaturesEnabled && (
                    <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                      {mappedResults.length}
                    </span>
                  )}
                </h4>
                
                <div className="space-y-3">
                  {mappedResults.map((det, idx) => {
                    const matchedItem = items.find(i => i.id === det.matchedItemId);
                    
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:border-blue-300 transition-all">
                        {/* Left: AI Info */}
                        <div className="flex-1 mb-3 sm:mb-0">
                          <div className="flex items-center mb-1">
                            <span className="font-bold text-gray-900 mr-2">
                              {det.brand} {det.productName}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              det.confidence > 0.9 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {(det.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                             Size: {det.sizeMl}ml • Hint: {det.categoryHint}
                          </p>
                        </div>

                        {/* Right: Matching & Action */}
                        <div className="flex items-center gap-3">
                          {matchedItem ? (
                             <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100 text-sm">
                               <Check size={14} className="mr-1.5" />
                               <span className="font-medium truncate max-w-[120px]">
                                 {matchedItem.templateCode} - {matchedItem.name}
                               </span>
                             </div>
                          ) : (
                             <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 text-sm">
                               <AlertTriangle size={14} className="mr-1.5" />
                               <span>Unmapped</span>
                             </div>
                          )}
                          
                          <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                             <span className="text-sm font-bold text-gray-700">+1</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'review' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleApply}
              className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all flex items-center"
            >
              <Check size={18} className="mr-2" />
              Apply Updates
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
