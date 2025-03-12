// src/config/firebase.config.ts

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { FirestoreManager } from "../lib/utils/firebase/firestoreSetup";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Error handling utility
export const handleAuthError = (error: { code: string }): Error => {
  const errorCode = error.code;
  let errorMessage = 'An error occurred during authentication.';

  switch (errorCode) {
    case 'auth/popup-blocked':
      errorMessage = 'Popup was blocked. Please allow popups for this site.';
      break;
    case 'auth/popup-closed-by-user':
      errorMessage = 'Sign-in window was closed.';
      break;
    case 'auth/network-request-failed':
      errorMessage = 'Network error. Please check your connection.';
      break;
    case 'auth/user-disabled':
      errorMessage = 'This account has been disabled.';
      break;
    case 'auth/invalid-email':
      errorMessage = 'Invalid email address.';
      break;
    case 'auth/user-not-found':
      errorMessage = 'No account found with this email.';
      break;
    case 'auth/wrong-password':
      errorMessage = 'Incorrect password.';
      break;
    case 'auth/too-many-requests':
      errorMessage = 'Too many unsuccessful login attempts. Please try again later.';
      break;
    default:
      console.error('Auth error:', error);
  }

  return new Error(errorMessage);
};

// Set up auth listener to initialize user data
export const unsubscribeAuthListener = FirestoreManager.setupAuthListener();

export default app;