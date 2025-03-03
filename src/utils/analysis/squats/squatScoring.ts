// File: utils/analysis/squats/squatScoring.ts

import { SquatAnalyzer } from "../squatAnalyzer";
import { SQUAT_CONSTANTS } from "../../constants/squatConstants";
import { SquatMetrics } from '@/types/squat';

// Track scores for averaging
const formScores: number[] = [];
const depthScores: number[] = [];
const alignmentScores: number[] = [];
const balanceScores: number[] = [];
const MAX_SCORE_MEMORY = 100; // Track last 100 frames

// Add this utility function for score smoothing
const smoothScore = (currentScore: number, newScore: number, factor: number = 0.3): number => {
  return Math.round(currentScore * (1 - factor) + newScore * factor);
};

// Calculate average score from history
const getAverageScore = (scores: number[]): number => {
  if (scores.length === 0) return 80; // default starting score
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

export const updateScores = (analyzer: SquatAnalyzer, depth: number): void => {
  // Calculate current metrics
  const metrics: SquatMetrics = {
    backAngle: calculateBackAngle(analyzer),
    balance: calculateBalance(analyzer),
    kneeAlignment: calculateKneeAlignment(analyzer),
    depth: depth,
    duration: Date.now() - analyzer.getRepStartTime()
  };

  // Calculate raw scores for this frame
  const frameFormScore = calculateFormScore(metrics.backAngle);
  const frameDepthScore = calculateDepthScore(depth);
  const frameAlignmentScore = calculateAlignmentScore(metrics.kneeAlignment);
  const frameBalanceScore = calculateBalanceScore(metrics.balance);
  
  // Add to history (for averaging/cumulative scores)
  formScores.push(frameFormScore);
  depthScores.push(frameDepthScore);
  alignmentScores.push(frameAlignmentScore);
  balanceScores.push(frameBalanceScore);
  
  // Limit array size
  if (formScores.length > MAX_SCORE_MEMORY) formScores.shift();
  if (depthScores.length > MAX_SCORE_MEMORY) depthScores.shift();
  if (alignmentScores.length > MAX_SCORE_MEMORY) alignmentScores.shift();
  if (balanceScores.length > MAX_SCORE_MEMORY) balanceScores.shift();
  
  // Calculate average scores
  const avgFormScore = getAverageScore(formScores);
  const avgDepthScore = getAverageScore(depthScores);
  const avgAlignmentScore = getAverageScore(alignmentScores);
  const avgBalanceScore = getAverageScore(balanceScores);
  
  // Update smoothed scores
  analyzer.categoryScores.form = smoothScore(analyzer.categoryScores.form, avgFormScore, 0.1);
  analyzer.categoryScores.depth = smoothScore(analyzer.categoryScores.depth, avgDepthScore, 0.1);
  analyzer.categoryScores.alignment = smoothScore(analyzer.categoryScores.alignment, avgAlignmentScore, 0.1);
  analyzer.categoryScores.balance = smoothScore(analyzer.categoryScores.balance, avgBalanceScore, 0.1);

  // Only provide feedback when in squat position
  if (analyzer.isInSquat && analyzer.repPhase === 'bottom') {
    // Check squat depth
    if (depth > 0.6) { // Not deep enough (remember lower = deeper)
      analyzer.feedbackManager.addFeedback(
        "Try to squat deeper - aim for thighs parallel to ground",
        "depth",
        "warning",
        "moderate",
        analyzer.pose.landmarks[0],
        analyzer.categoryScores
      );
    }

    // Check back angle
    if (metrics.backAngle > 45) {
      analyzer.feedbackManager.addFeedback(
        "Keep your back more upright",
        "form",
        "warning",
        "moderate",
        analyzer.pose.landmarks[0],
        analyzer.categoryScores
      );
    }

    // Check knee alignment
    if (metrics.kneeAlignment > 0.15) {
      analyzer.feedbackManager.addFeedback(
        "Keep knees in line with toes",
        "alignment",
        "warning",
        "moderate",
        analyzer.pose.landmarks[0],
        analyzer.categoryScores
      );
    }
  }
}

// Improved calculation for back angle - measuring torso relative to vertical
const calculateBackAngle = (analyzer: SquatAnalyzer): number => {
  const landmarks = analyzer.pose.landmarks[0];
  if (!landmarks) return 0;

  // Calculate midpoints for more stable measurements
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
  const angleRadians = Math.atan2(dx, -dy); // Negative dy makes 0 point up
  const angleDegrees = Math.abs(angleRadians * (180 / Math.PI));
  
  return angleDegrees;
};

// Improved balance calculation - normalized by hip width
const calculateBalance = (analyzer: SquatAnalyzer): number => {
  const landmarks = analyzer.pose.landmarks[0];
  if (!landmarks) return 0;

  // Calculate centers for more precise measurement
  const hipCenter = {
    x: (landmarks[23].x + landmarks[24].x) / 2
  };
  
  const ankleCenter = {
    x: (landmarks[27].x + landmarks[28].x) / 2
  };
  
  // Normalize by hip width to account for different body sizes and camera distances
  const hipWidth = Math.abs(landmarks[23].x - landmarks[24].x);
  
  // Calculate lateral shift as a ratio of hip width
  const lateralShift = Math.abs(hipCenter.x - ankleCenter.x) / (hipWidth || 0.1);
  
  return lateralShift;
};

// Improved knee alignment calculation - checking knee deviation relative to ankle and hip
const calculateKneeAlignment = (analyzer: SquatAnalyzer): number => {
  const landmarks = analyzer.pose.landmarks[0];
  if (!landmarks) return 0;

  // Calculate for both legs and take the worse one
  const leftHip = landmarks[23];
  const leftKnee = landmarks[25];
  const leftAnkle = landmarks[27];
  
  const rightHip = landmarks[24];
  const rightKnee = landmarks[26];
  const rightAnkle = landmarks[28];
  
  // Calculate knee deviation from the hip-ankle line
  const leftKneeDeviation = Math.abs(leftKnee.x - ((leftHip.x + leftAnkle.x) / 2));
  const rightKneeDeviation = Math.abs(rightKnee.x - ((rightHip.x + rightAnkle.x) / 2));
  
  // Normalize by hip width
  const hipWidth = Math.abs(leftHip.x - rightHip.x);
  
  // Return worst knee alignment as a ratio
  return Math.max(leftKneeDeviation, rightKneeDeviation) / (hipWidth || 0.1);
};

// Better scoring functions with appropriate thresholds
const calculateFormScore = (backAngle: number): number => {
  // Perfect: 0-15 degrees, Bad: >45 degrees
  if (backAngle < 15) return 100;
  if (backAngle > 45) return Math.max(0, 100 - ((backAngle - 45) * 2.5));
  return Math.max(0, 100 - ((backAngle - 15) * 1.5));
};

const calculateDepthScore = (depth: number): number => {
  // High depth value is better (0.7+ is excellent)
  // Scale to be more generous at the lower end
  if (depth >= 0.7) return 100;
  if (depth >= 0.5) return 80 + ((depth - 0.5) * 100);
  if (depth >= 0.3) return 50 + ((depth - 0.3) * 150);
  return Math.max(0, depth * 167);
};

const calculateAlignmentScore = (kneeAlignment: number): number => {
  // Lower value is better - perfect: <0.05, poor: >0.2
  if (kneeAlignment < 0.05) return 100;
  if (kneeAlignment > 0.2) return Math.max(0, 100 - ((kneeAlignment - 0.2) * 500));
  return Math.max(0, 100 - ((kneeAlignment - 0.05) * 250));
};

const calculateBalanceScore = (balance: number): number => {
  // Lower value is better - perfect: <0.05, poor: >0.2
  if (balance < 0.05) return 100;
  if (balance > 0.2) return Math.max(0, 100 - ((balance - 0.2) * 500));
  return Math.max(0, 100 - ((balance - 0.05) * 250));
};