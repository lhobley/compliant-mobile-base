import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Safe configuration loader
const getFirebaseConfig = () => {
  try {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
  } catch (e) {
    console.error("Error loading Firebase config env vars:", e);
    return {};
  }
};

let app;
let auth;
let db;
let storage;

try {
  const config = getFirebaseConfig();
  
  // Singleton pattern to prevent re-initialization
  app = !getApps().length ? initializeApp(config) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Provide mock objects so app doesn't crash on import
  // This allows the UI to render an error message instead of white screen
  app = {} as any;
  auth = {} as any;
  db = {} as any;
  storage = {} as any;
}

export { app, auth, db, storage };
