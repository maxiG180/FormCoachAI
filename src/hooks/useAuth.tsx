import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
//import { auth } from "../config/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setUser(user);
  //     setLoading(false);
  //   });

  //   return unsubscribe;
  // }, []);

  // const login = async (email: string, password: string) => {
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     throw error;
  //   }
  // };

  // const signup = async (email: string, password: string) => {
  //   try {
  //     await createUserWithEmailAndPassword(auth, email, password);
  //   } catch (error) {
  //     console.error("Signup error:", error);
  //     throw error;
  //   }
  // };

  // const googleSignIn = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     await signInWithPopup(auth, provider);
  //   } catch (error) {
  //     console.error("Google sign-in error:", error);
  //     throw error;
  //   }
  // };

  // const signOut = async () => {
  //   try {
  //     await firebaseSignOut(auth);
  //   } catch (error) {
  //     console.error("Sign out error:", error);
  //     throw error;
  //   }
  // };

  // const value = {
  //   user,
  //   loading,
  //   login,
  //   signup,
  //   googleSignIn,
  //   signOut,
  // };

  // return (
  //   <AuthContext.Provider value={value}>
  //     {!loading && children}
  //   </AuthContext.Provider>
  // );
}

export const useAuth = () => {
  return {
    user: {
      uid: "test-user",
      email: "test@example.com",
      displayName: "Test User",
    },
    loading: false,
  };
};
