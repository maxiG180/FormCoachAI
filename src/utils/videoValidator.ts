import { PoseLandmarkerResult, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { VIDEO_VALIDATION } from './constants/videoConstants';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const lastValidPositions: { [key: number]: NormalizedLandmark } = {};
const stabilityBuffer: boolean[] = [];
const STABILITY_BUFFER_SIZE = 10;
const MAX_MOVEMENT_THRESHOLD = 0.1; // Maximum allowed sudden movement

export const validateVideo = async (file: File): Promise<ValidationResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];
 

  // Check file size
  if (file.size > VIDEO_VALIDATION.MAX_FILE_SIZE) {
    errors.push(`Video file size must be less than ${VIDEO_VALIDATION.MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  // Check file format
  if (!VIDEO_VALIDATION.SUPPORTED_FORMATS.includes(file.type)) {
    errors.push('Unsupported video format. Please use MP4, WebM, or QuickTime format.');
  }

  const video = document.createElement('video');
  video.preload = 'metadata';

  try {
    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;

    await new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve;
      video.onerror = reject;
    });

    // Strict duration checks
    if (video.duration > VIDEO_VALIDATION.MAX_DURATION) {
      errors.push(`Video must be shorter than ${VIDEO_VALIDATION.MAX_DURATION / 60} minutes. Consider trimming your video.`);
    }
    if (video.duration < VIDEO_VALIDATION.MIN_DURATION) {
      errors.push(`Video must be longer than ${VIDEO_VALIDATION.MIN_DURATION} seconds to analyze properly.`);
    }

    // Strict resolution checks
    if (video.videoWidth < VIDEO_VALIDATION.MIN_RESOLUTION.WIDTH || 
        video.videoHeight < VIDEO_VALIDATION.MIN_RESOLUTION.HEIGHT) {
      errors.push('Video resolution is too low. Please record with at least 720p resolution.');
    }

    // Strict aspect ratio checks
    const aspectRatio = video.videoWidth / video.videoHeight;
    if (aspectRatio < VIDEO_VALIDATION.ASPECT_RATIO.MIN || 
        aspectRatio > VIDEO_VALIDATION.ASPECT_RATIO.MAX) {
      errors.push('Invalid video orientation. Please record in portrait mode and ensure you are fully visible.');
    }

    URL.revokeObjectURL(videoUrl);
  } catch (error) {
    errors.push('Failed to validate video. Please ensure your video is properly formatted and try again.');
    console.error('Video validation error:', error);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateLandmarks = (
  results: PoseLandmarkerResult,
  exercise: string
): boolean => {
  if (!results.landmarks?.[0]) return false;

  const landmarks = results.landmarks[0];
  const requiredIndices = getTrackingRequirements(exercise);
  
  // First check: Basic visibility threshold
  const allLandmarksVisible = requiredIndices.every(index => {
    const landmark = landmarks[index];
    return landmark && landmark.visibility >= VIDEO_VALIDATION.TRACKING.MIN_LANDMARK_CONFIDENCE;
  });

  if (!allLandmarksVisible) return false;

  // Second check: Stability and consistency
  const isStable = checkLandmarkStability(landmarks, requiredIndices);
  stabilityBuffer.push(isStable);
  if (stabilityBuffer.length > STABILITY_BUFFER_SIZE) {
    stabilityBuffer.shift();
  }

  // Require majority of recent frames to be stable
  const stableFrames = stabilityBuffer.filter(Boolean).length;
  const stabilityRatio = stableFrames / stabilityBuffer.length;
  
  return stabilityRatio >= 0.7; // At least 70% of recent frames must be stable
};

const checkLandmarkStability = (
  landmarks: NormalizedLandmark[],
  requiredIndices: number[]
): boolean => {
  let isStable = true;

  for (const index of requiredIndices) {
    const currentLandmark = landmarks[index];
    const lastPosition = lastValidPositions[index];

    if (lastPosition) {
      // Check for sudden large movements
      const movement = calculateMovement(currentLandmark, lastPosition);
      if (movement > MAX_MOVEMENT_THRESHOLD) {
        isStable = false;
        break;
      }
    }

    // Update last valid position
    lastValidPositions[index] = {...currentLandmark};
  }

  return isStable;
};

export const getTrackingRequirements = (exercise: string): number[] => {
  switch (exercise.toLowerCase()) {
    case 'squats':
      return [
        23, 24, // hips
        25, 26, // knees
        27, 28, // ankles
        11, 12, // shoulders
        13, 14  // elbows (for balance tracking)
      ];
    // Add other exercises as needed
    default:
      return [];
  }
};

const calculateMovement = (
  current: NormalizedLandmark,
  last: NormalizedLandmark
): number => {
  return Math.sqrt(
    Math.pow(current.x - last.x, 2) +
    Math.pow(current.y - last.y, 2)
  );
};

export const resetStabilityTracking = () => {
  Object.keys(lastValidPositions).forEach(key => delete lastValidPositions[Number(key)]);
  stabilityBuffer.length = 0;
};