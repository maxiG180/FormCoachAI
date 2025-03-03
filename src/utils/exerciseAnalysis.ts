// File: utils/exerciseAnalysis.ts
// Main coordinator for exercise analysis and state management

import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { SquatAnalyzer } from "./analysis/squatAnalyzer";
import { AnalysisResult } from "@/types/analyze";
import tfModelManager from "./tensorflow/tfModelManager";
import { ExerciseStateManager } from "@/utils/ExerciseStateManager";
import { SquatState } from "@/types/exerciseTypes";

// Keep persistent analyzer instance to maintain state
let analyzer: SquatAnalyzer | null = null;
let lastPose: PoseLandmarkerResult | null = null;
let isInitialized: boolean = false;
let cachedState: SquatState | null = null;

const analyzeExerciseForm = async (pose: PoseLandmarkerResult, exercise: string): Promise<AnalysisResult> => {
  const defaultScores = {
    form: 80,
    depth: 80,
    alignment: 80,
    balance: 80,
  };

  switch (exercise) {
    case "Squats": {
      if (!analyzer) {
        // Create new analyzer
        analyzer = new SquatAnalyzer(pose, defaultScores);
        
        // IMPORTANT: Load either cached state or existing state
        if (cachedState) {
          analyzer.state = JSON.parse(JSON.stringify(cachedState)) as SquatState;
        } else {
          const existingState = ExerciseStateManager.getState("Squats");
          if (existingState) {
            analyzer.state = JSON.parse(JSON.stringify(existingState)) as SquatState;
          }
        }
        
        isInitialized = true;
      } else {
        // Update pose for existing analyzer
        analyzer.setPose(pose);
      }
      
      // Perform analysis
      const result = await analyzer.analyze();
      
      // Cache state after each analysis
      cachedState = JSON.parse(JSON.stringify(analyzer.state));
      
      // Ensure state propagates to UI
      ExerciseStateManager.setState("Squats", analyzer.state);
      
      // Extra safety check for rep count sync
      if (analyzer.state.repCount > 0) {
        console.log("Syncing rep count:", analyzer.state.repCount);
        ExerciseStateManager.updateRepCount("Squats", analyzer.state.repCount);
      }
      
      return result;
    }
    default: {
      return {
        feedback: [],
        categoryScores: defaultScores,
        overallScore: 0,
        isInitializing: true,
        repCount: 0,
        consecutiveGoodReps: 0,
        repHistory: [],
        lastAnalysisTime: Date.now()
      };
    }
  }
};

// Properly clean up all state when resetting
const resetAnalyzer = () => {
  if (analyzer) {
    analyzer.reset();
    ExerciseStateManager.resetState("Squats");
  }
  analyzer = null;
  lastPose = null;
  isInitialized = false;
  cachedState = null; // Clear cached state
  
  // Force UI update to ensure clean slate
  ExerciseStateManager.updateRepCount("Squats", 0);
};

const isTensorFlowModelLoaded = (): boolean => {
  return tfModelManager.isLoaded();
};

const trainTensorFlowModel = async (): Promise<void> => {
  if (tfModelManager.getTrainingDataSize() > 5) {
    await tfModelManager.trainModel();
    return;
  }
  throw new Error("Not enough training data. Need at least 5 examples.");
};

export { 
  analyzeExerciseForm, 
  resetAnalyzer,
  isTensorFlowModelLoaded,
  trainTensorFlowModel
};