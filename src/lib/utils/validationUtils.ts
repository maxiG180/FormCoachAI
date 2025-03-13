// src/lib/utils/validationUtils.ts

import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { VIDEO_VALIDATION } from "@/lib/utils/constants/videoConstants";
import { SQUAT_CONSTANTS } from "@/lib/utils/constants/squatConstants";

interface VideoValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  errorCode?: string;
}

interface PoseValidationResult {
  isValid: boolean;
  errorMessage?: string;
  errorCode?: string;
  confidence: number;
  missingLandmarks?: number[];
}

// Track stability across frames
let stabilityCounter = 0;
let previousLandmarkPositions: Record<number, {x: number, y: number}> = {};
let trackingErrorCount = 0;

/**
 * Validates video file properties before processing
 */
export const validateVideoFile = async (file: File): Promise<VideoValidationResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if file exists
  if (!file) {
    return {
      isValid: false,
      errors: ["No video file selected."],
      warnings: [],
      errorCode: "NO_FILE"
    };
  }
  
  // Check file type
  if (!VIDEO_VALIDATION.SUPPORTED_FORMATS.includes(file.type)) {
    errors.push(`Unsupported file format. Please use: ${VIDEO_VALIDATION.SUPPORTED_FORMATS.join(", ")}`);
    return {
      isValid: false,
      errors,
      warnings,
      errorCode: "INVALID_FORMAT"
    };
  }
  
  // Check file size
  if (file.size > VIDEO_VALIDATION.MAX_FILE_SIZE) {
    errors.push(`File size exceeds the maximum limit of ${VIDEO_VALIDATION.MAX_FILE_SIZE / (1024 * 1024)}MB.`);
    return {
      isValid: false,
      errors,
      warnings,
      errorCode: "FILE_TOO_LARGE"
    };
  }
  
  // For video dimensions and duration, we need to create a video element
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    
    video.onloadedmetadata = () => {
      // Check video duration
      if (video.duration < VIDEO_VALIDATION.MIN_DURATION) {
        warnings.push(`Video is shorter than the recommended minimum of ${VIDEO_VALIDATION.MIN_DURATION} seconds.`);
      }
      
      if (video.duration > VIDEO_VALIDATION.MAX_DURATION) {
        errors.push(`Video exceeds the maximum duration of ${VIDEO_VALIDATION.MAX_DURATION / 60} minutes.`);
      }
      
      // Check video dimensions
      if (video.videoWidth < VIDEO_VALIDATION.MIN_RESOLUTION.WIDTH || 
          video.videoHeight < VIDEO_VALIDATION.MIN_RESOLUTION.HEIGHT) {
        warnings.push(`Video resolution is lower than the recommended minimum of ${VIDEO_VALIDATION.MIN_RESOLUTION.WIDTH}x${VIDEO_VALIDATION.MIN_RESOLUTION.HEIGHT}.`);
      }
      
      // Check aspect ratio
      const aspectRatio = video.videoWidth / video.videoHeight;
      if (aspectRatio < VIDEO_VALIDATION.ASPECT_RATIO.MIN || 
          aspectRatio > VIDEO_VALIDATION.ASPECT_RATIO.MAX) {
        warnings.push("Video aspect ratio is not optimal for exercise analysis. Try recording in landscape mode.");
      }
      
      URL.revokeObjectURL(video.src);
      
      if (errors.length > 0) {
        resolve({
          isValid: false,
          errors,
          warnings,
          errorCode: "VIDEO_PROPERTIES_INVALID"
        });
      } else {
        resolve({
          isValid: true,
          errors: [],
          warnings
        });
      }
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        isValid: false,
        errors: ["Failed to load video. The file may be corrupted."],
        warnings: [],
        errorCode: "VIDEO_LOAD_ERROR"
      });
    };
    
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Reset all tracking data when starting a new analysis
 */
export const resetTrackingData = (): void => {
  stabilityCounter = 0;
  previousLandmarkPositions = {};
  trackingErrorCount = 0;
};

/**
 * Validates if the pose detected is suitable for squat analysis
 */
export const validatePoseForSquats = (pose: PoseLandmarkerResult): PoseValidationResult => {
  // No landmarks detected
  if (!pose.landmarks || pose.landmarks.length === 0 || !pose.landmarks[0]) {
    trackingErrorCount++;
    return {
      isValid: trackingErrorCount < VIDEO_VALIDATION.TRACKING.LOSS_THRESHOLD,
      errorMessage: "No body detected in frame.",
      errorCode: "NO_BODY_DETECTED",
      confidence: 0
    };
  }
  
  const landmarks = pose.landmarks[0];
  
  // Key landmarks required for squat analysis
  const requiredLandmarks = [
    { index: 11, name: "left shoulder" },
    { index: 12, name: "right shoulder" },
    { index: 23, name: "left hip" },
    { index: 24, name: "right hip" },
    { index: 25, name: "left knee" },
    { index: 26, name: "right knee" },
    { index: 27, name: "left ankle" },
    { index: 28, name: "right ankle" }
  ];
  
  // Check if all required landmarks are visible with sufficient confidence
  const missingLandmarks = requiredLandmarks.filter(
    ({ index }) => !landmarks[index] || 
                   (landmarks[index].visibility !== undefined && 
                    landmarks[index].visibility < VIDEO_VALIDATION.TRACKING.MIN_LANDMARK_CONFIDENCE)
  );
  
  if (missingLandmarks.length > 0) {
    trackingErrorCount++;
    
    if (trackingErrorCount >= VIDEO_VALIDATION.TRACKING.LOSS_THRESHOLD) {
      // Create a user-friendly error message
      const missingParts = missingLandmarks.map(lm => lm.name);
      let errorMessage = `Cannot track ${missingParts.join(", ")}. `;
      
      // Add suggestions based on what's missing
      if (missingLandmarks.some(lm => lm.index >= 23)) { // Lower body landmarks
        errorMessage += "Ensure your full body is visible in the frame. ";
      }
      
      if (missingLandmarks.length > requiredLandmarks.length / 2) {
        errorMessage += "Try recording from a side angle with better lighting.";
      }
      
      return {
        isValid: false,
        errorMessage,
        errorCode: "LANDMARKS_NOT_VISIBLE",
        confidence: 0,
        missingLandmarks: missingLandmarks.map(lm => lm.index)
      };
    }
    
    return {
      isValid: true, // Still valid but track the error count
      confidence: 0.5,
      missingLandmarks: missingLandmarks.map(lm => lm.index)
    };
  }
  
  // Reset tracking error count since landmarks are visible
  trackingErrorCount = 0;
  
  // Check for camera angle issues by analyzing the relative positions
  // For squats, we want a side view (profile view)
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  
  // Calculate shoulder and hip widths in the image
  const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
  const hipWidth = Math.abs(leftHip.x - rightHip.x);
  
  // Determine if camera angle is appropriate
  // For a proper side view, shoulders and hips should be closely aligned horizontally
  // (i.e., one shoulder should be mostly obscuring the other in a side view)
  const isSideView = shoulderWidth < 0.15 && hipWidth < 0.15;
  
  if (!isSideView) {
    stabilityCounter++;
    
    if (stabilityCounter > 10) { // Allow a few frames of bad angle before giving error
      let errorMessage = "Camera angle is not optimal for squat analysis. ";
      
      if (shoulderWidth > 0.15 && hipWidth > 0.15) {
        errorMessage += "Please record from a side view (90 degrees to your left or right side).";
      } else {
        errorMessage += "Adjust your camera position for a clear side profile view.";
      }
      
      return {
        isValid: false,
        errorMessage,
        errorCode: "INCORRECT_CAMERA_ANGLE",
        confidence: 0.3
      };
    }
  } else {
    // Reset stability counter if angle is good
    stabilityCounter = Math.max(0, stabilityCounter - 1);
  }
  
  // Check tracking stability by comparing with previous positions
  const currentPositions: Record<number, {x: number, y: number}> = {};
  let totalMovement = 0;
  let comparedPoints = 0;
  
  for (const { index } of requiredLandmarks) {
    const landmark = landmarks[index];
    currentPositions[index] = { x: landmark.x, y: landmark.y };
    
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
  
  // Calculate confidence based on visibility and stability
  const avgVisibility = requiredLandmarks.reduce(
    (sum, { index }) => sum + (landmarks[index].visibility || 0), 
    0
  ) / requiredLandmarks.length;
  
  const confidenceScore = avgVisibility * 100;
  
  return {
    isValid: true,
    confidence: confidenceScore
  };
};

/**
 * Utility to calculate angle between three points
 */
export function calculateAngle(
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number }
): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * (180 / Math.PI));
  if (angle > 180) {
    angle = 360 - angle;
  }
  return angle;
}