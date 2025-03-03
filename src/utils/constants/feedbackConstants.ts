// File: utils/constants/feedbackConstants.ts

export const FEEDBACK_CONSTANTS = {
  SEVERITY_SCORES: {
    minor: 5,
    moderate: 15,
    major: 25,
  },
  
  CATEGORY_WEIGHTS: {
    form: 0.3,
    depth: 0.25,
    alignment: 0.25,
    balance: 0.2,
  },

  SETTINGS: {
    COOLDOWN: 2000,
    DURATION: 4000,
    MAX_ITEMS: 5,
  },
} as const;

// Type exports for better type inference
export type SeverityScore = keyof typeof FEEDBACK_CONSTANTS.SEVERITY_SCORES;
export type CategoryWeight = keyof typeof FEEDBACK_CONSTANTS.CATEGORY_WEIGHTS;