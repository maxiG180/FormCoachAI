// File: types/analyze.ts

export interface FeedbackItem {
  type: 'success' | 'warning' | 'error';
  category: 'form' | 'depth' | 'alignment' | 'balance';
  message: string;
  timestamp: number;
  severity?: 'minor' | 'moderate' | 'major';
  keypoints?: any[];
}

export interface AIIssue {
  type: string;
  confidence: number;
}

export interface AIInsight {
  category: string;
  confidence: number;
  issues: AIIssue[];
}

export interface AnalysisResult {
  feedback: FeedbackItem[];
  categoryScores: Record<string, number>;
  overallScore: number;
  isInitializing: boolean;
  repCount?: number;
  consecutiveGoodReps?: number;
  repHistory?: Array<{
    timestamp: number;
    score: number;
    depth: number;
    duration: number;
    feedback?: FeedbackItem[];
  }>;
  lastAnalysisTime?: number;
  aiInsights?: AIInsight;
  isVideoComplete?: boolean;
  aiConfidence?: number; // Add this new field
}