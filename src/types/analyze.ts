// File: types/analyze.ts

export interface Keypoint {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface FeedbackItem {
  message: string;
  category: "form" | "depth" | "alignment" | "balance";
  type: "success" | "warning" | "error";
  severity: "minor" | "moderate" | "major";
  timestamp: number;
  keypoints?: any[];
}

// Add interface for AI predictions
export interface AIInsight {
  category: string;
  confidence: number;
  issues: {
    type: string;
    confidence: number;
  }[];
}

export interface AnalysisResult {
  feedback: FeedbackItem[];
  categoryScores: Record<string, number>;
  overallScore: number;
  isInitializing: boolean;
  repCount: number;
  consecutiveGoodReps: number;
  repHistory: {
    timestamp: number;
    score: number;
    depth: number;
    duration: number;
    feedback: FeedbackItem[];
  }[];
  lastAnalysisTime: number;
  aiInsights?: AIInsight; // Add this to fix the TypeScript error
}

export interface PoseAnalysis {
  isCorrect: boolean;
  confidence: number;
  feedback: string;
}