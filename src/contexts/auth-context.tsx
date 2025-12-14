
"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { SplashScreen } from "@/components/splash-screen";

// Add phone and referralCode to the signUp function signature
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (name: string, email: string, pass: string, phone: string, referralCode?: string) => Promise<any>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Accept phone number and referral code
  const signUp = async (name: string, email: string, password: string, phone: string, referralCode?: string): Promise<any> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      // This is a temp solution to pass data to the state context
      // In a real app with a backend, this would be a single atomic operation
      if(typeof window !== 'undefined'){
          sessionStorage.setItem(`temp_phone_${userCredential.user.uid}`, phone);
          if(referralCode) {
            sessionStorage.setItem(`temp_ref_${userCredential.user.uid}`, referralCode);
          }
      }
    }
    return userCredential;
  };

  const signIn = (email: string, password: string): Promise<any> => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = (): Promise<void> => {
    return firebaseSignOut(auth);
  };

  const sendPasswordReset = (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email);
  };
  
  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    sendPasswordReset,
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
