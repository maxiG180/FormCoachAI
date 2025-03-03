// File: types/exerciseTypes.ts

import { FeedbackItem } from "@/types/analyze";

export interface RepData {
  timestamp: number;
  score: number;
  feedback: FeedbackItem[];
  depth: number;
  duration: number;
}

export interface ExercisePositionRecord {
  [key: string]: number; // Allow any string key with a number value
}

export interface ExercisePositions extends ExercisePositionRecord {
  hipHeight: number;
  kneeHeight: number;
  shoulderHeight: number;
  hipCenterX: number;
  kneeCenterX: number;
  lastHipHeight: number;
}

export interface RepHistoryItem {
  timestamp: number;
  score: number;
  metrics: {
    depth: number;
    duration: number;
    backAngle: number;
    kneeAlignment: number;
    balance: number;
  };
}

export interface ExerciseState {
  isActive: boolean;
  feedbackGiven: boolean;
  startTime: number;
  lastFeedbackTime: number;
  repCount: number;
  consecutiveGoodReps: number;
  trackingErrorCount: number;
  initialPositions: ExercisePositions;
  lastMovementTime: number;
  currentScore: number;
  scoreHistory: number[];
  repHistory: RepHistoryItem[];
}

export interface SquatState extends ExerciseState {
  maxDepthReached: number;
  lastAnalysisTime: number;
  repStartTime: number;
  isInSquat: boolean;
  repPhase: 'start' | 'descent' | 'bottom' | 'ascent';
  lastDepth: number;
}

export interface KeyLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface KeyLandmarks {
  leftHip: KeyLandmark;
  rightHip: KeyLandmark;
  leftKnee: KeyLandmark;
  rightKnee: KeyLandmark;
  leftAnkle: KeyLandmark;
  rightAnkle: KeyLandmark;
  leftShoulder: KeyLandmark;
  rightShoulder: KeyLandmark;
}