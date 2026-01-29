import { AIDetection, MasterItem } from '../types/inventoryTypes';
import { db, storage } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// 1. Upload Photo to Firebase Storage
export const uploadInventoryPhoto = async (
  file: File, 
  sessionId: string
): Promise<string> => {
  if (!storage) throw new Error("Firebase Storage not initialized");
  
  const filename = `${sessionId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `photo_inventory/${filename}`);
  
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// 2. Mock AI Service simulating API4AI or similar
export const analyzeAlcoholPhoto = async (
  photoUrl: string,
  sessionId: string,
  locationId: string
): Promise<AIDetection[]> => {
  
  console.log("Analyzing photo URL:", photoUrl);

  // Simulate API Call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock Response
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

  // Log to Firestore
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

// 3. Map Detections to Master Items (Fuzzy Match)
export const mapDetectionsToItems = (
  detections: AIDetection[], 
  masterItems: MasterItem[]
): AIDetection[] => {
  return detections.map(det => {
    let bestMatch = null;
    
    if (det.brand && det.categoryHint) {
       // Filter by category if hint matches
       const categoryId = det.categoryHint === 'vodka' ? 'vodka' : 
                          det.categoryHint === 'whiskey' ? 'whiskey' : null;

       if (categoryId) {
         const candidates = masterItems.filter(i => i.categoryId === categoryId);
         
         // Simple string match
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
