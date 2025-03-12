import { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type RepPhase = 'start' | 'descent' | 'bottom' | 'ascent' | 'top';

export interface SquatMetrics {
  depth: number;
  duration: number;
  backAngle: number;
  kneeAlignment: number;
  balance: number;
}

export interface RepHistoryItem {
  timestamp: number;
  score: number;
  metrics: SquatMetrics;
}

export interface SquatState {
  isActive: boolean;
  feedbackGiven: boolean;
  startTime: number;
  lastFeedbackTime: number;
  repCount: number;
  consecutiveGoodReps: number;
  trackingErrorCount: number;
  initialPositions: {
    hipHeight: number;
    kneeHeight: number;
    shoulderHeight: number;
    hipCenterX: number;
    kneeCenterX: number;
    lastHipHeight: number;
  };
  lastMovementTime: number;
  currentScore: number;
  scoreHistory: number[];
  repHistory: RepHistoryItem[];
  
  // Additional properties from the error
  maxDepthReached?: number;
  lastAnalysisTime?: number;
  repStartTime?: number;
  isInSquat?: boolean;
  repPhase?: RepPhase;
  lastDepth?: number;
}

export interface SquatAnalyzerConfig {
  minLandmarkConfidence: number;
  minRepDuration: number;
  maxRepDuration: number;
  depthThreshold: number;
  backAngleThreshold: number;
  balanceThreshold: number;
  kneeAlignmentThreshold: number;
}

export interface SquatValidationResult {
  isValid: boolean;
  landmarks: NormalizedLandmark[];
  confidence: number;
} 