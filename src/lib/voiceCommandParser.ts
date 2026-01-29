import { VoiceCommand } from '../types/voiceAuditTypes';

export const parseVoiceCommand = (transcript: string): VoiceCommand => {
  const text = transcript.toLowerCase().trim();

  // Answers
  if (['yes', 'pass', 'confirmed', 'check', 'correct', 'ok'].some(w => text.includes(w))) {
    return { text, action: 'answer_yes' };
  }
  if (['no', 'fail', 'bad', 'failed', 'issue'].some(w => text.includes(w))) {
    return { text, action: 'answer_no' };
  }
  if (['attention', 'warning', 'flag'].some(w => text.includes(w))) {
    return { text, action: 'answer_attention' };
  }
  if (['skip', 'pass item'].some(w => text.includes(w))) {
    return { text, action: 'answer_skip' };
  }
  if (['na', 'not applicable'].some(w => text.includes(w))) {
    return { text, action: 'answer_na' };
  }

  // Navigation
  if (['next', 'next question', 'continue', 'go on'].some(w => text.includes(w))) {
    return { text, action: 'next' };
  }
  if (['previous', 'back', 'go back', 'last question'].some(w => text.includes(w))) {
    return { text, action: 'previous' };
  }
  if (['repeat', 'say again', 'what'].some(w => text.includes(w))) {
    return { text, action: 'repeat' };
  }
  
  // Actions
  if (['stop', 'pause', 'quit', 'exit', 'cancel'].some(w => text.includes(w))) {
    return { text, action: 'stop' };
  }
  if (['note', 'add note', 'comment'].some(w => text.includes(w))) {
    return { text, action: 'add_note' };
  }
  if (['photo', 'camera', 'picture', 'image'].some(w => text.includes(w))) {
    return { text, action: 'take_photo' };
  }

  return { text, action: 'unknown' };
};
