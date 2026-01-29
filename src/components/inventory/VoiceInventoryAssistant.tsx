import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Volume2, Loader2, X, Camera, PlayCircle 
} from 'lucide-react';
import { MasterItem } from '../../types/inventoryTypes';
import { speak, stopSpeaking, startListening, stopListening } from '../../lib/voiceService';
import { parseVoiceNumber, parseInventoryCommand } from '../../lib/voiceInventoryParser';
import { PhotoReviewModal } from './PhotoReviewModal';

interface VoiceInventoryAssistantProps {
  sessionId: string;
  locationId: string;
  items: MasterItem[];
  onSave: (item: MasterItem, count: number) => Promise<void>;
  onComplete: () => void;
}

type Status = 'idle' | 'speaking' | 'listening' | 'processing';

export const VoiceInventoryAssistant: React.FC<VoiceInventoryAssistantProps> = ({
  sessionId, locationId, items, onSave, onComplete
}) => {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastTranscript, setLastTranscript] = useState('');
  
  // Photo State
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef({ active, status, currentIndex });
  stateRef.current = { active, status, currentIndex };

  // Cleanup
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, []);

  // Main Loop
  useEffect(() => {
    if (active && status === 'idle' && !showPhotoModal) {
      runInventoryLoop();
    }
  }, [active, status, currentIndex, showPhotoModal]);

  const runInventoryLoop = () => {
    if (!active) return;

    if (currentIndex >= items.length) {
      speak("That was the last item. Inventory complete.", () => {
        onComplete();
        setActive(false);
      });
      return;
    }

    const item = items[currentIndex];
    
    // Speak Prompt
    setStatus('speaking');
    const prompt = `Item ${currentIndex + 1}: ${item.name}. ${item.sizeMl} mil. How many?`;
    
    speak(prompt, () => {
      if (!stateRef.current.active) return;
      
      // Listen
      setStatus('listening');
      startListening(
        handleResult,
        (err) => { console.warn(err); setStatus('idle'); }, // Retry on error
        () => {
           // Timeout handling
           if (stateRef.current.status === 'listening') {
             // If silent too long, maybe repeat or idle?
             // Simple logic: just go idle to re-trigger loop which repeats prompt? 
             // Or better, just wait. Let's reset to idle to re-prompt.
             setStatus('idle');
           }
        }
      );
    });
  };

  const handleResult = (transcript: string) => {
    setLastTranscript(transcript);
    const command = parseInventoryCommand(transcript);

    if (command === 'stop') {
      speak("Pausing inventory.");
      setActive(false);
      setStatus('idle');
      return;
    }
    
    if (command === 'next') {
      speak("Skipping.", () => nextItem());
      return;
    }

    if (command === 'previous') {
      setCurrentIndex(prev => Math.max(0, prev - 1));
      setStatus('idle');
      return;
    }
    
    if (command === 'repeat') {
      setStatus('idle'); // Re-triggers loop
      return;
    }

    if (command === 'scan') {
      speak("Opening camera.", () => {
        setStatus('processing');
        fileInputRef.current?.click();
      });
      return;
    }

    // Default: Try to parse number
    const val = parseVoiceNumber(transcript);
    if (val !== null) {
      speak(`Recorded ${val}. Next.`, async () => {
        setStatus('processing');
        await onSave(items[currentIndex], val);
        nextItem();
      });
    } else {
      speak("I didn't catch a number. Say a quantity, skip, or scan.", () => {
        setStatus('idle');
      });
    }
  };

  const nextItem = () => {
    setCurrentIndex(prev => prev + 1);
    setStatus('idle');
  };

  // Photo Handling
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCapturedFile(e.target.files[0]);
      setShowPhotoModal(true);
    } else {
      setStatus('idle');
    }
  };

  const handlePhotoProcessed = (updates: Record<string, number>) => {
    // We assume the modal handles saving the actual lines or passing back data
    // If it passes back data, we should probably save it?
    // The current PhotoReviewModal interface returns `updates` map.
    // Let's iterate and save them.
    
    speak("Photo processed.", async () => {
      // Loop through updates and save using the callback
      // This might be redundant if modal saves, but let's be safe.
      // Actually, PhotoReviewModal in our previous step calls onApply 
      // but doesn't strictly call the save API itself inside the modal (it was mocked/commented).
      // So we should do it here.
      
      const updatePromises = Object.entries(updates).map(async ([itemId, qty]) => {
         const matchedItem = items.find(i => i.id === itemId);
         if (matchedItem) {
           await onSave(matchedItem, qty);
         }
      });
      
      await Promise.all(updatePromises);
      
      setShowPhotoModal(false);
      setStatus('idle');
    });
  };

  if (!active) {
    return (
      <button 
        onClick={() => { setActive(true); setStatus('idle'); }}
        className="flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-bold shadow hover:bg-slate-800 transition-all"
      >
        <Mic size={16} />
        Voice Mode
      </button>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 z-50">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
             {status === 'speaking' && <Volume2 className="text-blue-500 animate-pulse" size={18} />}
             {status === 'listening' && <Mic className="text-red-500 animate-pulse" size={18} />}
             <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
               {status === 'speaking' ? 'Speaking...' : status === 'listening' ? 'Listening...' : 'Processing'}
             </span>
          </div>
          <p className="font-bold text-gray-900 text-lg">
             {currentItem ? currentItem.name : 'Finished'}
          </p>
          {lastTranscript && <p className="text-sm text-gray-500 italic">"{lastTranscript}"</p>}
        </div>
        
        <div className="flex gap-2">
           <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200">
             <Camera size={20} className="text-gray-700" />
           </button>
           <button onClick={() => setActive(false)} className="p-3 bg-red-100 rounded-full hover:bg-red-200">
             <X size={20} className="text-red-600" />
           </button>
        </div>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handlePhotoSelect} 
      />

      {showPhotoModal && capturedFile && (
        <PhotoReviewModal
          file={capturedFile}
          sessionId={sessionId}
          locationId={locationId}
          items={items}
          onClose={() => { setShowPhotoModal(false); setStatus('idle'); }}
          onApply={handlePhotoProcessed}
        />
      )}
    </div>
  );
};
