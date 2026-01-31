import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

// Type definitions for Web Speech API
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: {
    transcript: string;
  };
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInterface {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ 
  value, 
  onChange, 
  onBlur,
  placeholder = "0",
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = React.useRef<SpeechRecognitionInterface | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const recognition: SpeechRecognitionInterface = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        // Extract numbers from speech
        const numbers = finalTranscript.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          const numValue = numbers.join('');
          onChange(numValue);
          setTranscript('');
          setIsListening(false);
          if (onBlur) onBlur();
        } else {
          setTranscript(finalTranscript);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onChange, onBlur]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
    }
  };

  // Handle manual input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative flex items-center w-full">
      <input
        type="number"
        inputMode="decimal"
        className="block w-full text-right rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pr-12 border disabled:opacity-50 disabled:bg-gray-100"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onBlur={onBlur}
        disabled={disabled}
      />
      
      {/* Voice Button */}
      <button
        type="button"
        onClick={toggleListening}
        disabled={!!error || disabled}
        className={`
          absolute right-2 p-1.5 rounded-md transition-all
          ${isListening 
            ? 'bg-red-100 text-red-600 animate-pulse' 
            : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
          }
          ${(error || disabled) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title={error || (isListening ? 'Click to stop' : 'Click to speak')}
      >
        {isListening ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Mic size={16} />
        )}
      </button>

      {/* Listening Indicator */}
      {isListening && (
        <div className="absolute -top-8 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse whitespace-nowrap z-10">
          Listening...
        </div>
      )}

      {/* Transcript Preview */}
      {transcript && !isListening && (
        <div className="absolute -top-8 right-0 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded whitespace-nowrap max-w-[200px] truncate z-10">
          Heard: &quot;{transcript}&quot;
        </div>
      )}
    </div>
  );
};
