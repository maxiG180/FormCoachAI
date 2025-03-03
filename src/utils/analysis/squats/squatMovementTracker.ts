// File: utils/analysis/squats/squatMovementTracker.ts
// This file handles the core logic for detecting squat movements and counting reps

import { SquatAnalyzer } from "../squatAnalyzer";
import { SQUAT_CONSTANTS } from "../../constants/squatConstants";
import { RepPhase } from '@/types/squat';
import { ExerciseStateManager } from "@/utils/ExerciseStateManager";

// Adjusted thresholds based on actual log values
const DEPTH_THRESHOLD = 0.14;  // Depths around 0.142-0.145
const MOTION_THRESHOLD = 0.002; // More sensitive for small movements
const MIN_DEPTH_FOR_REP = 0.13;
const MAX_NORMAL_DEPTH = 0.15;

let prevIsInSquatPosition = false;
let inMotion = false;
let lastDepth = 1;

export const updateMovementPhase = (analyzer: SquatAnalyzer, depth: number): void => {
  const currentTime = Date.now();
  const depthDelta = depth - lastDepth;
  
  // Adjusted squat position detection
  const isInSquatPosition = depth <= DEPTH_THRESHOLD && depth >= MIN_DEPTH_FOR_REP;
  
  console.log('Movement tracking (Debug):', {
    currentDepth: depth,
    delta: depthDelta,
    isInSquatPosition,
    prevIsInSquatPosition,
    repPhase: analyzer.repPhase,
    repCount: analyzer.state.repCount,
    thresholds: {
      DEPTH_THRESHOLD,
      MIN_DEPTH_FOR_REP,
      motion: MOTION_THRESHOLD
    }
  });

  // Start of movement detection
  if (Math.abs(depthDelta) > MOTION_THRESHOLD && !inMotion) {
    inMotion = true;
    console.log("Motion detected", { depthDelta, threshold: MOTION_THRESHOLD });
  }

  // Rep counting logic
  if (prevIsInSquatPosition && !isInSquatPosition && inMotion) {
    analyzer.completeRep();
    inMotion = false;
    console.log("Rep completed", { newCount: analyzer.state.repCount });
  }

  prevIsInSquatPosition = isInSquatPosition;
  lastDepth = depth;
};

// Reset all tracking variables
export const resetMovementTracking = () => {
  prevIsInSquatPosition = false;
  inMotion = false;
  lastDepth = 1;
}