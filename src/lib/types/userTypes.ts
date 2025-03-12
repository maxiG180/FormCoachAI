// src/types/userTypes.ts

import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  
  // Personal details
  bio?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  bodyFatPercentage?: number;
  
  // Profile image
  photoURL?: string;
  
  // Fitness metrics
  fitnessLevel?: string;
  fitnessGoal?: string;
  workoutFrequency?: string;
  preferredExercises?: string[];
  mobilityLimitations?: string[];
  personalRecords?: Record<string, number>;
  
  // Subscription details
  subscriptionTier?: 'free' | 'premium' | 'pro';
  subscriptionExpiresAt?: Timestamp;
  
  // Activity metrics
  totalWorkouts?: number;
  streak?: number;
  lastWorkoutDate?: Timestamp;
  
  // App preferences
  notificationsEnabled?: boolean;
  darkModeEnabled?: boolean;
  measurementSystem?: 'metric' | 'imperial';
  language?: string;
  
  // Timestamps
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  exerciseType: string;
  date: Timestamp;
  duration: number; // In seconds
  overallScore: number;
  categoryScores: {
    form: number;
    depth: number;
    alignment: number;
    balance: number;
  };
  repCount: number;
  repData: RepData[];
  videoReference?: string; // Reference to storage location
  notes?: string;
}

export interface RepData {
  timestamp: number;
  score: number;
  depth: number;
  duration: number;
  feedback?: FeedbackItem[];
  metrics?: {
    backAngle?: number;
    kneeAlignment?: number;
    balance?: number;
    [key: string]: number | undefined;
  };
}

export interface FeedbackItem {
  type: 'success' | 'warning' | 'error';
  category: 'form' | 'depth' | 'alignment' | 'balance';
  message: string;
  timestamp: number;
  severity?: 'minor' | 'moderate' | 'major';
  keypoints?: any[];
}

// User progress over time
export interface ProgressMetric {
  userId: string;
  metricType: 'weight' | 'bodyFat' | 'exerciseScore' | 'personalRecord';
  date: Timestamp;
  value: number;
  exerciseType?: string; // For exercise-specific metrics
  notes?: string;
}

// Achievements and badges
export interface Achievement {
  id: string;
  userId: string;
  type: string; // e.g., 'streak', 'perfect_form', 'weight_loss'
  title: string;
  description: string;
  iconUrl: string;
  earnedAt: Timestamp;
  progress?: number; // For achievements with progress (e.g., 7/10 workouts)
  visible: boolean; // Some achievements might be hidden until earned
}