import { PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { FeedbackItem } from '../types/analyze';

export const drawPoseOnCanvas = (
  pose: PoseLandmarkerResult,
  canvas: HTMLCanvasElement,
  feedback: FeedbackItem[],
  videoElement: HTMLVideoElement
): boolean => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate display dimensions while maintaining aspect ratio
  const videoRatio = videoElement.videoWidth / videoElement.videoHeight;
  let videoDisplayWidth, videoDisplayHeight;

  // Calculate dimensions based on container constraints
  if (videoRatio < 1) {
    // Portrait video
    videoDisplayHeight = canvas.height;
    videoDisplayWidth = videoDisplayHeight * videoRatio;
  } else {
    // Landscape video
    videoDisplayWidth = canvas.width;
    videoDisplayHeight = videoDisplayWidth / videoRatio;
  }

  // Center the video in the canvas
  const xOffset = (canvas.width - videoDisplayWidth) / 2;
  const yOffset = (canvas.height - videoDisplayHeight) / 2;

  // Scale factors for landmark mapping
  const scaleX = videoDisplayWidth / videoElement.videoWidth;
  const scaleY = videoDisplayHeight / videoElement.videoHeight;

  // Define the skeletal connections
  const connections = [
    [12, 11], // shoulders
    [11, 23], // left trunk
    [12, 24], // right trunk
    [24, 23], // hips
    [11, 13], // left upper arm
    [13, 15], // left forearm
    [12, 14], // right upper arm
    [14, 16], // right forearm
    [23, 25], // left thigh
    [25, 27], // left calf
    [24, 26], // right thigh
    [26, 28], // right calf
  ];

  // Check if landmarks are available
  if (!pose.landmarks || pose.landmarks.length === 0) return false;
  const landmarks = pose.landmarks[0];
  if (!landmarks) return false;

  // Calculate line widths and point sizes based on video dimensions
  const shoulderWidth = Math.abs(landmarks[11].x - landmarks[12].x) * videoDisplayWidth;
  const baseLineWidth = 1.2;
  const basePointRadius = 0.6;
  const scaleRatio = shoulderWidth / videoDisplayWidth;
  const lineWidth = Math.min(baseLineWidth * (scaleRatio * 8), 2.0);
  const pointRadius = Math.min(basePointRadius * (scaleRatio * 8), 0.8);

  // Get current time for feedback timing
  const currentTime = Date.now();

  // Draw the skeleton connections
  connections.forEach(([i, j]) => {
    const start = landmarks[i];
    const end = landmarks[j];

    if (
      start &&
      end &&
      start.visibility &&
      end.visibility &&
      start.visibility > 0.5 &&
      end.visibility > 0.5
    ) {
      const zDepth = (start.z + end.z) / 2;
      const opacity = Math.max(0.6, Math.min(1.0, 1 - Math.abs(zDepth)));

      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`;

      ctx.moveTo(
        start.x * videoDisplayWidth + xOffset,
        start.y * videoDisplayHeight + yOffset
      );
      ctx.lineTo(
        end.x * videoDisplayWidth + xOffset,
        end.y * videoDisplayHeight + yOffset
      );
      ctx.stroke();
    }
  });

  // Draw the landmark points
  landmarks.forEach((point) => {
    if (point.visibility && point.visibility > 0.5) {
      const opacity = Math.max(0.7, Math.min(1.0, 1 - Math.abs(point.z)));
      const finalRadius = pointRadius * (0.8 + point.visibility * 0.2);

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.arc(
        point.x * videoDisplayWidth + xOffset,
        point.y * videoDisplayHeight + yOffset,
        finalRadius,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  });

  // Filter and draw recent feedback
  const recentFeedback = feedback.filter((item) => {
    // Only show feedback from the last 2 seconds
    return currentTime - item.timestamp < 2000;
  });

  recentFeedback.forEach((item) => {
    if (item.type === 'error' && item.keypoints) {
      const [start, mid, end] = item.keypoints;

      if (
        start &&
        mid &&
        end &&
        start.visibility &&
        mid.visibility &&
        end.visibility &&
        start.visibility > 0.5 &&
        mid.visibility > 0.5 &&
        end.visibility > 0.5
      ) {
        const avgZDepth = (start.z + mid.z + end.z) / 3;
        const feedbackAge = currentTime - item.timestamp;
        const fadeOutStart = 1500; // Start fading at 1.5s
        const fadeOutDuration = 500; // Fade over 0.5s

        let ageOpacity = 1;
        if (feedbackAge > fadeOutStart) {
          ageOpacity = Math.max(0, 1 - (feedbackAge - fadeOutStart) / fadeOutDuration);
        }

        const baseOpacity = Math.max(0.6, Math.min(1.0, 1 - Math.abs(avgZDepth)));
        const finalOpacity = baseOpacity * ageOpacity;

        if (finalOpacity > 0) {
          // Draw error line
          ctx.beginPath();
          ctx.lineWidth = lineWidth * 1.2;
          ctx.strokeStyle = `rgba(255, 0, 0, ${finalOpacity})`;

          ctx.moveTo(
            start.x * videoDisplayWidth + xOffset,
            start.y * videoDisplayHeight + yOffset
          );
          ctx.lineTo(
            mid.x * videoDisplayWidth + xOffset,
            mid.y * videoDisplayHeight + yOffset
          );
          ctx.lineTo(
            end.x * videoDisplayWidth + xOffset,
            end.y * videoDisplayHeight + yOffset
          );
          ctx.stroke();

          // Draw error points
          [start, mid, end].forEach((point) => {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 0, 0, ${finalOpacity})`;
            ctx.arc(
              point.x * videoDisplayWidth + xOffset,
              point.y * videoDisplayHeight + yOffset,
              pointRadius * 1.2,
              0,
              2 * Math.PI
            );
            ctx.fill();
          });
        }
      }
    }
  });

  return true;
};