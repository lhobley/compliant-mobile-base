export type InventoryCategoryType = 
  | 'red_wine' | 'white_wine' | 'sparkling' | 'beer' 
  | 'vodka' | 'gin' | 'tequila' | 'bourbon' | 'whiskey' | 'aperitif';

export interface InventoryCategory {
  id: InventoryCategoryType;
  name: string;
  displayOrder: number;
  targetItemCount: number;
}

export interface MasterItem {
  id: string; // e.g. "RW-01"
  categoryId: InventoryCategoryType;
  templateCode: string; // "RW-01"
  templateIndex: number;
  name: string; // "Red Wine 01"
  sizeMl: number;
  type: string;
  active: boolean;
  defaultPar: number;
}

export interface LocationItem {
  id: string; // usually locationId_itemId
  locationId: string;
  itemId: string;
  onHandBottles: number;
  lastCountDate: any; // Timestamp
  parLevel: number;
  orderSuggestion: number;
}

export interface InventorySession {
  id: string;
  locationId: string;
  startedAt: any;
  completedAt?: any;
  status: 'in_progress' | 'complete';
  createdBy: string;
}

export interface InventoryLine {
  id: string; // sessionId_itemId
  sessionId: string;
  locationId: string;
  itemId: string;
  categoryId: InventoryCategoryType;
  countedBottles: number;
  previousOnHand: number;
  difference: number;
}

export interface PhotoInventoryLog {
  id: string;
  sessionId: string;
  locationId: string;
  photoUrl: string;
  aiProvider: string;
  aiRawResult: any;
  createdAt: any;
}

export interface AIDetection {
  brand: string;
  productName: string;
  sizeMl: number | null;
  categoryHint: string | null;
  confidence: number;
  matchedItemId?: string; // If auto-mapped
}

export const CATEGORIES: InventoryCategory[] = [
  { id: 'red_wine', name: 'Red Wine', displayOrder: 1, targetItemCount: 20 },
  { id: 'white_wine', name: 'White Wine', displayOrder: 2, targetItemCount: 20 },
  { id: 'sparkling', name: 'Champagne / Sparkling', displayOrder: 3, targetItemCount: 20 },
  { id: 'beer', name: 'Beer', displayOrder: 4, targetItemCount: 20 },
  { id: 'vodka', name: 'Vodka', displayOrder: 5, targetItemCount: 20 },
  { id: 'gin', name: 'Gin', displayOrder: 6, targetItemCount: 20 },
  { id: 'tequila', name: 'Tequila', displayOrder: 7, targetItemCount: 20 },
  { id: 'bourbon', name: 'Bourbon', displayOrder: 8, targetItemCount: 20 },
  { id: 'whiskey', name: 'Whiskey', displayOrder: 9, targetItemCount: 20 },
  { id: 'aperitif', name: 'Aperitif', displayOrder: 10, targetItemCount: 30 },
];
