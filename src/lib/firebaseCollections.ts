import { collection, CollectionReference } from 'firebase/firestore';
import { db } from './firebase';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  companyName?: string;
  phone?: string;
  createdAt: Date;
}

export interface Venue {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  venueType: 'restaurant' | 'bar' | 'nightclub';
  complianceScore: number;
  subscriptionStatus: 'trialing' | 'active' | 'past_due' | 'canceled';
  trialEndsAt?: Date;
  createdAt: Date;
}

export interface AuditTemplate {
  id: string;
  name: string;
  auditType: string;
  category: string;
  sections: AuditSection[];
}

export interface AuditSection {
  category: string;
  items: AuditItem[];
}

export interface AuditItem {
  id: string;
  requirement: string;
  critical: boolean;
  violationPoints: number;
}

export interface Audit {
  id: string;
  venueId: string;
  auditorId: string;
  auditType: string;
  auditDate: Date;
  score: number;
  status: 'passed' | 'warning' | 'failed';
  itemsChecked: CheckedItem[];
  violations: Violation[];
  notes?: string;
  createdAt: Date;
}

export interface CheckedItem {
  id: string;
  passed: boolean;
  notes?: string;
  photoUrl?: string;
}

export interface Violation {
  itemId: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  points: number;
}

export interface Checklist {
  id: string;
  venueId: string;
  title: string;
  checklistType: 'opening' | 'closing';
  venueType: 'restaurant' | 'bar' | 'nightclub';
  items: ChecklistItem[];
  createdAt: Date;
}

export interface ChecklistItem {
  id: string;
  task: string;
  time?: string;
  critical: boolean;
}

export interface ChecklistCompletion {
  id: string;
  checklistId: string;
  venueId: string;
  completedBy: string;
  completionDate: Date;
  itemsCompleted: string[];
  notes?: string;
}

export interface InventoryItem {
  id: string;
  venueId: string;
  category: string;
  name: string;
  brand: string;
  quantity: number;
  unit: string;
  parLevel: number;
  costPerUnit: number;
  lastUpdated: Date;
}

// Collection References
export const profilesCollection = collection(db, 'profiles') as CollectionReference<Profile>;
export const venuesCollection = collection(db, 'venues') as CollectionReference<Venue>;
export const auditTemplatesCollection = collection(db, 'auditTemplates') as CollectionReference<AuditTemplate>;
export const auditsCollection = collection(db, 'audits') as CollectionReference<Audit>;
export const checklistsCollection = collection(db, 'checklists') as CollectionReference<Checklist>;
export const checklistCompletionsCollection = collection(db, 'checklistCompletions') as CollectionReference<ChecklistCompletion>;
export const inventoryCollection = collection(db, 'inventory') as CollectionReference<InventoryItem>;
