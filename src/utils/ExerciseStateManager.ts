// File: utils/ExerciseStateManager.ts
// Manages global exercise state and ensures UI stays in sync

import { SquatState } from "@/types/squat";

const initialSquatState: SquatState = {
  isActive: true,
  feedbackGiven: false,
  startTime: Date.now(),
  lastFeedbackTime: 0,
  repCount: 0,
  consecutiveGoodReps: 0,
  trackingErrorCount: 0,
  initialPositions: {
    hipHeight: 0,
    kneeHeight: 0,
    shoulderHeight: 0,
    hipCenterX: 0,
    kneeCenterX: 0,
    lastHipHeight: 0,
  },
  lastMovementTime: Date.now(),
  currentScore: 100,
  scoreHistory: [],
  repHistory: [],
  maxDepthReached: 1,
  lastAnalysisTime: 0,
  repStartTime: 0,
  isInSquat: false,
  repPhase: 'start',
  lastDepth: 1
};

export class ExerciseStateManager {
  // Keep states for all exercise types
  private static states: { [key: string]: any } = {
    Squats: { ...initialSquatState }
  };

  // Get current state for an exercise
  public static getState(exercise: string): any {
    return this.states[exercise] || null;
  }

  // Update state for an exercise
  public static setState(exercise: string, state: any): void {
    this.states[exercise] = {...state}; // Create new object to ensure updates
  }

  // Reset state to initial values
  public static resetState(exercise: string): void {
    if (exercise === 'Squats') {
      this.states[exercise] = { ...initialSquatState };
    }
  }
  
  // Update rep count and ensure UI sync
  public static updateRepCount(exercise: string, count: number): void {
    if (!this.states[exercise]) return;
    
    // Update count and force state refresh
    this.states[exercise].repCount = count;
    this.setState(exercise, this.states[exercise]);
  }
}