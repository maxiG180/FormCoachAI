import { useState, useCallback, useEffect } from "react";
import VideoPlayer from "../components/analyze/VideoPlayer";
import FeedbackPanel from "../components/analyze/FeedbackPanel";
import UploadSection from "../components/analyze/UploadSection";
import { analyzeExerciseForm, resetAnalyzer } from "../utils/exerciseAnalysis";
import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { FeedbackItem, AnalysisResult } from "../types/analyze";
import { ExerciseState } from "@/types/exerciseTypes";
import { ExerciseStateManager } from "@/utils/ExerciseStateManager";

const initialCategoryScores = {
  form: 0,
  depth: 0,
  alignment: 0,
  balance: 0,
};

const initialAnalysisResult: AnalysisResult = {
  feedback: [],
  categoryScores: initialCategoryScores,
  overallScore: 0,
  isInitializing: true,
  repCount: 0,
  consecutiveGoodReps: 0,
  repHistory: [],
  lastAnalysisTime: 0,
};

const Analyze = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(
    initialAnalysisResult
  );
  const [scoreBuffer, setScoreBuffer] = useState<number[]>([]);
  const [stableScore, setStableScore] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState("");

  const exerciseState = ExerciseStateManager.getState(selectedExercise);

  const updateStableScore = useCallback((newScore: number) => {
    setScoreBuffer((prev) => {
      const newBuffer = [...prev, newScore].slice(-15);
      const averageScore = Math.round(
        newBuffer.reduce((a, b) => a + b, 0) / newBuffer.length
      );
      setStableScore(averageScore);
      return newBuffer;
    });
  }, []);

  const handlePoseDetected = async (pose: PoseLandmarkerResult) => {
    if (!selectedExercise) return;

    try {
      const analysis = await analyzeExerciseForm(pose, selectedExercise);

      if (analysis.isInitializing) {
        setAnalysisResult(initialAnalysisResult);
        return;
      }

      setAnalysisResult((prev) => ({
        ...prev, // Keep all existing properties
        feedback: analysis.feedback,
        categoryScores: analysis.categoryScores,
        overallScore: analysis.overallScore,
        repCount: analysis.repCount,
        consecutiveGoodReps: analysis.consecutiveGoodReps,
        repHistory: analysis.repHistory,
        lastAnalysisTime: analysis.lastAnalysisTime,
        aiInsights: analysis.aiInsights, // Make sure to include AI insights
      }));

      updateStableScore(analysis.overallScore);
    } catch (error) {
      console.error("Analysis error:", error);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(initialAnalysisResult);
    setScoreBuffer([]);
    setStableScore(0);
    if (selectedExercise) {
      ExerciseStateManager.resetState(selectedExercise);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setFile(file);
    resetAnalysis();
    if (!file) {
      setSelectedExercise("");
      setAnalyzing(false);
    }
  };

  const handleExerciseSelect = (exercise: string) => {
    setSelectedExercise(exercise);
    resetAnalysis();
  };

  const handleRestart = () => {
    resetAnalysis();
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-16 px-4">
      <div className="max-w-[1920px] mx-auto">
        {!file ? (
          <UploadSection
            onFileSelect={handleFileSelect}
            onAnalyze={() => setAnalyzing(true)}
            isAnalyzing={analyzing}
            hasFile={!!file}
            onExerciseSelect={handleExerciseSelect}
          />
        ) : (
          // Main container with balanced proportions
          <div className="flex flex-row gap-3 justify-center">
            {/* Video player section - Made narrower */}
            <div className="w-[38%]">
              <div className="bg-brand-secondary/20 rounded-xl p-4 flex flex-col items-center">
                <VideoPlayer
                  key={selectedExercise}
                  videoFile={file}
                  onPoseDetected={handlePoseDetected}
                  feedback={analysisResult.feedback}
                  categoryScores={analysisResult.categoryScores}
                  overallScore={stableScore}
                  onRestart={handleRestart}
                  onFileUpload={handleFileSelect}
                  selectedExercise={selectedExercise}
                />
              </div>
            </div>

            {/* Form Analysis and Feedback section - Made wider */}
            <div className="w-[60%]">
              <FeedbackPanel
                feedback={analysisResult.feedback}
                categoryScores={analysisResult.categoryScores}
                overallScore={stableScore}
                repCount={
                  exerciseState?.repCount ?? analysisResult.repCount ?? 0
                }
                consecutiveGoodReps={
                  exerciseState?.consecutiveGoodReps ??
                  analysisResult.consecutiveGoodReps ??
                  0
                }
                repHistory={
                  exerciseState?.repHistory ?? analysisResult.repHistory ?? []
                }
                className="h-full"
                aiInsights={analysisResult.aiInsights} // Pass AI insights to FeedbackPanel
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
