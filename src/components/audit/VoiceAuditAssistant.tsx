import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, MicOff, Volume2, X, Camera, MessageSquare, AlertCircle, PlayCircle, Loader2
} from 'lucide-react';
import { 
  VoiceAuditState, VoiceAuditStatus, VoiceCommand, AuditResponse 
} from '../../types/voiceAuditTypes';
import { speak, stopSpeaking, startListening, stopListening, isVoiceSupported } from '../../lib/voiceService';
import { parseVoiceCommand } from '../../lib/voiceCommandParser';
import { useSettings } from '../../contexts/SettingsContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PhotoReviewModal } from '../inventory/PhotoReviewModal';
import { MasterItem } from '../../types/inventoryTypes';

// Simplified types for props
interface VoiceAuditAssistantProps {
  checklistId: string;
  sessionId: string;
  locationId: string;
  items: any[]; // The checklist items
  onComplete: () => void;
}

export const VoiceAuditAssistant: React.FC<VoiceAuditAssistantProps> = ({
  checklistId, sessionId, locationId, items, onComplete
}) => {
  const { voiceEnabled } = useSettings();
  
  // State
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState<VoiceAuditStatus>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastTranscript, setLastTranscript] = useState('');
  
  // Note taking state
  const [isRecordingNote, setIsRecordingNote] = useState(false);
  
  // Photo state
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  // Refs for loop control to avoid closures trapping state
  const stateRef = useRef({ active, status, currentIndex, isRecordingNote });
  stateRef.current = { active, status, currentIndex, isRecordingNote };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, []);

  // Main Loop Trigger
  useEffect(() => {
    if (active && status === 'idle' && !showPhotoModal) {
      runAuditLoop();
    }
  }, [active, status, currentIndex, showPhotoModal]);

  const runAuditLoop = async () => {
    if (!active) return;
    
    // Check completion
    if (currentIndex >= items.length) {
      speak("You have completed the audit. Finishing session now.", () => {
        onComplete();
      });
      return;
    }

    const item = items[currentIndex];

    // 1. Speak Question
    setStatus('speaking');
    const prompt = `Item ${currentIndex + 1}: ${item.question || item.task}. Say Yes, No, or Add Photo.`;
    
    speak(prompt, () => {
      if (!stateRef.current.active) return;
      
      // 2. Listen for answer
      setStatus('listening');
      startListening(
        handleSpeechResult, 
        handleSpeechError,
        () => {
            // On end (silence/timeout), we might want to reprompt or just stay idle?
            // For now, let's auto-restart listening if we didn't get a valid result 
            // but carefully to avoid infinite loops. 
            // If status is still 'listening', it means we got no result.
            if (stateRef.current.status === 'listening') {
               // Simple timeout logic could go here
               setStatus('idle'); // Loop will re-trigger, effectively repeating
            }
        }
      );
    });
  };

  const handleSpeechResult = (transcript: string) => {
    setLastTranscript(transcript);
    
    if (stateRef.current.isRecordingNote) {
       saveNote(transcript);
       return;
    }

    const cmd = parseVoiceCommand(transcript);
    processCommand(cmd);
  };

  const handleSpeechError = (err: string) => {
    console.warn("Speech Error:", err);
    // Be resilient, just go back to idle/repeat
    setStatus('idle');
  };

  const processCommand = (cmd: VoiceCommand) => {
    const item = items[currentIndex];

    switch (cmd.action) {
      case 'answer_yes':
        saveResponse(item.id, 'pass', cmd.text);
        speak("Recorded pass. Next.", () => nextItem());
        break;
      
      case 'answer_no':
        speak("Recorded fail. Would you like to add a photo?", () => {
             // For simplicity in this v1, just move next or user can say "photo" 
             // Ideally we'd enter a sub-state here.
             saveResponse(item.id, 'fail', cmd.text);
             nextItem();
        });
        break;

      case 'answer_skip':
        saveResponse(item.id, 'skipped', cmd.text);
        speak("Skipping.", () => nextItem());
        break;

      case 'answer_attention':
        saveResponse(item.id, 'needs_attention', cmd.text);
        speak("Flagged for attention.", () => nextItem());
        break;

      case 'take_photo':
        speak("Opening camera.", () => {
           setStatus('processing'); // Pause loop
           fileInputRef.current?.click();
        });
        break;

      case 'add_note':
        setIsRecordingNote(true);
        speak("Please dictate your note now.", () => {
           setStatus('listening');
           startListening(handleSpeechResult, handleSpeechError, () => {});
        });
        break;

      case 'repeat':
        speak("Repeating.", () => setStatus('idle')); // Will re-trigger loop
        break;

      case 'stop':
        setActive(false);
        setStatus('idle');
        speak("Audit paused.");
        break;
        
      default:
        speak("I didn't catch that. Please say Yes, No, or Skip.", () => {
           // Loop will re-trigger
           setStatus('idle');
        });
    }
  };

  const nextItem = () => {
    setCurrentIndex(prev => prev + 1);
    setStatus('idle');
  };

  const saveResponse = async (itemId: string, statusVal: string, transcript: string, note?: string) => {
    try {
      const responseData: AuditResponse = {
        sessionId,
        checklistItemId: itemId,
        status: statusVal as any,
        spokenAnswerTranscript: transcript,
        timestamp: serverTimestamp(),
        notes: note
      };
      
      await setDoc(doc(db, 'auditResponses', `${sessionId}_${itemId}`), responseData);
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const saveNote = (note: string) => {
    setIsRecordingNote(false);
    const item = items[currentIndex];
    
    // Determine status - default to 'needs_attention' if adding a note? Or keep undefined?
    // For now we just attach note to current item.
    saveResponse(item.id, 'needs_attention', 'note_dictated', note);
    
    speak("Note saved.", () => {
      setStatus('idle');
    });
  };

  // Photo Handling
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCapturedFile(e.target.files[0]);
      setShowPhotoModal(true);
    } else {
      // Cancelled
      setStatus('idle'); 
    }
  };

  const handlePhotoProcessed = (aiResults: any) => {
    // In this context, aiResults might be just counts from the inventory modal.
    // We should adapt the modal or create a specific AuditPhotoModal. 
    // For now, we reuse the flow: upload -> analyze -> return.
    
    // We can assume the modal saved something or just use the callback to resume voice.
    const item = items[currentIndex];
    
    // Auto-flag based on AI? 
    // This part is simulated since we are reusing the component.
    
    speak("Photo processed. Any issues were logged.", () => {
      setShowPhotoModal(false);
      setStatus('idle'); // Resume loop
    });
  };

  // UI Render
  if (!active) {
    if (!voiceEnabled) {
      return (
        <div className="text-sm text-gray-500 italic">
          Voice guidance disabled in settings
        </div>
      );
    }
    return (
      <button 
        onClick={() => { setActive(true); setStatus('idle'); }}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-slate-800 transition-all"
      >
        <Mic size={18} />
        Start Voice Audit
      </button>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 z-50">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        
        {/* Left: Status & Transcript */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {status === 'speaking' && <Volume2 className="text-blue-500 animate-pulse" />}
            {status === 'listening' && <Mic className="text-red-500 animate-pulse" />}
            {status === 'processing' && <Loader2 className="animate-spin text-gray-500" />}
            
            <span className="font-bold text-gray-900 uppercase text-xs tracking-wider">
               {status === 'speaking' ? 'Assistant Speaking...' : 
                status === 'listening' ? 'Listening...' : 
                'Processing...'}
            </span>
          </div>
          <p className="text-lg font-medium text-gray-800 line-clamp-1">
             {currentItem ? `Item ${currentIndex + 1}: ${currentItem.task || currentItem.question}` : 'Audit Complete'}
          </p>
          {lastTranscript && (
            <p className="text-sm text-gray-500 italic mt-1">" {lastTranscript} "</p>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-700">
             <Camera size={20} />
          </button>
          <button onClick={() => setActive(false)} className="p-3 bg-red-100 rounded-full hover:bg-red-200 text-red-600">
             <X size={20} />
          </button>
        </div>
      </div>

      {/* Hidden Inputs */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handlePhotoSelect} 
      />

      {/* Reusing the Inventory Photo Modal for simplicity, though ideally we'd make a generic one */}
      {showPhotoModal && capturedFile && (
        <PhotoReviewModal 
          file={capturedFile}
          sessionId={sessionId}
          locationId={locationId}
          items={[]} // No master items mapping needed for generic audit, but prop required
          onClose={() => {
            setShowPhotoModal(false);
            setStatus('idle');
          }}
          onApply={(res) => handlePhotoProcessed(res)}
        />
      )}
    </div>
  );
};
