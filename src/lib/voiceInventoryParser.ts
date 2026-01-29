export const parseVoiceNumber = (transcript: string): number | null => {
  const text = transcript.toLowerCase().trim();
  
  // 1. Direct number match (digits)
  const digitMatch = text.match(/(\d+(\.\d+)?)/);
  if (digitMatch) {
    return parseFloat(digitMatch[0]);
  }

  // 2. Word-to-number mapping (basic set)
  const wordMap: Record<string, number> = {
    'zero': 0, 'none': 0, 'nil': 0,
    'one': 1, 'a': 1, 'an': 1,
    'two': 2, 'to': 2, 'too': 2,
    'three': 3,
    'four': 4, 'for': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8, 'ate': 8,
    'nine': 9,
    'ten': 10,
    'eleven': 11,
    'twelve': 12,
    'dozen': 12,
    'half': 0.5,
    '.5': 0.5
  };

  // Check strict whole word matches
  const words = text.split(/\s+/);
  for (const word of words) {
    if (wordMap[word] !== undefined) {
      // Handle "and a half" logic simply? 
      // For now, simple single number return
      return wordMap[word];
    }
  }

  // "Three and a half" pattern
  if (text.includes('and a half')) {
     const base = text.split(' and a half')[0];
     const baseNum = parseVoiceNumber(base); // Recurse for the integer part
     if (baseNum !== null) return baseNum + 0.5;
  }
  
  // "Point five" pattern
  if (text.includes('point')) {
     const parts = text.split('point');
     const intPart = parseVoiceNumber(parts[0]) || 0;
     const decPart = parseVoiceNumber(parts[1]);
     if (decPart !== null) return parseFloat(`${intPart}.${decPart}`);
  }

  return null;
};

export const parseInventoryCommand = (transcript: string) => {
  const text = transcript.toLowerCase();
  
  if (['stop', 'pause', 'quit', 'exit'].some(w => text.includes(w))) return 'stop';
  if (['next', 'skip', 'pass'].some(w => text.includes(w))) return 'next';
  if (['previous', 'back'].some(w => text.includes(w))) return 'previous';
  if (['repeat', 'again', 'what'].some(w => text.includes(w))) return 'repeat';
  if (['scan', 'photo', 'camera', 'picture'].some(w => text.includes(w))) return 'scan';
  
  return 'value'; // Default assume it's a value attempt
};
