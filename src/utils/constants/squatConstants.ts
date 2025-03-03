// File: utils/constants/squatConstants.ts

export const SQUAT_CONSTANTS = {
  // Confidence thresholds
  MIN_LANDMARK_CONFIDENCE: 0.7,
  MIN_CONSECUTIVE_TRACKING_ERRORS: 3,

  // Movement thresholds
  SQUAT_DEPTH_THRESHOLD: 0.6,    // Relative depth threshold (0-1)
  KNEE_ALIGNMENT_THRESHOLD: 0.3,  // Maximum knee deviation from hip center
  HIP_SYMMETRY_THRESHOLD: 0.15,   // Maximum hip tilt
  BACK_ANGLE_THRESHOLD: 30,       // Maximum back angle in degrees
  BALANCE_THRESHOLD: 0.25,        // Maximum allowed lateral shift

  // Score thresholds
  MIN_DEPTH_SCORE: 80,           // Minimum depth score for perfect rep
  MIN_FORM_SCORE: 85,            // Minimum form score for perfect rep

  // Rep timing
  MIN_REP_DURATION: 800,         // Minimum milliseconds for a rep
  MAX_REP_DURATION: 5000,        // Maximum milliseconds for a rep
  MIN_MOVEMENT_THRESHOLD: 0.01,   // Minimum movement to detect change

  // Performance tracking
  MIN_REPS_FOR_STREAK: 3,        // Number of good reps needed for streak message
  PERFECT_REP_THRESHOLD: 90,     // Score threshold for perfect rep

  // State management
  MOVEMENT_TIMEOUT: 1000,        // Milliseconds before resetting if no movement
  FEEDBACK_COOLDOWN: 500,        // Minimum ms between feedback updates
} as const;

export type SquatConstant = keyof typeof SQUAT_CONSTANTS;