// File: utils/FeedbackManager.ts

import { FeedbackItem, AIInsight } from "@/types/analyze";
import { FEEDBACK_CONSTANTS, SeverityScore } from "./constants/feedbackConstants";

export interface PersistentFeedback {
  items: FeedbackItem[];
  lastUpdateTime: number;
  cumulativeScore: number;
}

export class FeedbackManager {
  private feedbackState: PersistentFeedback;
  private exerciseType: string;
  private state: any;
  private aiInsightAdded: boolean = false;
  private readonly MAX_FEEDBACK_ITEMS = 10;

  constructor(exerciseType: string, state: any) {
    this.exerciseType = exerciseType;
    this.state = state;
    this.feedbackState = {
      items: [],
      lastUpdateTime: Date.now(),
      cumulativeScore: 100
    };
  }

  public addFeedback(
    message: string,
    category: "form" | "depth" | "alignment" | "balance",
    type: "success" | "warning" | "error",
    severity: SeverityScore,
    keypoints: any[],
    categoryScores: Record<string, number>
  ): void {
    const currentTime = Date.now();
    
    // Add console log for debugging
    console.log('Adding feedback:', { message, category, type });

    // Check for duplicates with better logic
    const duplicateIndex = this.feedbackState.items.findIndex(item => 
      item.message === message && 
      currentTime - item.timestamp < FEEDBACK_CONSTANTS.SETTINGS.COOLDOWN
    );

    if (duplicateIndex >= 0) {
      // Update timestamp on existing feedback to keep it fresh
      this.feedbackState.items[duplicateIndex].timestamp = currentTime;
      console.log('Updated existing feedback timestamp');
      return;
    }

    const feedback: FeedbackItem = {
      type,
      category,
      message,
      timestamp: currentTime,
      severity,
      keypoints
    };

    // Add new feedback at the beginning for newest-first ordering
    this.feedbackState.items.unshift(feedback);
    console.log('Feedback added:', feedback);

    // Limit maximum feedback items to prevent overwhelming the user
    if (this.feedbackState.items.length > this.MAX_FEEDBACK_ITEMS) {
      this.feedbackState.items.pop(); // Remove oldest feedback
    }

    // Update cumulative score
    const deduction = FEEDBACK_CONSTANTS.SEVERITY_SCORES[severity];
    this.feedbackState.cumulativeScore = Math.max(
      0,
      this.feedbackState.cumulativeScore - deduction
    );
  }

  // New method to integrate AI insights with regular feedback
  public addAIInsightFeedback(aiInsight: AIInsight): void {
    if (!aiInsight || !aiInsight.issues || aiInsight.issues.length === 0) return;
    
    // Prevent adding AI insights more than once per rep
    if (this.aiInsightAdded) return;
    
    // Add each AI issue as feedback
    aiInsight.issues.forEach(issue => {
      if (issue.confidence < 0.4) return; // Only add high confidence insights
      
      let category: "form" | "depth" | "alignment" | "balance" = "form";
      let message = "";
      
      // Map AI issue types to feedback categories and messages
      switch (issue.type) {
        case 'knees_inward':
          category = "alignment";
          message = "AI detected: Keep knees in line with toes";
          break;
        case 'back_not_straight':
          category = "form";
          message = "AI detected: Maintain a neutral spine position";
          break;
        case 'not_deep_enough':
          category = "depth";
          message = "AI detected: Try to squat deeper for better results";
          break;
        case 'imbalanced':
          category = "balance";
          message = "AI detected: Keep weight evenly distributed on both feet";
          break;
        default:
          return; // Skip unknown issue types
      }
      
      if (message) {
        this.addFeedback(
          message,
          category,
          "warning",
          "moderate",
          [], // No keypoints for AI feedback
          {} as Record<string, number> // Empty category scores
        );
      }
    });
    
    // Add positive feedback if form is good
    if (aiInsight.category === 'perfect' && aiInsight.confidence > 0.6) {
      this.addFeedback(
        "AI detected: Great form, keep it up!",
        "form",
        "success",
        "minor",
        [],
        {} as Record<string, number>
      );
    }
    
    this.aiInsightAdded = true;
  }

  // Reset the AI insight flag when appropriate (e.g., at the start of a new rep)
  public resetAIInsightFlag(): void {
    this.aiInsightAdded = false;
  }

  public getFeedback(): FeedbackItem[] {
    this.clearOldFeedback();
    return this.feedbackState.items;
  }

  public getCumulativeScore(): number {
    return this.feedbackState.cumulativeScore;
  }

  public clearFeedback(): void {
    this.feedbackState.items = [];
    this.aiInsightAdded = false;
  }

  public clearOldFeedback(): void {
    const currentTime = Date.now();
    this.feedbackState.items = this.feedbackState.items.filter(
      (item: FeedbackItem) => 
        currentTime - item.timestamp < FEEDBACK_CONSTANTS.SETTINGS.DURATION
    );
  }
}