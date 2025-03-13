// src/lib/utils/squatAnalyzer.ts

import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { 
  FeedbackItem, 
  AnalysisResult, 
  Landmark,
  SquatState, 
  RepPhase,
  RepHistoryItem
} from "@/lib/types/analyze";
import { SQUAT_CONSTANTS } from "@/lib/utils/constants/squatConstants";
import { FEEDBACK_CONSTANTS } from "@/lib/utils/constants/feedbackConstants";
import { validatePoseForSquats, calculateAngle } from "@/lib/utils/validationUtils";

// Store states based on exercise type
const EXERCISE_STATES: Record<string, SquatState> = {};
const FEEDBACK_HISTORY: Record<string, FeedbackItem[]> = {};

/**
 * Initializes or resets the state for a specific exercise
 */
export const initializeExerciseState = (exerciseType: string): void => {
  EXERCISE_STATES[exerciseType] = {
    isActive: false,
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
      lastHipHeight: 0
    },
    lastMovementTime: Date.now(),
    currentScore: 100,
    scoreHistory: [],
    repHistory: [],
    repPhase: 'start'
  };
  
  FEEDBACK_HISTORY[exerciseType] = [];
};

/**
 * Main function to analyze squat form
 */
export const analyzeSquatForm = (pose: PoseLandmarkerResult): AnalysisResult => {
  const exerciseType = "Squats";
  
  // Initialize state if needed
  if (!EXERCISE_STATES[exerciseType]) {
    initializeExerciseState(exerciseType);
  }
  
  const state = EXERCISE_STATES[exerciseType];
  const feedback: FeedbackItem[] = [...FEEDBACK_HISTORY[exerciseType]];
  
  // Initialize category scores
  const categoryScores: Record<string, number> = {
    form: 100,
    depth: 100,
    alignment: 100,
    balance: 100
  };
  
  // Validate pose tracking quality first
  const validationResult = validatePoseForSquats(pose);
  
  if (!validationResult.isValid) {
    return {
      feedback: [{
        type: "error",
        category: "form",
        message: validationResult.errorMessage || "Tracking lost - ensure full body visibility",
        timestamp: Date.now(),
        keypoints: []
      }],
      categoryScores,
      overallScore: 0,
      repCount: state.repCount,
      consecutiveGoodReps: state.consecutiveGoodReps,
      isInitializing: false,
      aiConfidence: validationResult.confidence
    };
  }
  
  // If pose is valid, continue with analysis
  if (!pose.landmarks || pose.landmarks.length === 0) {
    return {
      feedback,
      categoryScores,
      overallScore: 0,
      repCount: state.repCount,
      consecutiveGoodReps: state.consecutiveGoodReps,
      isInitializing: true,
      aiConfidence: 0
    };
  }
  
  const landmarks = pose.landmarks[0];
  const currentTime = Date.now();
  
  // Get key landmarks
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];
  
  // Calculate positions
  const hipHeight = (leftHip.y + rightHip.y) / 2;
  const kneeHeight = (leftKnee.y + rightKnee.y) / 2;
  const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;
  const hipCenterX = (leftHip.x + rightHip.x) / 2;
  const kneeCenterX = (leftKnee.x + rightKnee.x) / 2;
  
  // Initialize reference positions if needed
  if (state.initialPositions.hipHeight === 0) {
    state.initialPositions = {
      hipHeight: hipHeight,
      kneeHeight: kneeHeight,
      shoulderHeight: shoulderHeight,
      hipCenterX: hipCenterX,
      kneeCenterX: kneeCenterX,
      lastHipHeight: hipHeight
    };
  }
  
  // Track movement and depth
  const movementSince = Math.abs(hipHeight - state.initialPositions.lastHipHeight);
  const isMoving = movementSince > SQUAT_CONSTANTS.MOVEMENT_THRESHOLD;
  
  if (isMoving) {
    state.lastMovementTime = currentTime;
  }
  
  // Calculate relative squat depth (0 = standing, 1 = full depth)
  const relativeDepth = (hipHeight - state.initialPositions.hipHeight) / 
                         (kneeHeight - state.initialPositions.hipHeight);
  
  // Determine squat phase
  const prevPhase = state.repPhase;
  
  // Track squat phases
  if (relativeDepth < SQUAT_CONSTANTS.SQUAT_DETECTION_THRESHOLD) {
    // Standing/starting position
    if (state.repPhase === 'bottom' || state.repPhase === 'ascent') {
      // Completed a rep
      state.repCount++;
      state.repPhase = 'top';
    } else if (state.repPhase !== 'top') {
      state.repPhase = 'top';
    }
  } else if (relativeDepth >= SQUAT_CONSTANTS.SQUAT_DETECTION_THRESHOLD && 
             relativeDepth < SQUAT_CONSTANTS.BOTTOM_DEPTH_THRESHOLD) {
    // Transitioning (either down or up)
    if (state.lastDepth !== undefined) {
      if (relativeDepth > state.lastDepth) {
        state.repPhase = 'descent';
      } else if (relativeDepth < state.lastDepth) {
        state.repPhase = 'ascent';
      }
    } else {
      state.repPhase = 'descent';
    }
  } else if (relativeDepth >= SQUAT_CONSTANTS.BOTTOM_DEPTH_THRESHOLD) {
    // Bottom of squat
    state.repPhase = 'bottom';
    
    // Track maximum depth
    if (!state.maxDepthReached || relativeDepth > state.maxDepthReached) {
      state.maxDepthReached = relativeDepth;
    }
  }
  
  // Store current depth for next comparison
  state.lastDepth = relativeDepth;
  
  // If phase changed, analyze the movement
  if (prevPhase !== state.repPhase) {
    analyzePhaseTransition(state, prevPhase, landmarks, feedback, categoryScores);
  }
  
  // Update reference position
  state.initialPositions.lastHipHeight = hipHeight;
  
  // Update feedback history
  FEEDBACK_HISTORY[exerciseType] = feedback;
  
  // Calculate overall score based on category scores and weights
  const weights = FEEDBACK_CONSTANTS.CATEGORY_WEIGHTS;
  const overallScore = Math.round(
    Object.entries(categoryScores).reduce(
      (total, [category, score]) => 
        total + score * weights[category as keyof typeof weights], 
      0
    )
  );
  
  return {
    feedback,
    categoryScores,
    overallScore,
    repCount: state.repCount,
    consecutiveGoodReps: state.consecutiveGoodReps,
    repHistory: state.repHistory,
    isInitializing: false,
    aiConfidence: validationResult.confidence
  };
};

/**
 * Analyze transitions between squat phases
 */
function analyzePhaseTransition(
  state: SquatState,
  prevPhase: RepPhase | undefined,
  landmarks: Record<number, { x: number; y: number; z: number; visibility?: number }>,
  feedback: FeedbackItem[],
  categoryScores: Record<string, number>
): void {
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];
  const leftAnkle = landmarks[27];
  const rightAnkle = landmarks[28];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  
  if (state.repPhase === 'descent') {
    // Starting a new rep
    if (prevPhase === 'top' || prevPhase === 'start') {
      state.repStartTime = Date.now();
      state.maxDepthReached = 0;
      state.currentScore = 100;
    }
    
    // Check for common descent issues
    
    // 1. Check knee alignment (knees should track over toes)
    const leftKneeAlign = (leftKnee.x - leftAnkle.x) / (leftHip.x - leftAnkle.x);
    const rightKneeAlign = (rightKnee.x - rightAnkle.x) / (rightHip.x - rightAnkle.x);
    
    if (Math.abs(leftKneeAlign) > SQUAT_CONSTANTS.KNEE_ALIGNMENT_THRESHOLD ||
        Math.abs(rightKneeAlign) > SQUAT_CONSTANTS.KNEE_ALIGNMENT_THRESHOLD) {
      if (Date.now() - state.lastFeedbackTime > SQUAT_CONSTANTS.FEEDBACK_COOLDOWN) {
        addFeedback(
          "Keep your knees in line with your toes",
          "alignment",
          "error",
          "moderate",
          [
            { x: leftHip.x, y: leftHip.y, visibility: leftHip.visibility || 1 },
            { x: leftKnee.x, y: leftKnee.y, visibility: leftKnee.visibility || 1 },
            { x: leftAnkle.x, y: leftAnkle.y, visibility: leftAnkle.visibility || 1 }
          ],
          feedback,
          categoryScores
        );
        state.lastFeedbackTime = Date.now();
        state.currentScore -= 10;
      }
    }
    
    // 2. Check back angle (avoid excessive forward lean)
    const torsoAngle = calculateAngle(
      { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 },
      { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 },
      { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 - 0.1 }
    );
    
    if (torsoAngle < SQUAT_CONSTANTS.BACK_ANGLE_THRESHOLD) {
      if (Date.now() - state.lastFeedbackTime > SQUAT_CONSTANTS.FEEDBACK_COOLDOWN) {
        addFeedback(
          "Try to keep your back more upright",
          "form",
          "warning",
          "moderate",
          [
            { x: leftShoulder.x, y: leftShoulder.y, visibility: leftShoulder.visibility || 1 },
            { x: leftHip.x, y: leftHip.y, visibility: leftHip.visibility || 1 },
            { x: leftKnee.x, y: leftKnee.y, visibility: leftKnee.visibility || 1 }
          ],
          feedback,
          categoryScores
        );
        state.lastFeedbackTime = Date.now();
        state.currentScore -= 8;
      }
    }
  } 
  else if (state.repPhase === 'bottom') {
    // Check depth
    if (state.maxDepthReached && 
        state.maxDepthReached < SQUAT_CONSTANTS.SQUAT_DEPTH_THRESHOLD) {
      if (Date.now() - state.lastFeedbackTime > SQUAT_CONSTANTS.FEEDBACK_COOLDOWN) {
        addFeedback(
          "Try to squat deeper for better muscle activation",
          "depth",
          "warning",
          "moderate",
          [
            { x: leftHip.x, y: leftHip.y, visibility: leftHip.visibility || 1 },
            { x: leftKnee.x, y: leftKnee.y, visibility: leftKnee.visibility || 1 },
            { x: leftAnkle.x, y: leftAnkle.y, visibility: leftAnkle.visibility || 1 }
          ],
          feedback,
          categoryScores
        );
        state.lastFeedbackTime = Date.now();
        state.currentScore -= 15;
      }
    }
    
    // Check for balance issues
    const hipShift = Math.abs(leftHip.x - rightHip.x) / 
                     Math.abs(leftShoulder.x - rightShoulder.x);
    
    if (hipShift > SQUAT_CONSTANTS.BALANCE_THRESHOLD) {
      if (Date.now() - state.lastFeedbackTime > SQUAT_CONSTANTS.FEEDBACK_COOLDOWN) {
        addFeedback(
          "Try to keep your hips level for better balance",
          "balance",
          "warning",
          "moderate",
          [
            { x: leftHip.x, y: leftHip.y, visibility: leftHip.visibility || 1 },
            { x: rightHip.x, y: rightHip.y, visibility: rightHip.visibility || 1 }
          ],
          feedback,
          categoryScores
        );
        state.lastFeedbackTime = Date.now();
        state.currentScore -= 8;
      }
    }
  }
  else if (state.repPhase === 'ascent') {
    // Check for common ascent issues
    
    // 1. Check for hip rise before shoulders (common issue)
    const shoulderRiseRate = landmarks[11].y - state.initialPositions.shoulderHeight;
    const hipRiseRate = landmarks[23].y - state.initialPositions.hipHeight;
    
    if (hipRiseRate > shoulderRiseRate * 1.5) {
      if (Date.now() - state.lastFeedbackTime > SQUAT_CONSTANTS.FEEDBACK_COOLDOWN) {
        addFeedback(
          "Try to lead with your chest when rising",
          "form",
          "warning",
          "minor",
          [
            { x: leftShoulder.x, y: leftShoulder.y, visibility: leftShoulder.visibility || 1 },
            { x: leftHip.x, y: leftHip.y, visibility: leftHip.visibility || 1 },
            { x: leftKnee.x, y: leftKnee.y, visibility: leftKnee.visibility || 1 }
          ],
          feedback,
          categoryScores
        );
        state.lastFeedbackTime = Date.now();
        state.currentScore -= 5;
      }
    }
  }
  else if (state.repPhase === 'top' && prevPhase === 'ascent') {
    // Completed rep, record metrics for history if a rep was in progress
    if (state.repStartTime) {
      const repDuration = Date.now() - state.repStartTime;
      
      // Only count reps within reasonable duration range
      if (repDuration >= SQUAT_CONSTANTS.MIN_REP_DURATION && 
          repDuration <= SQUAT_CONSTANTS.MAX_REP_DURATION) {
        
        // Calculate metrics for the rep
        const depth = state.maxDepthReached || 0;
        const backAngle = calculateAngle(
          { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 },
          { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 },
          { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 - 0.1 }
        );
        
        const kneeAlignment = Math.abs(
          (leftKnee.x - leftAnkle.x) / (leftHip.x - leftAnkle.x)
        );
        
        const balance = Math.abs(
          (leftHip.x - rightHip.x) / (leftShoulder.x - rightShoulder.x)
        );
        
        // Add to rep history
        state.repHistory.push({
          timestamp: Date.now(),
          score: state.currentScore,
          metrics: {
            depth: depth * 100, // Convert to percentage
            duration: repDuration / 1000, // Convert to seconds
            backAngle,
            kneeAlignment: (1 - Math.min(1, kneeAlignment / SQUAT_CONSTANTS.KNEE_ALIGNMENT_THRESHOLD)) * 100,
            balance: (1 - Math.min(1, balance / SQUAT_CONSTANTS.BALANCE_THRESHOLD)) * 100
          }
        });
        
        // Save score history
        state.scoreHistory.push(state.currentScore);
        
        // Track consecutive good reps
        if (state.currentScore >= SQUAT_CONSTANTS.PERFECT_REP_THRESHOLD) {
          state.consecutiveGoodReps++;
          
          if (state.consecutiveGoodReps >= SQUAT_CONSTANTS.MIN_REPS_FOR_STREAK) {
            addFeedback(
              `Great work! ${state.consecutiveGoodReps} perfect reps in a row!`,
              "form",
              "success",
              "minor",
              [],
              feedback,
              categoryScores
            );
          }
        } else {
          state.consecutiveGoodReps = 0;
        }
      }
      
      // Reset rep tracking
      state.repStartTime = undefined;
    }
  }
}

/**
 * Add feedback to the list and update category scores
 */
function addFeedback(
  message: string,
  category: "form" | "depth" | "alignment" | "balance",
  type: "success" | "warning" | "error",
  severity: keyof typeof FEEDBACK_CONSTANTS.SEVERITY_SCORES,
  keypoints: Landmark[],
  feedback: FeedbackItem[],
  categoryScores: Record<string, number>
): void {
  // Only add new feedback if it's not already present
  const isDuplicate = feedback.some(
    (item) => 
      item.message === message && 
      Date.now() - item.timestamp < FEEDBACK_CONSTANTS.SETTINGS.DURATION
  );

  if (!isDuplicate) {
    // Remove oldest feedback if we have too many
    if (feedback.length >= FEEDBACK_CONSTANTS.SETTINGS.MAX_ITEMS) {
      feedback.shift();
    }
    
    feedback.push({
      type,
      category,
      message,
      timestamp: Date.now(),
      severity,
      keypoints
    });
    
    // Update category scores
    const deduction = FEEDBACK_CONSTANTS.SEVERITY_SCORES[severity];
    categoryScores[category] = Math.max(0, categoryScores[category] - deduction);
  }
}

/**
 * Reset analyzer state
 */
export const resetSquatAnalyzer = (): void => {
  initializeExerciseState("Squats");
};

/**
 * Check if analysis is complete and finalize results
 */
export const finalizeSquatAnalysis = (): AnalysisResult | null => {
  const state = EXERCISE_STATES["Squats"];
  
  if (!state) return null;
  
  // Calculate final scores
  const categoryScores: Record<string, number> = {
    form: 100,
    depth: 100,
    alignment: 100,
    balance: 100
  };
  
  // Adjust scores based on rep history
  if (state.repHistory.length > 0) {
    // Average scores from all reps - fixed the implicit 'any' types
    const avgScores = state.repHistory.reduce(
      (acc: number, rep: RepHistoryItem) => acc + rep.score, 
      0
    ) / state.repHistory.length;
    
    // Calculate overall score
    const overallScore = Math.round(avgScores);
    
    return {
      feedback: FEEDBACK_HISTORY["Squats"] || [],
      categoryScores,
      overallScore,
      repCount: state.repCount,
      consecutiveGoodReps: state.consecutiveGoodReps,
      repHistory: state.repHistory,
      isInitializing: false,
      isVideoComplete: true,
      aiConfidence: 95 // High confidence for completed analysis
    };
  }
  
  return null;
}