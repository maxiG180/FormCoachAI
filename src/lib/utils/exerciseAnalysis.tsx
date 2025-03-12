// src/utils/exerciseAnalysis.ts
import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { FeedbackItem, AnalysisResult } from "@/lib/types/analyze";

interface SquatState {
  isSquatting: boolean;
  lowestPosition: number;
  feedbackGiven: boolean;
  startTime: number;
  lastFeedbackTime: number;
  repCount: number;
  consecutiveGoodReps: number;
  trackingErrorCount: number;
  initialHipHeight: number | null;
}

interface PersistentFeedback {
  lastFeedback: FeedbackItem[];
  lastUpdateTime: number;
}

const SEVERITY_SCORES = {
  minor: 10,
  moderate: 20,
  major: 30,
};

const SQUAT_STATES: Record<string, SquatState> = {};
const PERSISTENT_FEEDBACK: Record<string, PersistentFeedback> = {};

// Minimum confidence threshold for landmark visibility
const MIN_LANDMARK_CONFIDENCE = 0.7;
const MIN_CONSECUTIVE_TRACKING_ERRORS = 3;

export const analyzeExerciseForm = (
  pose: PoseLandmarkerResult,
  exercise: string
): AnalysisResult => {
  if (!PERSISTENT_FEEDBACK[exercise]) {
    PERSISTENT_FEEDBACK[exercise] = {
      lastFeedback: [],
      lastUpdateTime: 0,
    };
  }

  const persistentFeedback = PERSISTENT_FEEDBACK[exercise];
  const feedback: FeedbackItem[] = [...persistentFeedback.lastFeedback];

  const categoryScores: Record<string, number> = {
    form: 100,
    depth: 100,
    alignment: 100,
    balance: 100,
  };

  const addFeedback = (
    message: string,
    category: "form" | "depth" | "alignment" | "balance",
    type: "success" | "warning" | "error",
    severity: keyof typeof SEVERITY_SCORES,
    keypoints: any[]
  ) => {
    // Only add new feedback if it's not already present
    const isDuplicate = feedback.some(
      (item) => item.message === message && Date.now() - item.timestamp < 2000
    );

    if (!isDuplicate) {
      feedback.push({
        type,
        category,
        message,
        timestamp: Date.now(),
        keypoints,
      });

      // Update category scores
      const deduction = SEVERITY_SCORES[severity];
      categoryScores[category] = Math.max(
        0,
        categoryScores[category] - deduction
      );
    }
  };

  const isLandmarkVisible = (landmark: any): boolean => {
    return landmark && landmark.visibility > MIN_LANDMARK_CONFIDENCE;
  };

  switch (exercise) {
    case "Squats": {
      if (!SQUAT_STATES["Squats"]) {
        SQUAT_STATES["Squats"] = {
          isSquatting: false,
          lowestPosition: 0,
          feedbackGiven: false,
          startTime: Date.now(),
          lastFeedbackTime: 0,
          repCount: 0,
          consecutiveGoodReps: 0,
          trackingErrorCount: 0,
          initialHipHeight: null,
        };
      }

      const state = SQUAT_STATES["Squats"];
      const currentTime = Date.now();

      // Get key landmarks
      const landmarks = pose.landmarks[0];
      if (!landmarks) break;

      const leftHip = landmarks[23];
      const rightHip = landmarks[24];
      const leftKnee = landmarks[25];
      const rightKnee = landmarks[26];
      const leftAnkle = landmarks[27];
      const rightAnkle = landmarks[28];
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];

      // Tracking stability check
      const requiredLandmarks = [
        leftHip,
        rightHip,
        leftKnee,
        rightKnee,
        leftAnkle,
        rightAnkle,
        leftShoulder,
        rightShoulder,
      ];

      const trackingErrors = requiredLandmarks.filter(
        (landmark) => !isLandmarkVisible(landmark)
      ).length;

      if (trackingErrors > 0) {
        state.trackingErrorCount++;

        if (state.trackingErrorCount >= MIN_CONSECUTIVE_TRACKING_ERRORS) {
          return {
            feedback: [
              {
                // src/utils/exerciseAnalysis.ts (continued)
                type: "error",
                category: "form",
                message: "Tracking lost - ensure full body visibility",
                timestamp: Date.now(),
                keypoints: [],
              },
            ],
            categoryScores,
            overallScore: 0,
            repCount: state.repCount,
            consecutiveGoodReps: state.consecutiveGoodReps,
            isInitializing: false,
          };
        }
      } else {
        state.trackingErrorCount = 0;
      }

      // Calculate current positions and angles
      const hipHeight = (leftHip.y + rightHip.y) / 2;
      const kneeHeight = (leftKnee.y + rightKnee.y) / 2;

      // Initialize reference height if needed
      if (state.initialHipHeight === null) {
        state.initialHipHeight = hipHeight;
      }

      // Calculate relative squat depth
      const squatDepth =
        (hipHeight - state.initialHipHeight) /
        (kneeHeight - state.initialHipHeight);
      const isInSquatPosition = squatDepth > 0.4; // Adjusted threshold

      // Track squat state
      if (isInSquatPosition && !state.isSquatting) {
        state.isSquatting = true;
        state.lowestPosition = hipHeight;
        state.feedbackGiven = false;
        state.startTime = currentTime;
      } else if (isInSquatPosition) {
        state.lowestPosition = Math.min(state.lowestPosition, hipHeight);
      } else if (!isInSquatPosition && state.isSquatting) {
        const repDuration = currentTime - state.startTime;

        // Validate rep duration
        if (repDuration >= 800 && repDuration <= 5000 && !state.feedbackGiven) {
          feedback.length = 0; // Clear previous feedback
          let isGoodRep = true;

          // Check squat depth
          const depthRatio =
            (state.lowestPosition - state.initialHipHeight) /
            (kneeHeight - state.initialHipHeight);
          if (depthRatio > 0.5) {
            addFeedback(
              "Squat deeper - aim for thighs parallel to ground",
              "depth",
              "error",
              "major",
              [leftHip, leftKnee, leftAnkle]
            );
            isGoodRep = false;
          }

          // Check knee alignment
          const kneeAngle =
            Math.abs(leftKnee.x - leftAnkle.x) /
            Math.abs(leftHip.x - leftAnkle.x);
          if (kneeAngle > 0.3) {
            addFeedback(
              "Keep knees in line with toes",
              "alignment",
              "error",
              "major",
              [leftHip, leftKnee, leftAnkle]
            );
            isGoodRep = false;
          }

          // Check hip symmetry
          const hipImbalance =
            Math.abs(leftHip.y - rightHip.y) / Math.abs(leftHip.x - rightHip.x);
          if (hipImbalance > 0.15) {
            addFeedback(
              "Keep hips level throughout movement",
              "balance",
              "warning",
              "moderate",
              [leftHip, rightHip]
            );
            isGoodRep = false;
          }

          // Update rep tracking
          state.repCount++;
          if (isGoodRep) {
            state.consecutiveGoodReps++;
            if (state.consecutiveGoodReps >= 3) {
              addFeedback(
                `Excellent form! ${state.consecutiveGoodReps} perfect reps in a row!`,
                "form",
                "success",
                "minor",
                []
              );
            }
          } else {
            state.consecutiveGoodReps = 0;
          }

          state.feedbackGiven = true;
          persistentFeedback.lastFeedback = [...feedback];
          persistentFeedback.lastUpdateTime = currentTime;
        }
        state.isSquatting = false;
      }
      break;
    }
  }

  // Calculate weighted overall score
  const weights = { form: 0.3, depth: 0.25, alignment: 0.25, balance: 0.2 };
  const overallScore = Math.round(
    Object.entries(categoryScores).reduce(
      (total, [category, score]) =>
        total + score * weights[category as keyof typeof weights],
      0
    )
  );

  return {
    feedback: persistentFeedback.lastFeedback,
    categoryScores,
    overallScore,
    repCount: SQUAT_STATES[exercise]?.repCount || 0,
    consecutiveGoodReps: SQUAT_STATES[exercise]?.consecutiveGoodReps || 0,
    isInitializing: false,
  };
};

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

export function resetAnalyzer() {
  // Reset all state for all exercises
  Object.keys(SQUAT_STATES).forEach((key) => {
    SQUAT_STATES[key] = {
      isSquatting: false,
      lowestPosition: 0,
      feedbackGiven: false,
      startTime: Date.now(),
      lastFeedbackTime: 0,
      repCount: 0,
      consecutiveGoodReps: 0,
      trackingErrorCount: 0,
      initialHipHeight: null,
    };
  });

  // Clear all feedback
  Object.keys(PERSISTENT_FEEDBACK).forEach((key) => {
    PERSISTENT_FEEDBACK[key] = {
      lastFeedback: [],
      lastUpdateTime: 0,
    };
  });
}

export function finishExerciseAnalysis(exercise: string) {
  // Optional: Add any final analysis or cleanup when the video completes
  console.log(`Exercise analysis completed for ${exercise}`);
  console.log(`Final rep count: ${SQUAT_STATES[exercise]?.repCount || 0}`);
  console.log(
    `Final consecutive good reps: ${
      SQUAT_STATES[exercise]?.consecutiveGoodReps || 0
    }`
  );
}
