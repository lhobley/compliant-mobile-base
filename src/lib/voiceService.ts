// Simple wrapper around Web Speech API

// Check support
export const isVoiceSupported = () => {
  return 'speechSynthesis' in window && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
};

// Text to Speech
export const speak = (text: string, onEnd?: () => void) => {
  if (!isVoiceSupported()) {
    onEnd?.();
    return;
  }

  // Cancel any currently speaking utterance
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Optional: customize voice/rate
  utterance.rate = 1.0; 
  utterance.pitch = 1.0;

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    console.error("TTS Error:", e);
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (isVoiceSupported()) {
    window.speechSynthesis.cancel();
  }
};

// Speech Recognition
let recognition: any = null;

export const startListening = (
  onResult: (transcript: string) => void,
  onError: (error: string) => void,
  onEnd: () => void
) => {
  if (!isVoiceSupported()) {
    onError("Voice API not supported");
    return;
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (recognition) {
    try {
      recognition.abort();
    } catch (e) {}
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false; // Capture one command at a time
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    if (event.error === 'no-speech') {
       // Ignore silence, just restart or let parent handle timeout
    } else {
       console.error("Speech Rec Error:", event.error);
       onError(event.error);
    }
  };

  recognition.onend = () => {
    onEnd();
  };

  try {
    recognition.start();
  } catch (e) {
    console.error("Failed to start recognition", e);
    onEnd();
  }
};

export const stopListening = () => {
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {}
  }
};
