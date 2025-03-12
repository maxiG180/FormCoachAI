// src/app/(protected)/analyze/client.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ExerciseSelector from "@/components/analyze/exerciseSelector";
import UploadSection from "@/components/analyze/uploadSection";
import FeedbackPanel from "@/components/analyze/feedbackPanel";
import VideoPlayer from "@/components/analyze/videoPlayer";
import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { FeedbackItem } from "@/lib/types/analyze";
import { usePathname } from "next/navigation";

export default function AnalyzeClient() {
  // State variables to control page flow
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isVideoComplete, setIsVideoComplete] = useState<boolean>(false);
  const [showAnalysisResults, setShowAnalysisResults] =
    useState<boolean>(false);

  // Add a ref to track component mount state
  const isMounted = useRef(true);
  const pathname = usePathname();

  // Reset all states completely
  const resetAllStates = useCallback(() => {
    setSelectedExercise("");
    setSelectedFile(null);
    setIsAnalyzing(false);
    setIsVideoComplete(false);
    setShowAnalysisResults(false);
    resetAnalysisState();
  }, []);

  // Cleanup on unmount and handle re-mount
  useEffect(() => {
    isMounted.current = true;

    // Reset states on path change/remount
    resetAllStates();

    return () => {
      isMounted.current = false;
    };
  }, [pathname, resetAllStates]); // Added resetAllStates to dependency array

  // State for analysis data
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [categoryScores, setCategoryScores] = useState({
    form: 0,
    depth: 0,
    alignment: 0,
    balance: 0,
  });
  const [overallScore, setOverallScore] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [consecutiveGoodReps, setConsecutiveGoodReps] = useState(0);

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

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setIsVideoComplete(false);
    setShowAnalysisResults(false);
  };

  // This function is specifically for the VideoPlayer component
  const handleVideoFileUpload = (file: File | null) => {
    setSelectedFile(file);
    if (!file) {
      setShowAnalysisResults(false);
    }
  };

  const handleAnalyze = () => {
    // Immediately set analyzing state for visual feedback
    setIsAnalyzing(true);

    // For demo purposes, simulate analysis completion after 2 seconds (reduced from 5)
    const analysisTimer = setTimeout(() => {
      // Check if component is still mounted before updating state
      if (isMounted.current) {
        setIsVideoComplete(true);
        setIsAnalyzing(false);
        setShowAnalysisResults(true);

        // Set dummy results
        setCategoryScores({
          form: 88,
          depth: 82,
          alignment: 85,
          balance: 90,
        });
        setOverallScore(85);
        setRepCount(5);
        setConsecutiveGoodReps(3);
      }
    }, 2000); // Reduced to 2 seconds for better UX

    // Cleanup timer if component unmounts
    return () => clearTimeout(analysisTimer);
  };

  // Dummy handler for pose detection
  const handlePoseDetected = (pose: PoseLandmarkerResult) => {
    // This would contain real pose analysis logic
    console.log(
      "Pose detected",
      pose.landmarks?.[0]?.length || 0,
      "landmarks found"
    );
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

          {!showAnalysisResults ? (
            /* Selection and Upload Phase */
            <div className="space-y-10">
              {/* Exercise selection - always shown */}
              <div className="w-full">
                <ExerciseSelector
                  onExerciseSelect={handleExerciseSelect}
                  onValidityChange={() => {}}
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
                      onAnalyze={handleAnalyze}
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
                  }}
                  onFileUpload={handleVideoFileUpload}
                  selectedExercise={selectedExercise}
                  onPoseDetected={handlePoseDetected}
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
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
