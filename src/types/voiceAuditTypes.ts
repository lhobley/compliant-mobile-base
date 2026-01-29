export type VoiceAuditStatus = 'idle' | 'speaking' | 'listening' | 'processing' | 'error';

export interface VoiceCommand {
  text: string;
  action: 'answer_yes' | 'answer_no' | 'answer_skip' | 'answer_na' | 'answer_attention' | 'next' | 'previous' | 'repeat' | 'stop' | 'add_note' | 'take_photo' | 'unknown';
}

export interface VoiceAuditState {
  isActive: boolean;
  status: VoiceAuditStatus;
  currentSectionIndex: number;
  currentItemIndex: number;
  transcript: string;
  lastError: string | null;
}

export interface AuditResponse {
  sessionId: string;
  checklistItemId: string;
  status: 'pass' | 'fail' | 'needs_attention' | 'skipped' | 'na';
  notes?: string;
  spokenAnswerTranscript?: string;
  photoUrls?: string[];
  aiDetectedIssues?: string[];
  aiSuggestion?: 'pass' | 'fail' | 'needs_attention' | null;
  userOverride?: boolean;
  timestamp: any;
}
