import { AIDetection } from '../types/inventory';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Mock AI Service simulating API4AI or similar
export const analyzeAlcoholPhoto = async (
  photoUri: string,
  sessionId: string,
  locationId: string
): Promise<AIDetection[]> => {
  
  // 1. In a real app, upload photoUri to Firebase Storage and get URL
  // const photoUrl = await uploadPhoto(photoUri);
  const photoUrl = "https://mock-storage.com/photo123.jpg"; 

  console.log("Analyzing photo:", photoUri);

  // 2. Simulate API Call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 3. Mock Response (Randomized for demo)
  const mockDetections: AIDetection[] = [
    {
      brand: "Tito's",
      productName: "Handmade Vodka",
      sizeMl: 1000,
      categoryHint: "vodka",
      confidence: 0.98
    },
    {
      brand: "Grey Goose",
      productName: "Vodka",
      sizeMl: 1000,
      categoryHint: "vodka",
      confidence: 0.95
    },
    {
      brand: "Unknown",
      productName: "Red Label",
      sizeMl: 750,
      categoryHint: "whiskey",
      confidence: 0.85
    }
  ];

  // 4. Log to Firestore
  try {
    if (db) {
      await addDoc(collection(db, 'photoInventoryLogs'), {
        sessionId,
        locationId,
        photoUrl,
        aiProvider: 'mock_provider',
        aiRawResult: mockDetections,
        createdAt: serverTimestamp()
      });
    }
  } catch (e) {
    console.error("Failed to log photo inventory:", e);
  }

  return mockDetections;
};

// Fuzzy matching logic to map detections to master items
// In a real app, this would use a more sophisticated string distance algorithm (Levenshtein)
export const mapDetectionsToItems = (
  detections: AIDetection[], 
  masterItems: any[] // Should be MasterItem[], using any to avoid circular dep issues in this snippet if types file is separate
): AIDetection[] => {
  return detections.map(det => {
    let bestMatch = null;
    
    // Simple logic: Try to find brand in item name
    if (det.brand && det.categoryHint) {
       // Filter master items by category if hint matches
       // e.g. hint 'vodka' -> filter ID 'vodka'
       const categoryId = det.categoryHint === 'vodka' ? 'vodka' : 
                          det.categoryHint === 'whiskey' ? 'whiskey' : null;

       if (categoryId) {
         const candidates = masterItems.filter(i => i.categoryId === categoryId);
         
         // Try to find exact name match or partial
         bestMatch = candidates.find(i => 
           i.name.toLowerCase().includes(det.brand.toLowerCase())
         );
       }
    }

    return {
      ...det,
      matchedItemId: bestMatch ? bestMatch.id : undefined
    };
  });
};
