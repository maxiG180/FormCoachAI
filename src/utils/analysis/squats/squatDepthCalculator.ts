// File: utils/analysis/squats/squatDepthCalculator.ts

import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { validateSquatLandmarks } from "./squatValidation";

const depthBuffer: number[] = [];
const DEPTH_BUFFER_SIZE = 5;

export const calculateDepth = (
  landmarks: NormalizedLandmark[],
  lastDepth: number
): number => {
  if (!landmarks) return lastDepth;

  // Get key landmarks
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];
  const leftAnkle = landmarks[27];
  const rightAnkle = landmarks[28];

  // Check if landmarks are valid
  if (!validateSquatLandmarks([leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle])) {
    return lastDepth;
  }

  // For front-facing camera, a different calculation works better
  // Calculate hip height relative to ankles
  const hipHeight = (leftHip.y + rightHip.y) / 2;
  const kneeHeight = (leftKnee.y + rightKnee.y) / 2;
  const ankleHeight = (leftAnkle.y + rightAnkle.y) / 2;

  // Higher values = less deep squat (standing)
  // Lower values = deeper squat
  const standingRatio = (hipHeight - ankleHeight) / (kneeHeight - ankleHeight);
  
  // Normalize to 0-1 range where 0 is deep squat and 1 is standing
  const normalizedDepth = Math.min(1, Math.max(0, standingRatio));

  // Apply smoothing
  depthBuffer.push(normalizedDepth);
  if (depthBuffer.length > DEPTH_BUFFER_SIZE) {
    depthBuffer.shift();
  }

  // Return the average of the last few depth values
  return depthBuffer.reduce((a, b) => a + b, 0) / depthBuffer.length;
};