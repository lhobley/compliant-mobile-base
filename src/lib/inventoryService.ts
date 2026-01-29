import { 
  collection, doc, writeBatch, getDocs, query, where, 
  addDoc, serverTimestamp, setDoc, getDoc, updateDoc 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  CATEGORIES, MasterItem, InventorySession, 
  InventoryLine, LocationItem, InventoryCategoryType 
} from '../types/inventoryTypes';

// ============================================================================
// SEEDING
// ============================================================================

export const seedMasterInventory = async () => {
  if (!db) return;
  
  // Check if already seeded by looking for RW-01
  const checkDoc = await getDoc(doc(db, 'items', 'RW-01'));
  if (checkDoc.exists()) {
    console.log('Master inventory already seeded.');
    return;
  }

  const batch = writeBatch(db);
  let operationCount = 0;

  CATEGORIES.forEach(cat => {
    let prefix = '';
    let defaultPar = 5;
    let size = 750;

    switch(cat.id) {
      case 'red_wine': prefix = 'RW'; break;
      case 'white_wine': prefix = 'WW'; break;
      case 'sparkling': prefix = 'SP'; break;
      case 'beer': prefix = 'BE'; size = 330; defaultPar = 24; break;
      case 'vodka': prefix = 'VO'; size = 1000; defaultPar = 10; break;
      case 'gin': prefix = 'GI'; size = 1000; break;
      case 'tequila': prefix = 'TE'; size = 1000; break;
      case 'bourbon': prefix = 'BO'; size = 1000; break;
      case 'whiskey': prefix = 'WH'; size = 1000; break;
      case 'aperitif': prefix = 'AP'; size = 750; break;
    }

    for (let i = 1; i <= cat.targetItemCount; i++) {
      const code = `${prefix}-${i.toString().padStart(2, '0')}`;
      const itemRef = doc(db, 'items', code);
      const itemData: MasterItem = {
        id: code,
        categoryId: cat.id,
        templateCode: code,
        templateIndex: i,
        name: `${cat.name} ${i.toString().padStart(2, '0')}`,
        sizeMl: size,
        type: cat.name,
        active: true,
        defaultPar
      };
      
      batch.set(itemRef, itemData);
      operationCount++;
    }
  });

  await batch.commit();
  console.log(`Seeded ${operationCount} master items.`);
};

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

export const startInventorySession = async (locationId: string, userId: string) => {
  const sessionData: Omit<InventorySession, 'id'> = {
    locationId,
    startedAt: serverTimestamp(),
    status: 'in_progress',
    createdBy: userId
  };
  const docRef = await addDoc(collection(db, 'inventorySessions'), sessionData);
  return docRef.id;
};

export const saveInventoryLine = async (
  sessionId: string, 
  locationId: string, 
  item: MasterItem, 
  count: number
) => {
  // Get previous on-hand (optional read, can be cached)
  const locItemRef = doc(db, 'locationItems', `${locationId}_${item.id}`);
  const locItemSnap = await getDoc(locItemRef);
  const prevOnHand = locItemSnap.exists() ? locItemSnap.data().onHandBottles || 0 : 0;

  const lineRef = doc(db, 'inventorySessions', sessionId, 'lines', item.id);
  const lineData: InventoryLine = {
    id: `${sessionId}_${item.id}`,
    sessionId,
    locationId,
    itemId: item.id,
    categoryId: item.categoryId,
    countedBottles: count,
    previousOnHand: prevOnHand,
    difference: count - prevOnHand
  };

  await setDoc(lineRef, lineData);
};

export const completeInventorySession = async (sessionId: string, locationId: string) => {
  const sessionRef = doc(db, 'inventorySessions', sessionId);
  
  // 1. Get all lines
  const linesSnap = await getDocs(collection(sessionRef, 'lines'));
  const batch = writeBatch(db);

  // 2. Update Location Items
  linesSnap.docs.forEach(lineDoc => {
    const line = lineDoc.data() as InventoryLine;
    const locItemRef = doc(db, 'locationItems', `${locationId}_${line.itemId}`);
    
    // In a real app, calculate order suggestion: Math.max(0, par - count)
    batch.set(locItemRef, {
      locationId,
      itemId: line.itemId,
      onHandBottles: line.countedBottles,
      lastCountDate: serverTimestamp(),
    }, { merge: true });
  });

  // 3. Close Session
  batch.update(sessionRef, {
    status: 'complete',
    completedAt: serverTimestamp()
  });

  await batch.commit();
};

export const getCategoryProgress = async (sessionId: string, categoryId: string) => {
  const q = query(
    collection(db, 'inventorySessions', sessionId, 'lines'),
    where('categoryId', '==', categoryId)
  );
  const snap = await getDocs(q);
  return snap.size;
};
