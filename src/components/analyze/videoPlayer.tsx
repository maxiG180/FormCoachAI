// src/components/analyze/videoPlayer.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { RotateCcw, Play, Upload, Info } from "lucide-react";
import UploadNewButton from "./uploadNewButton";
import MediapipeProcessor from "./mediapipeProcessor";
import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { FeedbackItem } from "@/lib/types/analyze";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VideoPlayerProps {
  videoFile: File | null;
  onRestart: () => void;
  onFileUpload: (file: File | null) => void;
  selectedExercise: string;
  onPoseDetected?: (pose: PoseLandmarkerResult) => void;
  feedback?: FeedbackItem[];
}

const VideoPlayer = ({
  videoFile,
  onRestart,
  onFileUpload,
  selectedExercise,
  onPoseDetected = () => {},
  feedback = [],
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoOrientation, setVideoOrientation] = useState<
    "landscape" | "portrait" | null
  >(null);
  const [hasTrackingError, setHasTrackingError] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Create URL for video playback when file changes
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoUrl(url);
      setIsLoaded(false);
      setVideoOrientation(null);
      setHasTrackingError(false);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setVideoUrl(null);
      setIsLoaded(false);
      setVideoOrientation(null);
    }
  }, [videoFile]);

  // Update container size when window resizes
  useEffect(() => {
    const updateContainerSize = () => {
      if (
        containerRef.current &&
        videoRef.current &&
        videoRef.current.videoWidth
      ) {
        const containerWidth = containerRef.current.clientWidth;
        const videoRatio =
          videoRef.current.videoWidth / videoRef.current.videoHeight;

        // Calculate appropriate height based on width and aspect ratio
        const containerHeight = containerWidth / videoRatio;

        // Update canvas dimensions to match video dimensions
        if (canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        }

        setContainerSize({
          width: containerWidth,
          height: containerHeight,
        });
      }
    };

    window.addEventListener("resize", updateContainerSize);
    updateContainerSize();

    return () => {
      window.removeEventListener("resize", updateContainerSize);
    };
  }, [isLoaded]);

  // Handle video load event
  const handleVideoLoad = () => {
    setIsLoaded(true);

    // Detect video orientation
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      setVideoOrientation(videoWidth >= videoHeight ? "landscape" : "portrait");

      // Update container size based on video dimensions
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const videoRatio = videoWidth / videoHeight;
        const containerHeight = containerWidth / videoRatio;

        setContainerSize({
          width: containerWidth,
          height: containerHeight,
        });

        // Update canvas dimensions
        if (canvasRef.current) {
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
        }
      }
    }
  };

  // Handle play/restart button click
  const handlePlayClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasTrackingError(false);
          })
          .catch((error) => {
            console.error("Error playing video:", error);
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Handle video restart
  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setHasTrackingError(false);

      // Clear canvas
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
    }
  };

  // Placeholder for recording guidelines
  const RECORDING_GUIDELINES = {
    Squats: {
      guidelines: [
        {
          text: "Record from the side view",
          reason: "Side view best shows hip, knee, and ankle alignment",
          importance: "critical",
        },
        {
          text: "Ensure your full body is visible",
          reason: "AI needs to see your entire body",
          importance: "recommended",
        },
      ],
    },
    "Bench Press": {
      guidelines: [
        {
          text: "Record from the side view",
          reason: "Side view shows chest movement",
          importance: "critical",
        },
      ],
    },
    Deadlifts: {
      guidelines: [
        {
          text: "Record from the side view",
          reason: "Side view best shows back position",
          importance: "critical",
        },
      ],
    },
  };

  // Handle tracking errors
  const handleTrackingLost = () => {
    setHasTrackingError(true);
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTrackingRestored = () => {
    setHasTrackingError(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Video container */}
      <div
        ref={containerRef}
        className="relative w-full rounded-xl overflow-hidden bg-black/30 flex items-center justify-center group"
        style={{
          height:
            containerSize.height > 0 ? `${containerSize.height}px` : "400px",
          minHeight: "400px",
          maxHeight: "600px",
        }}
      >
        {videoUrl ? (
          <div
            className={`relative h-full flex items-center justify-center ${
              videoOrientation === "portrait" ? "max-w-[60%]" : "w-full"
            }`}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              className={`rounded-lg object-contain ${
                videoOrientation === "portrait" ? "h-full" : "w-full"
              }`}
              onLoadedData={handleVideoLoad}
              onClick={handlePlayClick}
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        ) : (
          <div className="text-white text-center p-8">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="mb-2">No video loaded</p>
            <p className="text-sm text-gray-400">
              Upload a video to begin analysis
            </p>
          </div>
        )}

        {/* MediaPipe processor (invisible) */}
        {videoUrl && isLoaded && (
          <MediapipeProcessor
            videoRef={videoRef as React.RefObject<HTMLVideoElement>}
            canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
            isPlaying={isPlaying}
            selectedExercise={selectedExercise}
            onPoseDetected={onPoseDetected}
            feedback={feedback}
            onTrackingLost={handleTrackingLost}
            onTrackingRestored={handleTrackingRestored}
          />
        )}

        {/* Tracking error overlay */}
        {hasTrackingError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
            <div className="text-center p-4 max-w-sm">
              <p className="font-semibold text-red-400 text-lg mb-2">
                Tracking Lost
              </p>
              <p className="text-white mb-4">
                Unable to detect your body position. Please ensure:
              </p>
              <ul className="text-gray-300 text-sm text-left list-disc pl-6 mb-4">
                <li>Your full body is visible in the frame</li>
                <li>There&apos;s adequate lighting</li>
                <li>
                  You&apos;re in the correct position (side view for squats)
                </li>
                <li>You&apos;re not moving too quickly</li>
              </ul>
              <button
                onClick={handleRestart}
                className="bg-[#FF6500] hover:bg-[#FF6500]/90 text-white px-4 py-2 rounded"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Restart button - only shown on hover */}
        {isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={isPlaying ? handleRestart : handlePlayClick}
              className="p-3 rounded-full bg-[#FF6500]/80 hover:bg-[#FF6500] text-white transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <RotateCcw className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
          </div>
        )}

        {/* Analysis Status Indicator - shown when video is playing */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white font-medium text-sm">
              AI analyzing your form...
            </p>
          </div>
        )}
      </div>

      {/* Controls beneath video player */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <UploadNewButton onUploadNew={() => onFileUpload(null)} />

        <Dialog>
          <DialogTrigger asChild>
            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Info className="w-5 h-5 text-white" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Recording Guidelines</DialogTitle>
              <DialogDescription>
                <div className="mt-4 space-y-2">
                  {RECORDING_GUIDELINES[
                    selectedExercise as keyof typeof RECORDING_GUIDELINES
                  ]?.guidelines.map(
                    (
                      guideline: {
                        text: string;
                        reason: string;
                        importance: string;
                      },
                      index: number
                    ) => (
                      <div key={index} className="flex items-start gap-2">
                        <span
                          className={`text-${
                            guideline.importance === "critical"
                              ? "red-500"
                              : "[#FF6500]"
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
                    )
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default VideoPlayer;
