import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type UserRole = 'owner' | 'manager' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  venueId?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | undefined;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  can: (action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitor Firebase Auth state
  useEffect(() => {
    let unsubscribeProfile = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up previous profile listener
      unsubscribeProfile();

      if (firebaseUser) {
        // Set up real-time listener for profile
        const docRef = doc(db, 'profiles', firebaseUser.uid);
        
        unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: data.name || 'User',
              role: data.role || 'staff',
              avatar: data.avatar,
              venueId: data.venueId
            });
          } else {
            // Profile missing, create default or handle as error
             setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || 'User',
              role: 'owner',
            });
          }
          setLoading(false);
        }, (error) => {
           console.error("Profile sync error:", error);
           setLoading(false);
        });

      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    
    // Set user immediately to prevent race condition
    // Full profile will be fetched by onAuthStateChanged
    setUser({
      id: userCredential.user.uid,
      email: userCredential.user.email!,
      name: userCredential.user.displayName || email.split('@')[0],
      role: 'owner' // Default, will be updated by onAuthStateChanged
    });
  };

  const signup = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    
    // Create the user profile in Firestore
    // Defaulting to 'owner' for new signups in this context, 
    // real app might have invitation logic.
    await setDoc(doc(db, 'profiles', res.user.uid), {
      email,
      name,
      role: 'owner', 
      createdAt: new Date().toISOString()
    });

    // Update local state immediately (optional, but helps with speed)
    setUser({
      id: res.user.uid,
      email,
      name,
      role: 'owner'
    });
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const can = (action: string): boolean => {
    if (!user) return false;

    switch (action) {
      case 'manage_team': // Add/Remove users
        return user.role === 'owner' || user.role === 'manager';
      
      case 'manage_settings': // Critical account changes
        return user.role === 'owner';
      
      case 'perform_audit': // Staff tasks
      case 'view_reports':
        return true; // Everyone can do this
        
      case 'delete_records':
        return user.role === 'owner';

      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role, loading, login, signup, logout, resetPassword, can }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
