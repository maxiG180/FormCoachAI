// File: utils/constants/squatConstants.ts

export const SQUAT_CONSTANTS = {
  // Confidence thresholds
  MIN_LANDMARK_CONFIDENCE: 0.5,      // Slightly lower to improve detection reliability
  MIN_CONSECUTIVE_TRACKING_ERRORS: 3, // Keep existing value

  // Movement thresholds - carefully tuned for better rep detection
  SQUAT_DEPTH_THRESHOLD: 0.5,        // More reasonable depth target (0.5 instead of 0.6)
  SQUAT_DETECTION_THRESHOLD: 0.35,   // When to consider someone in squat position
  KNEE_ALIGNMENT_THRESHOLD: 0.25,    // Slightly more permissive knee alignment
  HIP_SYMMETRY_THRESHOLD: 0.15,      // Keep existing value
  BACK_ANGLE_THRESHOLD: 35,          // Slightly more permissive back angle
  BALANCE_THRESHOLD: 0.25,           // Keep existing value

  // Movement detection - critical for rep counting
  MOVEMENT_THRESHOLD: 0.005,         // Threshold to detect significant movement
  STATIONARY_THRESHOLD: 0.005,       // Threshold to detect stationary position

  // Score thresholds
  MIN_DEPTH_SCORE: 75,               // Slightly more forgiving depth score
  MIN_FORM_SCORE: 80,                // Slightly more forgiving form score
  
  // Rep timing - important for proper rep counting
  MIN_REP_DURATION: 400,             // More forgiving minimum rep duration (was 800ms)
  MAX_REP_DURATION: 6000,            // Keep existing value
  MIN_MOVEMENT_THRESHOLD: 0.008,     // More sensitive movement detection

  // Performance tracking
  MIN_REPS_FOR_STREAK: 3,            // Keep existing value
  PERFECT_REP_THRESHOLD: 85,         // Slightly more forgiving perfect threshold (was 90)

  // State management
  MOVEMENT_TIMEOUT: 1500,            // Increased to prevent premature resets
  FEEDBACK_COOLDOWN: 800,            // Increased to reduce feedback spam
  
  // Added for squatMovementTracker
  DEPTH_CHANGE_THRESHOLD: 0.01,     // Threshold to detect significant depth change
  BOTTOM_DEPTH_THRESHOLD: 0.55,      // Threshold for bottom position
} as const;

export type SquatConstant = keyof typeof SQUAT_CONSTANTS;