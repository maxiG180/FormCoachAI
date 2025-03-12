import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export class FirestoreManager {
  // Initialize user data on first login
  public static async initializeUserData(): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.warn("No user logged in");
      return;
    }
    
    try {
      const db = getFirestore();
      
      // Check if user document exists
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
        
        // Create initial exercise document
        await setDoc(doc(db, "users", user.uid, "exercises", "squats"), {
          name: "Squats",
          createdAt: serverTimestamp(),
          lastPerformed: null,
          totalReps: 0,
          bestScore: 0
        });
      } else {
        // Update last login time
        await updateDoc(userRef, {
          lastLogin: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error initializing user data:", error);
    }
  }
  
  // Track workout stats after session completion
  public static async updateExerciseStats(
    exerciseName: string, 
    repCount: number, 
    maxScore: number
  ): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) return;
    
    try {
      const db = getFirestore();
      const exerciseRef = doc(db, "users", user.uid, "exercises", exerciseName.toLowerCase());
      const exerciseDoc = await getDoc(exerciseRef);
      
      if (exerciseDoc.exists()) {
        const data = exerciseDoc.data();
        
        await updateDoc(exerciseRef, {
          lastPerformed: serverTimestamp(),
          totalReps: (data.totalReps || 0) + repCount,
          bestScore: Math.max(data.bestScore || 0, maxScore)
        });
      } else {
        await setDoc(exerciseRef, {
          name: exerciseName,
          createdAt: serverTimestamp(),
          lastPerformed: serverTimestamp(),
          totalReps: repCount,
          bestScore: maxScore
        });
      }
      
      // Add workout history entry
      await addDoc(collection(db, "users", user.uid, "workoutHistory"), {
        exercise: exerciseName,
        date: serverTimestamp(),
        reps: repCount,
        score: maxScore,
        duration: 0
      });
    } catch (error) {
      console.error("Error updating exercise stats:", error);
    }
  }
  
  // Set up auth listener to initialize user data on login
  public static setupAuthListener(): () => void {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        this.initializeUserData();
      }
    });
    return unsubscribe;
  }

 /**
 * Initialize or update model tracking for TensorFlow models
 */
public static async updateModelTracking(userId: string): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    console.warn("No user logged in");
    return;
  }
  
  try {
    const db = getFirestore();
    
    // First, check/create the global_models collection and squat-analysis document
    const globalModelRef = doc(db, "global_models", "squat-analysis");
    const globalDocSnap = await getDoc(globalModelRef);
    
    if (!globalDocSnap.exists()) {
      console.log("Creating global model document");
      await setDoc(globalModelRef, {
        active: true,
        lastUpdated: serverTimestamp(),
        storagePath: "global/models/squat-analysis",
        version: "1.0.0",
        modelType: "squat"
      });
    }
    
    // Then, check/create the user-specific model document
    const userModelRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userModelRef);
    
    if (!userDocSnap.exists()) {
      // Create new user if needed
      await setDoc(userModelRef, {
        userId,
        email: user.email || "",
        displayName: user.displayName || "",
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        repCount: 0,
        exercises: {
          squats: {
            totalReps: 0,
            lastUpdated: serverTimestamp()
          }
        }
      });
    } else {
      // Update existing user
      await updateDoc(userModelRef, {
        lastUpdated: serverTimestamp()
      });
    }
    
    console.log("Model tracking initialized for user", userId);
  } catch (error) {
    console.error("Error initializing model tracking:", error);
    throw error;
  }
}



}