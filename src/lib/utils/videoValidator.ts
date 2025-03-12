"use client";

import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";

// Video validation constants - normally would be imported
const VIDEO_VALIDATION = {
  // File size limits
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  
  // Resolution thresholds
  MIN_WIDTH: 320,
  MIN_HEIGHT: 240,
  RECOMMENDED_WIDTH: 640,
  RECOMMENDED_HEIGHT: 480,
};

// Tracking stability management
let stabilityCounter = 0;
let previousLandmarkPositions: {[key: number]: {x: number, y: number}} = {};

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a video file before processing
 */
export const validateVideo = async (file: File): Promise<ValidationResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check file type
  if (!file.type.startsWith("video/")) {
    errors.push("Invalid file type. Please upload a video file.");
  }
  
  // Check file size
  if (file.size > VIDEO_VALIDATION.MAX_FILE_SIZE) {
    errors.push(`File size exceeds the maximum limit of ${VIDEO_VALIDATION.MAX_FILE_SIZE / (1024 * 1024)}MB.`);
  }
  
  // Additional validations for video dimensions would require creating a video element
  // and waiting for metadata to load, which we'll handle in a different way in the VideoPlayer component
  
  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      warnings,
    };
  }
  
  return {
    isValid: true,
    errors: [],
    warnings,
  };
};

/**
 * Validates the pose landmarks for tracking stability and visibility
 */
export const validateLandmarks = (
  pose: PoseLandmarkerResult,
  exercise: string
): boolean => {
  // No landmarks present means tracking failed
  if (!pose.landmarks || pose.landmarks.length === 0) {
    return false;
  }
  
  const landmarks = pose.landmarks[0];
  
  // Key landmarks for exercises (indexes of important landmarks to track)
  const keyLandmarks: { [key: string]: number[] } = {
    "Squats": [23, 24, 25, 26, 27, 28], // Hips, knees, ankles
    "Bench Press": [11, 12, 13, 14, 15, 16], // Shoulders, elbows, wrists
    "Deadlifts": [11, 12, 23, 24, 25, 26, 27, 28], // Shoulders, hips, knees, ankles
  };
  
  // Get important landmarks for the current exercise
  const importantIndices = keyLandmarks[exercise] || [];
  
  // Check if all important landmarks are visible
  for (const index of importantIndices) {
    if (!landmarks[index] || landmarks[index].visibility < 0.6) {
      return false;
    }
  }
  
  // Check stability by comparing with previous positions
  const currentPositions: {[key: number]: {x: number, y: number}} = {};
  let totalMovement = 0;
  let comparedPoints = 0;
  
  for (const index of importantIndices) {
    currentPositions[index] = {
      x: landmarks[index].x,
      y: landmarks[index].y
    };
    
    // Compare with previous position if available
    if (previousLandmarkPositions[index]) {
      const prevPos = previousLandmarkPositions[index];
      const dx = currentPositions[index].x - prevPos.x;
      const dy = currentPositions[index].y - prevPos.y;
      totalMovement += Math.sqrt(dx * dx + dy * dy);
      comparedPoints++;
    }
  }
  
  // Save current positions for next comparison
  previousLandmarkPositions = currentPositions;
  
  // If we don't have enough points to compare yet, assume it's valid
  if (comparedPoints < importantIndices.length / 2) {
    return true;
  }
  
  // Calculate average movement
  const avgMovement = totalMovement / comparedPoints;
  
  // If average movement is too large, consider tracking unstable
  if (avgMovement > 0.1) {
    stabilityCounter++;
    // Only fail after consecutive unstable frames
    return stabilityCounter < 5;
  } else {
    // Reset stability counter if movement is normal
    stabilityCounter = Math.max(0, stabilityCounter - 1);
    return true;
  }
};

/**
 * Resets the stability tracking data
 */
export const resetStabilityTracking = (): void => {
  stabilityCounter = 0;
  previousLandmarkPositions = {};
};