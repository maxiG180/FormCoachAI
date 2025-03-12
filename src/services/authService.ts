// src/services/authService.ts
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    User,
    UserCredential
  } from 'firebase/auth';
  import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
  import { auth, db } from '@/config/firebase';
  
  export interface AuthError {
    code: string;
    message: string;
  }
  
  export interface RegisterData {
    email: string;
    password: string;
    displayName?: string;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  // Register new user
  export const registerWithEmail = async (data: RegisterData): Promise<User> => {
    try {
      const { email, password, displayName } = data;
      
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile if display name is provided
      if (displayName && user) {
        await updateProfile(user, { displayName });
      }
      
      // Create user document in Firestore
      await createUserProfile(user);
      
      return user;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError));
    }
  };
  
  // Login with email and password
  export const loginWithEmail = async (data: LoginData): Promise<UserCredential> => {
    try {
      const { email, password } = data;
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError));
    }
  };
  
  // Sign in with Google
  export const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await createUserProfile(result.user);
      }
      
      return result;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError));
    }
  };
  
  // Sign out
  export const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError));
    }
  };
  
  // Reset password
  export const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError));
    }
  };
  
  // Create user profile in Firestore
  const createUserProfile = async (user: User): Promise<void> => {
    const userRef = doc(db, 'users', user.uid);
    
    // Check if user already exists
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
      const { email, displayName, photoURL } = user;
      
      try {
        await setDoc(userRef, {
          uid: user.uid,
          email,
          displayName: displayName || '',
          photoURL: photoURL || '',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          exercises: [],
          preferences: {
            notifications: true,
            theme: 'dark'
          }
        });
      } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }
    } else {
      // Update last login time
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }
  };
  
  // Format error messages
const formatAuthError = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try logging in or use a different email.';
    case 'auth/invalid-email':
      return 'The email address is not valid. Please check and try again.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up or check your email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please double-check or reset your password.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters, including a mix of letters, numbers, and symbols.';
    case 'auth/too-many-requests':
      return 'Too many login attempts. Please wait a few minutes and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again if you want to continue.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
      case 'auth/invalid-credential':
      return 'The email or password you entered is incorrect. Please double-check and try again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};
