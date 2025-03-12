"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  UserCredential,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "@/config/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  reauthenticateUser: (password: string) => Promise<void>; // Fixed return type
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  // Define auth utility functions inside the provider
  const resetPassword = async (email: string) => {
    return await sendPasswordResetEmail(auth, email);
  };

  const updateUserEmail = async (email: string) => {
    if (!auth.currentUser) throw new Error("No user logged in");
    return await updateEmail(auth.currentUser, email);
  };

  const updateUserPassword = async (password: string) => {
    if (!auth.currentUser) throw new Error("No user logged in");
    return await updatePassword(auth.currentUser, password);
  };

  const reauthenticateUser = async (password: string) => {
    if (!auth.currentUser || !auth.currentUser.email)
      throw new Error("No user logged in");
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );
    // Just use await and don't return anything to match the Promise<void> type
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    googleSignIn,
    signOut,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    reauthenticateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
