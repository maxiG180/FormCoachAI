// File: utils/analysis/squats/squatValidation.ts

import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { SQUAT_CONSTANTS } from "../../constants/squatConstants";

export const validateSquatLandmarks = (landmarks: NormalizedLandmark[]): boolean => {
  // Improved validation to handle missing landmarks more gracefully
  return landmarks.every(landmark => 
    landmark && 
    typeof landmark.x === 'number' && 
    typeof landmark.y === 'number' && 
    typeof landmark.visibility === 'number' &&
    landmark.visibility >= SQUAT_CONSTANTS.MIN_LANDMARK_CONFIDENCE
  );
};

export const isValidRep = (
  repDuration: number,
  maxDepthReached: number,
  landmarks: NormalizedLandmark[]
): boolean => {
  // More lenient rep validation to improve rep counting
  const isValidDuration = repDuration >= SQUAT_CONSTANTS.MIN_REP_DURATION && 
                          repDuration <= SQUAT_CONSTANTS.MAX_REP_DURATION;
  
  const isDeepEnough = maxDepthReached >= 0.4; // Minimum acceptable depth
  
  const hasValidLandmarks = landmarks.length >= 6 && 
                            validateSquatLandmarks(landmarks.slice(0, 6));
  
  return isValidDuration && isDeepEnough && hasValidLandmarks;
};