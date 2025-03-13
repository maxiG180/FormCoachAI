export interface FeedbackItem {
  type: 'success' | 'warning' | 'error';
  category: 'form' | 'depth' | 'alignment' | 'balance';
  message: string;
  timestamp: number;
  severity?: 'minor' | 'moderate' | 'major';
  keypoints?: Landmark[];
}

export interface Landmark {
  x: number;
  y: number;
  visibility: number;
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

// Add the missing RepPhase type
export type RepPhase = 'start' | 'descent' | 'bottom' | 'ascent' | 'top';

// Add the missing SquatMetrics interface
export interface SquatMetrics {
  depth: number;
  duration: number;
  backAngle: number;
  kneeAlignment: number;
  balance: number;
}

// Add the missing RepHistoryItem interface
export interface RepHistoryItem {
  timestamp: number;
  score: number;
  metrics: SquatMetrics;
}

// Add the missing SquatState interface
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
  maxDepthReached?: number;
  lastAnalysisTime?: number;
  repStartTime?: number;
  isInSquat?: boolean;
  repPhase?: RepPhase;
  lastDepth?: number;
}

export interface AnalysisResult {
  feedback: FeedbackItem[];
  categoryScores: Record<string, number>;
  overallScore: number;
  isInitializing: boolean;
  repCount?: number;
  consecutiveGoodReps?: number;
  repHistory?: RepHistoryItem[];
  lastAnalysisTime?: number;
  aiInsights?: AIInsight;
  isVideoComplete?: boolean;
  aiConfidence?: number;
}

export interface ExerciseHistory {
  date: string;
  score: number;
}

export interface ExerciseFormMetrics {
  [key: string]: number;
}

export interface ExerciseData {
  totalReps: number;
  bestScore: number;
  lastPerformed: string;
  history: ExerciseHistory[];
  form: ExerciseFormMetrics;
}

export interface ExerciseStats {
  [key: string]: ExerciseData;
}

export type ExerciseName = "Squats" | "Bench Press" | "Deadlifts";

export interface Workout {
  date: string;
  exercise: string;
  score: number;
  reps: number;
}

export interface ImprovementArea {
  name: string;
  value: number;
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
  landmarks: unknown[];  // Using unknown instead of any
  confidence: number;
}