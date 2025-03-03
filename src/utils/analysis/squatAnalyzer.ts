// File: utils/analysis/squatAnalyzer.ts

import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { FeedbackManager } from "@/utils/FeedbackManager";
import { ExerciseStateManager } from "@/utils/ExerciseStateManager";
import { ExercisePositions, ExerciseState, KeyLandmarks } from "../../types/exerciseTypes";
import { SQUAT_CONSTANTS } from "../constants/squatConstants";
import { AnalysisResult, FeedbackItem, AIInsight } from "@/types/analyze";
import { FEEDBACK_CONSTANTS, SeverityScore } from "../constants/feedbackConstants";
import { calculateDepth } from "./squats/squatDepthCalculator";
import { updateMovementPhase, resetMovementTracking } from "./squats/squatMovementTracker";
import { updateScores } from "./squats/squatScoring";
import { validateSquatLandmarks } from "./squats/squatValidation";
import { SquatState, SquatMetrics, RepPhase } from '@/types/squat';
import tfModelManager from "../tensorflow/tfModelManager";


export class SquatAnalyzer {
  public feedbackManager: FeedbackManager;
  public state: SquatState;
  public pose: PoseLandmarkerResult;
  public categoryScores: Record<string, number>;
  public isInSquat: boolean = false;
  public lastDepth: number = 0;
  public repPhase: RepPhase = 'start';
  private repStartTime: number = 0;
  public maxDepthReached: number = 0;
  private lastAnalysisTime: number = 0;
  private analysisInterval: number = 100;
  private tfPredictions: AIInsight | undefined = undefined;
  private lastTensorflowUpdate: number = 0;
  private tensorflowUpdateInterval: number = 500; // Update TF prediction every 500ms


  constructor(pose: PoseLandmarkerResult, initialScores: Record<string, number>) {
    this.pose = pose;
    this.state = {
      isActive: true,
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
        lastHipHeight: 0,
      },
      lastMovementTime: Date.now(),
      currentScore: 100,
      scoreHistory: [],
      repHistory: []
    };
    this.feedbackManager = new FeedbackManager("Squats", this.state);
    
    // Initialize all scores to 80 instead of 0 to avoid starting with all red indicators
    this.categoryScores = {
      form: 80,
      depth: 80,
      alignment: 80,
      balance: 80,
      ...initialScores
    };
  }

  public async analyze(): Promise<AnalysisResult> {
    if (!this.pose.landmarks?.[0]) {
      return this.handleNoLandmarks();
    }
  
    const currentTime = Date.now();
    
    try {
      // Calculate current metrics
      const depth = this.calculateDepth();
      
      // Update movement phase
      updateMovementPhase(this, depth);
  
      // Update scores
      updateScores(this, depth);
  
      // Use TensorFlow for additional insights periodically
      if (currentTime - this.lastTensorflowUpdate > this.tensorflowUpdateInterval) {
        try {
          this.tfPredictions = await tfModelManager.predictFormIssues(this.pose);
          this.lastTensorflowUpdate = currentTime;
          
          // Add TensorFlow-based feedback
          this.applyTensorFlowFeedback(this.tfPredictions);
        } catch (error) {
          console.error("Error getting TensorFlow predictions:", error);
        }
      }
  
      this.lastAnalysisTime = currentTime;
      return this.getLatestResults();
    } catch (error) {
      console.error("Error during analysis:", error);
      return this.handleError();
    }
  }

  private applyTensorFlowFeedback(predictions: AIInsight): void {
    if (!predictions || !predictions.issues) return;

    // Only apply AI feedback when confidence is high enough
    predictions.issues.forEach((issue) => {
      if (issue.confidence < 0.5) return;
      
      switch (issue.type) {
        case 'knees_inward':
          if (this.categoryScores.alignment > 40) {
            // Only apply AI correction if our rule-based system missed it
            this.categoryScores.alignment = Math.max(0, this.categoryScores.alignment - (issue.confidence * 30));
            this.addFormFeedback(
              "Keep knees in line with toes",
              "alignment",
              "warning",
              "moderate"
            );
          }
          break;
        case 'back_not_straight':
          if (this.categoryScores.form > 40) {
            this.categoryScores.form = Math.max(0, this.categoryScores.form - (issue.confidence * 30));
            this.addFormFeedback(
              "Keep your back straight",
              "form",
              "warning",
              "moderate"
            );
          }
          break;
        case 'not_deep_enough':
          if (this.categoryScores.depth > 40) {
            this.categoryScores.depth = Math.max(0, this.categoryScores.depth - (issue.confidence * 30));
            this.addFormFeedback(
              "Try to squat deeper",
              "depth",
              "warning",
              "moderate"
            );
          }
          break;
        case 'imbalanced':
          if (this.categoryScores.balance > 40) {
            this.categoryScores.balance = Math.max(0, this.categoryScores.balance - (issue.confidence * 30));
            this.addFormFeedback(
              "Keep weight balanced on both feet",
              "balance",
              "warning",
              "moderate"
            );
          }
          break;
      }
    });

    // Add positive feedback for good form if AI is confident
    if (predictions.category === 'perfect' && predictions.confidence > 0.7 && 
        this.repPhase === 'bottom' && Object.values(this.categoryScores).every(score => score > 70)) {
      this.addFormFeedback(
        "Great depth and form",
        "form",
        "success",
        "minor"
      );
    }
  }

  public setPose(pose: PoseLandmarkerResult): void {
    this.pose = pose;
  }

  private getLatestResults(): AnalysisResult {
    return {
      feedback: this.feedbackManager.getFeedback(),
      categoryScores: this.categoryScores,
      overallScore: this.calculateOverallScore(),
      isInitializing: false,
      repCount: this.state.repCount,
      consecutiveGoodReps: this.state.consecutiveGoodReps,
      repHistory: this.state.repHistory.map(rep => ({
        timestamp: rep.timestamp,
        score: rep.score,
        depth: rep.metrics.depth,
        duration: rep.metrics.duration,
        feedback: []  // Empty array since we don't store feedback in history
      })),
      lastAnalysisTime: this.lastAnalysisTime,
      aiInsights: this.tfPredictions // This will now work with the type
    };
  }

  private calculateOverallScore(): number {
    return Math.round(
      Object.entries(this.categoryScores).reduce(
        (total, [category, score]) =>
          total + score * FEEDBACK_CONSTANTS.CATEGORY_WEIGHTS[category as keyof typeof FEEDBACK_CONSTANTS.CATEGORY_WEIGHTS],
        0
      )
    );
  }

  private handleNoLandmarks(): AnalysisResult {
    return {
      feedback: [],
      categoryScores: this.categoryScores,
      overallScore: 0,
      isInitializing: true,
      repCount: this.state.repCount,
      consecutiveGoodReps: this.state.consecutiveGoodReps,
      repHistory: [],
      lastAnalysisTime: this.lastAnalysisTime
    };
  }

  private handleError(): AnalysisResult {
    return {
      feedback: [{
        type: "error",
        category: "form",
        message: "Error analyzing movement",
        timestamp: Date.now(),
        severity: "major",
        keypoints: []
      }],
      categoryScores: this.categoryScores,
      overallScore: 0,
      isInitializing: true,
      repCount: this.state.repCount,
      consecutiveGoodReps: this.state.consecutiveGoodReps,
      repHistory: [],
      lastAnalysisTime: this.lastAnalysisTime
    };
  }

  // Helper methods for form analysis
  private calculateKneeAlignment(): number {
    const landmarks = this.pose.landmarks[0];
    
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    
    // Calculate hip width for normalization
    const hipWidth = Math.abs(leftHip.x - rightHip.x);
    
    // Calculate knee-ankle alignment (how far knees are from ankle vertical line)
    const leftKneeDeviation = Math.abs(leftKnee.x - leftAnkle.x) / hipWidth;
    const rightKneeDeviation = Math.abs(rightKnee.x - rightAnkle.x) / hipWidth;
    
    // Take the worse deviation of the two
    return Math.max(leftKneeDeviation, rightKneeDeviation);
  }

  private calculateBackAngle(): number {
    const landmarks = this.pose.landmarks[0];
    
    const midShoulder = {
      x: (landmarks[11].x + landmarks[12].x) / 2,
      y: (landmarks[11].y + landmarks[12].y) / 2
    };
    
    const midHip = {
      x: (landmarks[23].x + landmarks[24].x) / 2,
      y: (landmarks[23].y + landmarks[24].y) / 2
    };
    
    // Calculate angle from vertical (90 degrees is bent over, 0 is upright)
    const dx = midShoulder.x - midHip.x;
    const dy = midShoulder.y - midHip.y;
    const angleRadians = Math.atan2(dx, dy);
    const angleDegrees = Math.abs(angleRadians * (180 / Math.PI));
    
    return angleDegrees;
  }

  private calculateHipSymmetry(): number {
    const landmarks = this.pose.landmarks[0];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    
    // Calculate height difference normalized by hip width
    const heightDiff = Math.abs(leftHip.y - rightHip.y);
    const hipWidth = Math.abs(leftHip.x - rightHip.x);
    
    return heightDiff / (hipWidth || 1);
  }

  private calculateBalance(): number {
    const landmarks = this.pose.landmarks[0];
    
    // Calculate center of feet
    const footCenter = {
      x: (landmarks[27].x + landmarks[28].x) / 2,
      y: (landmarks[27].y + landmarks[28].y) / 2
    };
    
    // Calculate center of hips
    const hipCenter = {
      x: (landmarks[23].x + landmarks[24].x) / 2,
      y: (landmarks[23].y + landmarks[24].y) / 2
    };
    
    // Calculate lateral shift normalized by hip width
    const hipWidth = Math.abs(landmarks[23].x - landmarks[24].x);
    const lateralShift = Math.abs(hipCenter.x - footCenter.x) / hipWidth;
    
    return lateralShift;
  }

  private calculateRepScore(): number {
    // Calculate weighted score based on different aspects
    const depthScore = Math.min(100, (this.maxDepthReached / SQUAT_CONSTANTS.SQUAT_DEPTH_THRESHOLD) * 100);
    const formScore = this.categoryScores.form;
    const alignmentScore = this.categoryScores.alignment;
    const balanceScore = this.categoryScores.balance;

    // Weight the scores according to importance
    const weightedScore = 
      (depthScore * FEEDBACK_CONSTANTS.CATEGORY_WEIGHTS.depth) +
      (formScore * FEEDBACK_CONSTANTS.CATEGORY_WEIGHTS.form) +
      (alignmentScore * FEEDBACK_CONSTANTS.CATEGORY_WEIGHTS.alignment) +
      (balanceScore * FEEDBACK_CONSTANTS.CATEGORY_WEIGHTS.balance);

    return Math.round(weightedScore);
  }

  private addFormFeedback(
    message: string,
    category: "form" | "depth" | "alignment" | "balance",
    type: "success" | "warning" | "error",
    severity: SeverityScore
  ): void {
    this.feedbackManager.addFeedback(
      message,
      category,
      type,
      severity,
      this.pose.landmarks[0],
      this.categoryScores
    );
  }

  // Add getter methods
  public getLastDepth(): number {
    return this.lastDepth;
  }

  public getLastAnalysisTime(): number {
    return this.lastAnalysisTime;
  }

  public getMaxDepthReached(): number {
    return this.maxDepthReached;
  }

  // Add setter methods
  public setRepStartTime(time: number): void {
    this.repStartTime = time;
  }

  public setMaxDepthReached(depth: number): void {
    this.maxDepthReached = depth;
  }

  public setLastAnalysisTime(time: number): void {
    this.lastAnalysisTime = time;
  }

  public getRepStartTime(): number {
    return this.repStartTime;
  }

  public isValidRep(repDuration: number): boolean {
    return (
      repDuration >= SQUAT_CONSTANTS.MIN_REP_DURATION &&
      repDuration <= SQUAT_CONSTANTS.MAX_REP_DURATION &&
      this.maxDepthReached <= 0.7 &&
      validateSquatLandmarks(this.getRequiredLandmarks())
    );
  }

  public completeRep(): void {
    // Increment rep count
    this.state.repCount++;
    
    const repScore = this.calculateRepScore();
    const repDuration = Date.now() - this.repStartTime;
  
    console.log('Rep completed:', {
      repCount: this.state.repCount,
      score: repScore,
      maxDepth: this.maxDepthReached
    });
  
    // Update rep history with correct format
    this.state.repHistory.push({
      timestamp: Date.now(),
      score: repScore,
      metrics: {
        depth: this.maxDepthReached,
        duration: repDuration,
        backAngle: this.calculateBackAngle(),
        kneeAlignment: this.calculateKneeAlignment(),
        balance: this.calculateBalance()
      }
    });
    
    // IMPORTANT: Update the static ExerciseStateManager to ensure UI gets updated
    ExerciseStateManager.setState("Squats", this.state);
  
    // Handle TensorFlow training examples
    if (repScore >= SQUAT_CONSTANTS.PERFECT_REP_THRESHOLD) {
      this.state.consecutiveGoodReps++;
      this.addFormFeedback("Perfect rep!", "form", "success", "minor");
      
      // Add this as a positive training example
      tfModelManager.addTrainingExample(this.pose, 'perfect');
    } else {
      this.state.consecutiveGoodReps = 0;
      
      // Determine the main issue and add as training example
      if (this.categoryScores.depth < 70) {
        tfModelManager.addTrainingExample(this.pose, 'not_deep_enough');
      } else if (this.categoryScores.alignment < 70) {
        tfModelManager.addTrainingExample(this.pose, 'knees_inward');
      } else if (this.categoryScores.form < 70) {
        tfModelManager.addTrainingExample(this.pose, 'back_not_straight');
      } else if (this.categoryScores.balance < 70) {
        tfModelManager.addTrainingExample(this.pose, 'imbalanced');
      }
    }
  }

  public isGoodRep(): boolean {
    return Object.values(this.categoryScores).every(score => score >= 70);
  }

  public reset(): void {
    // Reset all state tracking
    this.state.repCount = 0;
    this.state.consecutiveGoodReps = 0;
    this.state.scoreHistory = [];
    this.state.repHistory = [];
    this.isInSquat = false;
    this.lastDepth = 0;
    this.repPhase = 'start';
    this.maxDepthReached = 0;
    this.tfPredictions = undefined;
    this.feedbackManager.clearFeedback();
    
    // Reset the movement tracker state
    resetMovementTracking(); // Add this import
    
    // Force UI update
    ExerciseStateManager.setState("Squats", this.state);
    ExerciseStateManager.updateRepCount("Squats", 0);
  }

  public getRequiredLandmarks() {
    const landmarks = this.pose.landmarks[0];
    return [
      landmarks[23], // Right hip
      landmarks[24], // Left hip
      landmarks[25], // Right knee
      landmarks[26], // Left knee
      landmarks[27], // Right ankle
      landmarks[28]  // Left ankle
    ];
  }

  public calculateDepth(): number {
    const landmarks = this.pose.landmarks[0];
    if (!landmarks) return this.lastDepth;
  
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
  
    if (!this.validateLandmarks([leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle])) {
      return this.lastDepth;
    }
  
    // Use average of both legs for more stable measurement
    const hipHeight = (leftHip.y + rightHip.y) / 2;
    const kneeHeight = (leftKnee.y + rightKnee.y) / 2;
    const ankleHeight = (leftAnkle.y + rightAnkle.y) / 2;
  
    // Calculate relative to leg length
    const totalLegLength = Math.abs(hipHeight - ankleHeight);
    const hipToKnee = Math.abs(hipHeight - kneeHeight);
    
    // Calculate normalized depth (0 = standing, 1 = deep squat)
    const normalizedDepth = 1 - (hipToKnee / totalLegLength);
    
    // Apply smoothing for stability
    const smoothedDepth = this.lastDepth * 0.7 + normalizedDepth * 0.3;
    
    return smoothedDepth;
  }

  public validateLandmarks(landmarks: any[]): boolean {
    return landmarks.every(landmark => 
      landmark && 
      typeof landmark.visibility === 'number' && 
      landmark.visibility > SQUAT_CONSTANTS.MIN_LANDMARK_CONFIDENCE
    );
  }
}
export const resetState = (exercise: string): void => {
  ExerciseStateManager.resetState(exercise);
};
