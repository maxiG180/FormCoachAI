// src/app/(protected)/analyze/client.tsx

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ExerciseSelector from "@/components/analyze/exerciseSelector";
import UploadSection from "@/components/analyze/uploadSection";
import FeedbackPanel from "@/components/analyze/feedbackPanel";
import VideoPlayer from "@/components/analyze/videoPlayer";
import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { FeedbackItem, AnalysisResult } from "@/lib/types/analyze";
import { usePathname } from "next/navigation";
import {
  analyzeSquatForm,
  resetSquatAnalyzer,
  finalizeSquatAnalysis,
} from "@/lib/utils/squatAnalyzer";
import {
  validateVideoFile,
  resetTrackingData,
} from "@/lib/utils/validationUtils";

// Define a type for the category scores to ensure proper type checking
type CategoryScores = {
  form: number;
  depth: number;
  alignment: number;
  balance: number;
};

export default function AnalyzeClient() {
  // State variables to control page flow
  const [selectedExercise, setSelectedExercise] = useState<string>("Squats");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isVideoComplete, setIsVideoComplete] = useState<boolean>(false);
  const [showAnalysisResults, setShowAnalysisResults] =
    useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Add a ref to track component mount state
  const isMounted = useRef(true);
  const pathname = usePathname();

  // Reset all states completely
  const resetAllStates = useCallback(() => {
    setSelectedExercise("Squats");
    setSelectedFile(null);
    setIsAnalyzing(false);
    setIsVideoComplete(false);
    setShowAnalysisResults(false);
    setValidationError(null);
    setValidationWarnings([]);
    resetAnalysisState();
    resetTrackingData();
    resetSquatAnalyzer();
  }, []);

  // Cleanup on unmount and handle re-mount
  useEffect(() => {
    isMounted.current = true;

    // Reset states on path change/remount
    resetAllStates();

    return () => {
      isMounted.current = false;
    };
  }, [pathname, resetAllStates]);

  // State for analysis data
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [categoryScores, setCategoryScores] = useState<CategoryScores>({
    form: 0,
    depth: 0,
    alignment: 0,
    balance: 0,
  });
  const [overallScore, setOverallScore] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [consecutiveGoodReps, setConsecutiveGoodReps] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [aiConfidence, setAiConfidence] = useState(0);

  // Reset analysis state function
  const resetAnalysisState = () => {
    setFeedback([]);
    setCategoryScores({
      form: 0,
      depth: 0,
      alignment: 0,
      balance: 0,
    });
    setOverallScore(0);
    setRepCount(0);
    setConsecutiveGoodReps(0);
    setAnalysisResult(null);
    setAiConfidence(0);
  };

  // Handlers for component interactions
  const handleExerciseSelect = (exercise: string) => {
    setSelectedExercise(exercise);
    // Reset other states when exercise changes
    setSelectedFile(null);
    setIsAnalyzing(false);
    setIsVideoComplete(false);
    setShowAnalysisResults(false);
    resetAnalysisState();
  };

  const handleFileSelect = async (file: File) => {
    // Validate the file first
    try {
      const validation = await validateVideoFile(file);

      if (!validation.isValid) {
        setValidationError(validation.errors[0]);
        setValidationWarnings(validation.warnings);
        return;
      }

      if (validation.warnings.length > 0) {
        setValidationWarnings(validation.warnings);
      }

      // File is valid, proceed
      setSelectedFile(file);
      setIsVideoComplete(false);
      setShowAnalysisResults(false);
      setValidationError(null);
    } catch (error) {
      console.error("Error validating video:", error);
      setValidationError("Failed to validate video. Please try another file.");
    }
  };

  // This function is specifically for the VideoPlayer component
  const handleVideoFileUpload = (file: File | null) => {
    setSelectedFile(file);
    if (!file) {
      setShowAnalysisResults(false);
      setValidationError(null);
      setValidationWarnings([]);
    }
  };

  // Handle video playback events
  const handleVideoPlay = () => {
    setIsAnalyzing(true);
    resetSquatAnalyzer();
  };

  const handleVideoPause = () => {
    // Optionally handle pause events
  };

  const handleVideoComplete = () => {
    setIsVideoComplete(true);
    setIsAnalyzing(false);
    setShowAnalysisResults(true);

    // Get final analysis results
    const finalResult = finalizeSquatAnalysis();
    if (finalResult) {
      setAnalysisResult(finalResult);
      setFeedback(finalResult.feedback);

      // Fix for TypeScript error - Ensure finalResult.categoryScores has all required properties
      const scores: CategoryScores = {
        form: finalResult.categoryScores.form || 0,
        depth: finalResult.categoryScores.depth || 0,
        alignment: finalResult.categoryScores.alignment || 0,
        balance: finalResult.categoryScores.balance || 0,
      };
      setCategoryScores(scores);

      setOverallScore(finalResult.overallScore);
      setRepCount(finalResult.repCount || 0);
      setConsecutiveGoodReps(finalResult.consecutiveGoodReps || 0);
      setAiConfidence(finalResult.aiConfidence || 95);
    }
  };

  // Handle pose detection from MediaPipe
  const handlePoseDetected = (pose: PoseLandmarkerResult) => {
    if (!isAnalyzing) return;

    // Analyze the pose based on the selected exercise
    let result: AnalysisResult;

    switch (selectedExercise) {
      case "Squats":
        result = analyzeSquatForm(pose);
        break;
      // Add other exercises when implemented
      default:
        result = analyzeSquatForm(pose);
    }

    // Update state with the analysis results
    setFeedback(result.feedback);

    // Fix for TypeScript error - Ensure result.categoryScores has all required properties
    const scores: CategoryScores = {
      form: result.categoryScores.form || 0,
      depth: result.categoryScores.depth || 0,
      alignment: result.categoryScores.alignment || 0,
      balance: result.categoryScores.balance || 0,
    };
    setCategoryScores(scores);

    setOverallScore(result.overallScore);
    setRepCount(result.repCount || 0);
    setConsecutiveGoodReps(result.consecutiveGoodReps || 0);
    setAiConfidence(result.aiConfidence || 0);
    setAnalysisResult(result);
  };

  return (
    <main className="min-h-screen pt-6 px-4 bg-black">
      <div className="container mx-auto py-6">
        <div className="bg-black border border-[#FF6500]/30 rounded-xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-4">
            Analyze Your <span className="text-[#FF6500]">Workout</span>
          </h1>
          <p className="text-gray-300 mb-6">
            Upload a video of your workout to get real-time AI feedback on your
            form and technique.
          </p>

          {/* Display validation errors/warnings prominently */}
          {validationError && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-6">
              <h3 className="font-semibold mb-1">Video Validation Error</h3>
              <p>{validationError}</p>
            </div>
          )}

          {validationWarnings.length > 0 && !validationError && (
            <div className="bg-yellow-500/20 text-yellow-400 p-3 rounded-lg mb-6">
              <h3 className="font-semibold mb-1">Video Recommendations</h3>
              <ul className="list-disc list-inside">
                {validationWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {!showAnalysisResults ? (
            /* Selection and Upload Phase */
            <div className="space-y-10">
              {/* Exercise selection - always shown */}
              <div className="w-full">
                {/* Fix for missing onValidityChange prop */}
                <ExerciseSelector
                  onExerciseSelect={handleExerciseSelect}
                  onValidityChange={() => {}} // Add the missing prop
                  selectedExercise={selectedExercise}
                />
              </div>

              {/* Upload section - shown only when exercise is selected */}
              {selectedExercise && (
                <div className="mt-10 border-t border-[#FF6500]/20 pt-10">
                  <h2 className="text-xl font-bold text-white mb-6 px-4">
                    Selected Exercise:{" "}
                    <span className="text-[#FF6500]">{selectedExercise}</span>
                  </h2>

                  <div className="max-w-3xl mx-auto">
                    <UploadSection
                      onFileSelect={handleFileSelect}
                      onAnalyze={() => setShowAnalysisResults(true)}
                      isAnalyzing={isAnalyzing}
                      hasFile={!!selectedFile}
                      isExerciseSelected={!!selectedExercise}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Analysis Results Phase - Fixed-height grid layout for better alignment */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Video player on the left - Fixed height to match feedback panel */}
              <div className="lg:col-span-5 h-full flex flex-col">
                <VideoPlayer
                  videoFile={selectedFile}
                  onRestart={() => {
                    setIsVideoComplete(false);
                    resetAnalysisState();
                    resetSquatAnalyzer();
                  }}
                  onFileUpload={handleVideoFileUpload}
                  selectedExercise={selectedExercise}
                  onPoseDetected={handlePoseDetected}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  onComplete={handleVideoComplete}
                  feedback={feedback}
                  isVideoComplete={isVideoComplete}
                />
              </div>

              {/* Feedback panel on the right - Same height as video player */}
              <div className="lg:col-span-7 h-full">
                <FeedbackPanel
                  isVideoComplete={isVideoComplete}
                  feedback={feedback}
                  categoryScores={categoryScores}
                  overallScore={overallScore}
                  repCount={repCount}
                  consecutiveGoodReps={consecutiveGoodReps}
                  aiConfidence={aiConfidence}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
