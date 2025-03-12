// src/components/analyze/mediapipeProcessor.tsx
"use client";

import { useRef, useEffect } from "react";
import {
  FilesetResolver,
  PoseLandmarker,
  PoseLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { drawPoseOnCanvas } from "@/lib/utils/poseDrawing";
import { FeedbackItem } from "@/lib/types/analyze";

interface MediapipeProcessorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isPlaying: boolean;
  selectedExercise: string;
  onPoseDetected: (pose: PoseLandmarkerResult) => void;
  feedback: FeedbackItem[];
  onTrackingLost?: () => void;
  onTrackingRestored?: () => void;
}

const MediapipeProcessor = ({
  videoRef,
  canvasRef,
  isPlaying,
  selectedExercise,
  onPoseDetected,
  feedback,
  onTrackingLost,
  onTrackingRestored,
}: MediapipeProcessorProps) => {
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const animationRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const consecutiveTrackingErrors = useRef<number>(0);
  const MIN_CONSECUTIVE_TRACKING_ERRORS = 15; // About 0.25s at 60fps
  const isInitializing = useRef(true);

  // Initialize pose detection
  useEffect(() => {
    let isMounted = true;
    console.log("Initializing MediaPipe Pose Detection");

    const initializePoseDetection = async () => {
      try {
        // Initialize MediaPipe vision tasks
        console.log("Loading FilesetResolver...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        console.log("FilesetResolver loaded successfully");

        // Create pose landmarker with confidence thresholds
        console.log("Creating PoseLandmarker...");
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.5, // Lowered for better detection
          minPosePresenceConfidence: 0.5, // Lowered for better detection
          minTrackingConfidence: 0.5, // Lowered for better detection
          outputSegmentationMasks: false,
        });
        console.log("PoseLandmarker created successfully");

        if (isMounted) {
          landmarkerRef.current = landmarker;
          isInitializing.current = false;
          console.log("Pose detection initialization complete");
        }
      } catch (error) {
        console.error("Error initializing pose detection:", error);
        isInitializing.current = false;
      }
    };

    initializePoseDetection();

    return () => {
      isMounted = false;
      if (landmarkerRef.current) {
        console.log("Closing PoseLandmarker");
        landmarkerRef.current.close();
      }
    };
  }, []);

  // Handle pose detection
  useEffect(() => {
    if (!isPlaying || isInitializing.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const detectPose = async () => {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const landmarker = landmarkerRef.current;

        if (!video || video.paused || !landmarker || !canvas) {
          return;
        }

        frameRef.current += 1;
        const timestamp = performance.now();
        const results = await landmarker.detectForVideo(video, timestamp);

        // Check if we have enough landmarks with good confidence
        const hasValidLandmarks =
          results.landmarks?.[0]?.length > 0 &&
          results.landmarks[0].some(
            (landmark) =>
              landmark && landmark.visibility && landmark.visibility > 0.5
          );

        if (!hasValidLandmarks) {
          consecutiveTrackingErrors.current += 1;
          console.log(`Tracking error: ${consecutiveTrackingErrors.current}`);

          if (
            consecutiveTrackingErrors.current >=
              MIN_CONSECUTIVE_TRACKING_ERRORS &&
            onTrackingLost
          ) {
            onTrackingLost();
          }
        } else {
          if (
            consecutiveTrackingErrors.current >=
              MIN_CONSECUTIVE_TRACKING_ERRORS &&
            onTrackingRestored
          ) {
            onTrackingRestored();
          }
          consecutiveTrackingErrors.current = 0;

          // Process valid pose detection
          onPoseDetected(results);

          // Draw the pose on the canvas
          const drawn = drawPoseOnCanvas(results, canvas, feedback, video);
          if (!drawn) {
            console.warn("Failed to draw pose on canvas");
          }
        }

        if (!video.paused) {
          animationRef.current = requestAnimationFrame(detectPose);
        }
      } catch (error) {
        console.error("Detection error:", error);
        consecutiveTrackingErrors.current += 1;

        if (
          consecutiveTrackingErrors.current >=
            MIN_CONSECUTIVE_TRACKING_ERRORS &&
          onTrackingLost
        ) {
          onTrackingLost();
        }

        if (videoRef.current && !videoRef.current.paused) {
          animationRef.current = requestAnimationFrame(detectPose);
        }
      }
    };

    detectPose();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, onPoseDetected, feedback, onTrackingLost, onTrackingRestored]);

  return null; // This is a processing component, not a visual one
};

export default MediapipeProcessor;
