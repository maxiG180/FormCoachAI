import { useRef, useEffect, useState } from "react";
import {
  FilesetResolver,
  PoseLandmarker,
  PoseLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { Play, RotateCcw, Upload, Info } from "lucide-react";
import { drawPoseOnCanvas } from "@/utils/poseDrawing";
import { FeedbackItem } from "@/types/analyze";
import { analyzeExerciseForm, resetAnalyzer } from "@/utils/exerciseAnalysis";
import UploadNewButton from "./UploadNewButton";
import { VIDEO_VALIDATION } from "@/utils/constants/videoConstants";
import { RECORDING_GUIDELINES } from "@/utils/constants/videoConstants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  validateVideo,
  validateLandmarks,
  resetStabilityTracking,
} from "@/utils/videoValidator";

interface VideoPlayerProps {
  videoFile: File | null;
  onPoseDetected: (pose: PoseLandmarkerResult) => void;
  feedback: FeedbackItem[];
  categoryScores: Record<string, number>;
  overallScore: number;
  onRestart: () => void;
  onFileUpload: (file: File | null) => void;
  selectedExercise: string;
}

const VideoPlayer = ({
  videoFile,
  onPoseDetected,
  feedback,
  onRestart,
  categoryScores,
  overallScore,
  onFileUpload,
  selectedExercise,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const animationRef = useRef<number>();
  const frameRef = useRef<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isPoseDetectionReady, setIsPoseDetectionReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasPlayedBefore, setHasPlayedBefore] = useState(false);
  const [isFirstUpload, setIsFirstUpload] = useState(true);

  const prevExercise = useRef<string>(selectedExercise);
  const [trackingLossCount, setTrackingLossCount] = useState(0);
  const [showTrackingLossError, setShowTrackingLossError] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  const updateContainerSize = () => {
    if (containerRef.current && videoRef.current) {
      const container = containerRef.current;
      const video = videoRef.current;
      const maxContainerWidth =
        container.parentElement?.clientWidth || window.innerWidth;
      const videoAspectRatio = video.videoWidth / video.videoHeight;
      let containerWidth, containerHeight;

      if (videoAspectRatio < 1) {
        containerHeight = Math.min(
          window.innerHeight * 0.8,
          maxContainerWidth * 1.2
        );
        containerWidth = containerHeight * videoAspectRatio;
      } else {
        containerWidth = maxContainerWidth;
        containerHeight = containerWidth / videoAspectRatio;

        if (containerHeight > window.innerHeight * 0.8) {
          containerHeight = window.innerHeight * 0.8;
          containerWidth = containerHeight * videoAspectRatio;
        }
      }

      setContainerSize({
        width: Math.round(containerWidth),
        height: Math.round(containerHeight),
      });

      if (canvasRef.current) {
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
      }
    }
  };

  const resetState = (exercise: string) => {
    setIsPlaying(false);
    setHasPlayedBefore(false);
    setIsFirstUpload(true);
    setVideoError(null);
    setIsLoading(true);
    setIsPoseDetectionReady(false);
    setIsProcessing(false);

    // Clear visual elements but don't reset analytics
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    // Only reset analysis when exercise changes
    if (prevExercise.current !== exercise) {
      onRestart();
      prevExercise.current = exercise;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(updateContainerSize);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (landmarkerRef.current) {
        landmarkerRef.current.close(); // Added this line
      }
    };
  }, []);

  useEffect(() => {
    if (videoFile) {
      resetState(selectedExercise);
    }
  }, [videoFile, selectedExercise]);

  useEffect(() => {
    let mounted = true;
    let videoUrl = "";

    setupVideoAndPose();

    return () => {
      mounted = false;
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (landmarkerRef.current) landmarkerRef.current.close();
    };
  }, [videoFile]);

  const detectPose = async () => {
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const landmarker = landmarkerRef.current;

      if (!video || video.paused || !landmarker) {
        setIsProcessing(false);
        return;
      }

      frameRef.current += 1;
      const results = await landmarker.detectForVideo(video, frameRef.current);

      // Strict landmark validation
      if (!validateLandmarks(results, selectedExercise)) {
        handleTrackingLoss();
        if (!showTrackingLossError) {
          animationRef.current = requestAnimationFrame(detectPose);
        }
        return;
      }

      // Reset tracking loss counter if landmarks are valid
      resetTrackingLoss();

      const analysis = analyzeExerciseForm(results, selectedExercise);
      onPoseDetected(results);
      drawPoseOnCanvas(results, canvas!, feedback, video);

      if (!video.paused) {
        animationRef.current = requestAnimationFrame(detectPose);
      }
    } catch (error) {
      console.error("Detection error:", error);
      handleTrackingLoss();
    }
  };

  const handleUploadNew = () => {
    // Clean up existing video and animation
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Reset state while maintaining exercise selection
    setIsPlaying(false);
    setHasPlayedBefore(false);
    setIsFirstUpload(true);
    setVideoError(null);
    setTrackingLossCount(0);
    setShowTrackingLossError(false);

    // Notify parent component
    onFileUpload(null);
  };

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (videoRef.current.ended) {
      handleRestart();
      return;
    }

    if (videoRef.current.paused) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
        setHasPlayedBefore(true);
        animationRef.current = requestAnimationFrame(detectPose);
      } catch (error) {
        console.error("Error playing video:", error);
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const handleRestart = async () => {
    try {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      setIsPlaying(false);
      setVideoError(null);
      setTrackingLossCount(0);
      setShowTrackingLossError(false);
      resetStabilityTracking(); // Reset stability tracking on restart

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      }

      onRestart();
      resetAnalyzer();

      await new Promise((resolve) => requestAnimationFrame(resolve));

      if (videoRef.current && isPoseDetectionReady && landmarkerRef.current) {
        await videoRef.current.play();
        setIsPlaying(true);
        animationRef.current = requestAnimationFrame(detectPose);
      }
    } catch (error) {
      console.error("Restart error:", error);
      setVideoError(
        "Failed to restart video. Please try uploading another video that follows the guidelines."
      );
    }
  };

  const setupVideoAndPose = async () => {
    try {
      // Early return if no video file is provided
      if (!videoFile) return;

      // Set initial loading state
      if (isFirstUpload) {
        setIsLoading(true);
      }
      setVideoError(null);
      setIsFirstUpload(true);

      // First, validate the video before any processing
      const validation = await validateVideo(videoFile);
      setValidationErrors(validation.errors);
      setValidationWarnings(validation.warnings);

      // Stop here if video validation fails
      if (!validation.isValid) {
        setIsLoading(false);
        return;
      }

      // Create URL for video playback
      const videoUrl = URL.createObjectURL(videoFile);
      if (!videoRef.current) throw new Error("Video element not mounted yet");

      // Set up video element with proper attributes
      const video = videoRef.current;
      video.src = videoUrl;
      video.playbackRate = 1.0;
      video.muted = true;
      video.playsInline = true;

      // Wait for video metadata to load and validate dimensions
      await new Promise((resolve, reject) => {
        if (!video) return reject("No video element");

        const handleMetadata = () => {
          updateContainerSize();
          const aspectRatio = video.videoWidth / video.videoHeight;

          // Additional video validation checks
          if (aspectRatio < 0.5 || aspectRatio > 2.0) {
            setVideoError(
              "Video aspect ratio is unusual. Please ensure the video is not distorted."
            );
            setIsLoading(false);
            return;
          }

          if (video.videoWidth < 320 || video.videoHeight < 240) {
            setVideoError(
              "Video resolution is too low for accurate analysis. Please upload a higher quality video."
            );
            setIsLoading(false);
            return;
          }

          resolve(true);
        };

        video.addEventListener("loadedmetadata", handleMetadata, {
          once: true,
        });
        video.addEventListener("error", () => reject("Video failed to load"), {
          once: true,
        });
      });

      // Initialize MediaPipe vision tasks
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      // Create pose landmarker with increased confidence thresholds
      landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: 0.7,
        minPosePresenceConfidence: 0.7,
        minTrackingConfidence: 0.7,
        outputSegmentationMasks: false,
      });

      // Setup complete, update state
      setIsPoseDetectionReady(true);
      setIsLoading(false);
    } catch (error) {
      // Handle any errors during setup
      console.error("Setup error:", error);
      setVideoError(
        error instanceof Error ? error.message : "Failed to initialize"
      );
      setIsLoading(false);
    }
  };

  const handleTrackingLoss = () => {
    // We use a state setter with a callback to ensure we're working with the latest count
    setTrackingLossCount((prev) => prev + 1);

    // We only take action after significant tracking loss (30 frames ≈ 0.5 seconds at 60fps)
    // This gives time to recover from brief occlusions or movements
    if (trackingLossCount >= 30) {
      // Pause video and show error UI
      setShowTrackingLossError(true);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);

      // Stop the animation loop
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Create an empty pose result to clear the current visualization
      const emptyPoseResult: PoseLandmarkerResult = {
        landmarks: [],
        worldLandmarks: [],
        segmentationMasks: [],
        close: () => {}, // Required by interface but can be empty for our purposes
      };

      // Clear the current pose detection results
      onPoseDetected(emptyPoseResult);

      // Show a helpful error message to guide the user
      setVideoError(
        "Poor landmark tracking detected. Please ensure:\n" +
          "1. You're fully visible in the frame\n" +
          "2. The camera angle follows guidelines\n" +
          "3. There's good lighting\n" +
          "4. No rapid or erratic movements"
      );
    }
  };

  const resetTrackingLoss = () => {
    // Reset both the counter and the error state when tracking is regained
    setTrackingLossCount(0);
    setShowTrackingLossError(false);
  };

  return (
    <div className="flex flex-col items-center space-y-3 w-full">
      {/* Video container - Main wrapper for the video player */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden group ${
          isDragging ? "border-2 border-dashed border-brand-primary" : ""
        }`}
        style={{
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
          maxWidth: "100%",
          transition: "width 0.3s ease, height 0.3s ease",
        }}
      >
        {/* Upload placeholder - Shows when no video is loaded */}
        {!videoFile && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="text-white text-center p-4">
              <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4" />
              <p className="font-semibold text-sm sm:text-base">
                Drag & Drop a Video File
              </p>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2">
                or click to upload
              </p>
            </div>
          </div>
        )}

        {/* Video and canvas elements - The actual video player and pose overlay */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="w-full h-full object-contain rounded-md"
            playsInline
            muted
            onEnded={() => setIsPlaying(false)}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none object-contain"
          />
        </div>

        {/* Loading spinner - Shows during video initialization */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-brand-primary" />
          </div>
        )}

        {/* Error message overlay */}
        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="text-red-500 text-center p-4 max-w-sm">
              <p className="font-semibold text-sm sm:text-base">Error</p>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2">{videoError}</p>
            </div>
          </div>
        )}

        {/* Play/Restart button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          {!isLoading && !videoError && (
            <div className="flex gap-4">
              <button
                onClick={isPlaying ? handleRestart : handlePlayPause}
                className="p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                {!hasPlayedBefore ? (
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                ) : (
                  <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Analysis status indicator */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="text-white text-xs sm:text-sm md:text-base font-medium">
              AI FitCorrect analyzing your form...
            </div>
          </div>
        )}
      </div>

      {/* Validation Errors overlay */}
      {validationErrors.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-white text-center p-4 max-w-sm">
            <p className="font-semibold text-base mb-2">
              Video Validation Failed
            </p>
            {validationErrors.map((error, index) => (
              <p key={index} className="text-sm mb-1 text-red-400">
                {error}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Tracking loss error message overlay */}
      {showTrackingLossError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-white text-center p-4 max-w-sm">
            <p className="font-semibold text-base mb-2">Tracking Lost</p>
            <p className="text-sm mb-4">
              Unable to detect body landmarks. Please ensure you're visible in
              the frame and following the recording guidelines.
            </p>
            <button
              onClick={handleRestart}
              className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Upload controls and guidelines */}
      <div className="w-full flex justify-center items-center gap-2">
        <UploadNewButton onUploadNew={handleUploadNew} />
        <Dialog>
          <DialogTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Recording Guidelines</DialogTitle>
              <DialogDescription>
                <div className="mt-4 space-y-2">
                  {RECORDING_GUIDELINES[
                    selectedExercise as keyof typeof RECORDING_GUIDELINES
                  ]?.guidelines.map((guideline, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span
                        className={`text-${
                          guideline.importance === "critical"
                            ? "red"
                            : "brand-primary"
                        }`}
                      >
                        •
                      </span>
                      <div>
                        <span>{guideline.text}</span>
                        <p className="text-sm text-gray-500 mt-1">
                          {guideline.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Validation Warnings */}
      {validationWarnings.length > 0 && (
        <div className="w-full max-w-md mt-2">
          {validationWarnings.map((warning, index) => (
            <p key={index} className="text-sm text-yellow-500">
              {warning}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
export default VideoPlayer;
