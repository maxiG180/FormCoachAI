// lib/utils/poseDrawing.ts
import { PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { FeedbackItem } from '@/lib/types/analyze';

// Define a type for landmarks to avoid using 'any'
interface Landmark {
  x: number;
  y: number;
  visibility: number;
}

export const drawPoseOnCanvas = (
  pose: PoseLandmarkerResult,
  canvas: HTMLCanvasElement,
  feedback: FeedbackItem[],
  videoElement: HTMLVideoElement,
  selectedExercise: string = ''
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

  // Check if landmarks are available
  if (!pose.landmarks || pose.landmarks.length === 0) return false;
  const landmarks = pose.landmarks[0];
  if (!landmarks) return false;

  // Define the main skeletal connections - for a cleaner, more intuitive visualization
  const mainConnections = [
    // Torso
    [11, 12], // shoulders
    [12, 24], // right trunk
    [11, 23], // left trunk
    [23, 24], // hips
    
    // Legs
    [23, 25], // left thigh
    [25, 27], // left calf
    [24, 26], // right thigh
    [26, 28], // right calf
    
    // Arms (include for better form analysis)
    [11, 13], // left upper arm
    [13, 15], // left forearm
    [12, 14], // right upper arm
    [14, 16], // right forearm
  ];

  // Define key points to always show
  const keyPoints = [
    11, 12, // shoulders
    13, 14, // elbows
    15, 16, // wrists
    23, 24, // hips
    25, 26, // knees
    27, 28  // ankles
  ];

  // Colors for different body parts
  const colors = {
    torso: 'rgba(255, 0, 0, 0.8)',         // Red for torso
    arms: 'rgba(255, 255, 255, 0.8)',      // White for arms
    legs: 'rgba(50, 205, 50, 0.8)',        // Green for legs
    joints: 'rgba(255, 255, 255, 0.9)',    // White for joints
    head: 'rgba(255, 255, 100, 0.8)',      // Yellow for head
    text: 'rgba(255, 255, 255, 0.9)',
    equipmentHighlight: 'rgba(0, 255, 255, 0.4)', // Cyan for equipment
    silhouette: 'rgba(255, 0, 0, 0.1)'     // Light red silhouette
  };

  // Calculate appropriate sizes based on video dimensions
  const videoArea = videoDisplayWidth * videoDisplayHeight;
  const sizeRatio = Math.sqrt(videoArea) / 500; // Normalize for different video sizes
  
  const lineWidth = Math.max(2, 3 * sizeRatio);
  const jointRadius = Math.max(4, 5 * sizeRatio);

  // Draw equipment highlights (weights, bar, etc.)
  if (selectedExercise === 'Squats') {
    // Identify barbell position based on shoulder height
    const leftShoulderX = landmarks[11].x * videoDisplayWidth + xOffset;
    const rightShoulderX = landmarks[12].x * videoDisplayWidth + xOffset;
    const shoulderY = ((landmarks[11].y + landmarks[12].y) / 2) * videoDisplayHeight + yOffset;
    // Comment out the unused variable to avoid lint errors
    // const shoulderWidth = rightShoulderX - leftShoulderX;
    
    // Draw barbell with 3D effect
    const barHeight = 15 * sizeRatio;
    ctx.beginPath();
    const barGradient = ctx.createLinearGradient(0, shoulderY - barHeight/2, 0, shoulderY + barHeight/2);
    barGradient.addColorStop(0, 'rgba(180, 180, 180, 0.7)');
    barGradient.addColorStop(0.5, 'rgba(220, 220, 220, 0.8)');
    barGradient.addColorStop(1, 'rgba(150, 150, 150, 0.7)');
    
    ctx.fillStyle = barGradient;
    ctx.rect(leftShoulderX - (rightShoulderX - leftShoulderX)/2, shoulderY - barHeight/2, 
             (rightShoulderX - leftShoulderX) * 2, barHeight);
    ctx.fill();
    
    // Add a metallic stroke to the bar
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.stroke();
    
    // Draw weight plates on each side with 3D effect
    const plateSize = 50 * sizeRatio;
    
    // Draw multiple plates on each side
    [-1, 1].forEach((side) => { // -1 for left, 1 for right
      const plateColors = ['red', 'blue', 'yellow', 'green'];
      const plateX = side === -1 ? leftShoulderX - (rightShoulderX - leftShoulderX)/2 - 20 : rightShoulderX + (rightShoulderX - leftShoulderX)/2 + 20;
      
      // Draw multiple plates stacked
      for (let i = 0; i < 2; i++) {
        const offset = i * 15 * side;
        const plateX_offset = plateX + offset;
        
        // Create plate gradient for 3D effect
        const plateGradient = ctx.createRadialGradient(
          plateX_offset, shoulderY, 0,
          plateX_offset, shoulderY, plateSize/2
        );
        
        const color = plateColors[i % plateColors.length];
        let plateColor1, plateColor2;
        
        switch(color) {
          case 'red':
            plateColor1 = 'rgba(255, 50, 50, 0.7)';
            plateColor2 = 'rgba(200, 0, 0, 0.5)';
            break;
          case 'blue':
            plateColor1 = 'rgba(50, 50, 255, 0.7)';
            plateColor2 = 'rgba(0, 0, 200, 0.5)';
            break;
          case 'yellow':
            plateColor1 = 'rgba(255, 255, 50, 0.7)';
            plateColor2 = 'rgba(200, 200, 0, 0.5)';
            break;
          case 'green':
              plateColor1 = 'rgba(50, 255, 50, 0.7)';
              plateColor2 = 'rgba(0, 200, 0, 0.5)';
              break;
            default:
              plateColor1 = 'rgba(255, 50, 50, 0.7)';
              plateColor2 = 'rgba(0, 200, 0, 0.5)';
        }
        
        plateGradient.addColorStop(0, plateColor1);
        plateGradient.addColorStop(1, plateColor2);
        
        // Draw circular plate
        ctx.beginPath();
        ctx.fillStyle = plateGradient;
        ctx.arc(plateX_offset, shoulderY, plateSize/2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add a white highlight to give a 3D effect
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.arc(plateX_offset - plateSize/8, shoulderY - plateSize/8, plateSize/6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add plate border
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.arc(plateX_offset, shoulderY, plateSize/2, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Add center hole
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.arc(plateX_offset, shoulderY, plateSize/8, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  }

  // Draw a semi-transparent silhouette for the body
  ctx.beginPath();
  ctx.fillStyle = colors.silhouette;
  
  // Draw torso silhouette
  if (landmarks[11] && landmarks[12] && landmarks[23] && landmarks[24] && 
      landmarks[11].visibility > 0.3 && landmarks[12].visibility > 0.3 && 
      landmarks[23].visibility > 0.3 && landmarks[24].visibility > 0.3) {
    
    const torsoPoints = [
      {x: landmarks[11].x * videoDisplayWidth + xOffset, y: landmarks[11].y * videoDisplayHeight + yOffset}, // left shoulder
      {x: landmarks[12].x * videoDisplayWidth + xOffset, y: landmarks[12].y * videoDisplayHeight + yOffset}, // right shoulder
      {x: landmarks[24].x * videoDisplayWidth + xOffset, y: landmarks[24].y * videoDisplayHeight + yOffset}, // right hip
      {x: landmarks[23].x * videoDisplayWidth + xOffset, y: landmarks[23].y * videoDisplayHeight + yOffset}  // left hip
    ];
    
    ctx.beginPath();
    ctx.moveTo(torsoPoints[0].x, torsoPoints[0].y);
    for (let i = 1; i < torsoPoints.length; i++) {
      ctx.lineTo(torsoPoints[i].x, torsoPoints[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 50, 50, 0.25)'; // Slightly more vibrant torso
    ctx.fill();
    
    // Add legs silhouettes with different colors
    if (landmarks[25] && landmarks[26] && landmarks[27] && landmarks[28] && 
        landmarks[25].visibility > 0.3 && landmarks[26].visibility > 0.3 &&
        landmarks[27].visibility > 0.3 && landmarks[28].visibility > 0.3) {
      
      // Left leg - green tint
      ctx.beginPath();
      ctx.moveTo(torsoPoints[3].x, torsoPoints[3].y); // Left hip
      ctx.lineTo(landmarks[25].x * videoDisplayWidth + xOffset, landmarks[25].y * videoDisplayHeight + yOffset); // Left knee
      ctx.lineTo(landmarks[27].x * videoDisplayWidth + xOffset, landmarks[27].y * videoDisplayHeight + yOffset); // Left ankle
      // Add width to the leg
      ctx.lineTo(landmarks[27].x * videoDisplayWidth + xOffset - 10, landmarks[27].y * videoDisplayHeight + yOffset);
      ctx.lineTo(landmarks[25].x * videoDisplayWidth + xOffset - 10, landmarks[25].y * videoDisplayHeight + yOffset);
      ctx.closePath();
      ctx.fillStyle = 'rgba(50, 150, 50, 0.25)'; // Light green for left leg
      ctx.fill();
      
      // Right leg - orange tint
      ctx.beginPath();
      ctx.moveTo(torsoPoints[2].x, torsoPoints[2].y); // Right hip
      ctx.lineTo(landmarks[26].x * videoDisplayWidth + xOffset, landmarks[26].y * videoDisplayHeight + yOffset); // Right knee
      ctx.lineTo(landmarks[28].x * videoDisplayWidth + xOffset, landmarks[28].y * videoDisplayHeight + yOffset); // Right ankle
      // Add width to the leg
      ctx.lineTo(landmarks[28].x * videoDisplayWidth + xOffset + 10, landmarks[28].y * videoDisplayHeight + yOffset);
      ctx.lineTo(landmarks[26].x * videoDisplayWidth + xOffset + 10, landmarks[26].y * videoDisplayHeight + yOffset);
      ctx.closePath();
      ctx.fillStyle = 'rgba(200, 100, 0, 0.25)'; // Light orange for right leg
      ctx.fill();
    }
    
    // Add arms silhouettes if visible
    if (landmarks[13] && landmarks[15] && landmarks[14] && landmarks[16] && 
        landmarks[13].visibility > 0.3 && landmarks[15].visibility > 0.3 &&
        landmarks[14].visibility > 0.3 && landmarks[16].visibility > 0.3) {
      
      // Left arm - blue tint
      ctx.beginPath();
      ctx.moveTo(torsoPoints[0].x, torsoPoints[0].y); // Left shoulder
      ctx.lineTo(landmarks[13].x * videoDisplayWidth + xOffset, landmarks[13].y * videoDisplayHeight + yOffset); // Left elbow
      ctx.lineTo(landmarks[15].x * videoDisplayWidth + xOffset, landmarks[15].y * videoDisplayHeight + yOffset); // Left wrist
      // Add width to the arm
      ctx.lineTo(landmarks[15].x * videoDisplayWidth + xOffset - 5, landmarks[15].y * videoDisplayHeight + yOffset + 5);
      ctx.lineTo(landmarks[13].x * videoDisplayWidth + xOffset - 5, landmarks[13].y * videoDisplayHeight + yOffset + 5);
      ctx.closePath();
      ctx.fillStyle = 'rgba(50, 50, 200, 0.25)'; // Light blue for left arm
      ctx.fill();
      
      // Right arm - purple tint
      ctx.beginPath();
      ctx.moveTo(torsoPoints[1].x, torsoPoints[1].y); // Right shoulder
      ctx.lineTo(landmarks[14].x * videoDisplayWidth + xOffset, landmarks[14].y * videoDisplayHeight + yOffset); // Right elbow
      ctx.lineTo(landmarks[16].x * videoDisplayWidth + xOffset, landmarks[16].y * videoDisplayHeight + yOffset); // Right wrist
      // Add width to the arm
      ctx.lineTo(landmarks[16].x * videoDisplayWidth + xOffset + 5, landmarks[16].y * videoDisplayHeight + yOffset + 5);
      ctx.lineTo(landmarks[14].x * videoDisplayWidth + xOffset + 5, landmarks[14].y * videoDisplayHeight + yOffset + 5);
      ctx.closePath();
      ctx.fillStyle = 'rgba(150, 50, 200, 0.25)'; // Light purple for right arm
      ctx.fill();
    }
  }

  // Draw the skeleton connections with glow effect
  mainConnections.forEach(([i, j]) => {
    const start = landmarks[i];
    const end = landmarks[j];

    if (start && end && start.visibility > 0.3 && end.visibility > 0.3) {
      // Convert normalized coordinates to pixel coordinates
      const startX = start.x * videoDisplayWidth + xOffset;
      const startY = start.y * videoDisplayHeight + yOffset;
      const endX = end.x * videoDisplayWidth + xOffset;
      const endY = end.y * videoDisplayHeight + yOffset;
      
      // First draw a wider glow effect
      ctx.beginPath();
      ctx.lineWidth = lineWidth * 2.5;
      let glowColor;
      
      // Color based on body part
      if ((i === 11 && j === 12) || (i === 23 && j === 24) || (i === 11 && j === 23) || (i === 12 && j === 24)) {
        glowColor = 'rgba(255, 0, 0, 0.3)'; // Red glow for torso
      } else if ((i === 11 && j === 13) || (i === 13 && j === 15) || (i === 12 && j === 14) || (i === 14 && j === 16)) {
        glowColor = 'rgba(255, 255, 255, 0.3)'; // White glow for arms
      } else {
        glowColor = 'rgba(0, 255, 0, 0.3)'; // Green glow for legs
      }
      
      ctx.strokeStyle = glowColor;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Then draw the main line
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      
      // Color based on body part
      if ((i === 11 && j === 12) || (i === 23 && j === 24) || (i === 11 && j === 23) || (i === 12 && j === 24)) {
        ctx.strokeStyle = colors.torso;
      } else if ((i === 11 && j === 13) || (i === 13 && j === 15) || (i === 12 && j === 14) || (i === 14 && j === 16)) {
        ctx.strokeStyle = colors.arms;
      } else {
        ctx.strokeStyle = colors.legs;
      }
      
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  });

  // Draw the joint points with glow effect
  keyPoints.forEach(index => {
    const point = landmarks[index];
    if (point && point.visibility > 0.3) {
      const x = point.x * videoDisplayWidth + xOffset;
      const y = point.y * videoDisplayHeight + yOffset;
      
      // Draw outer glow
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.arc(x, y, jointRadius * 1.5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw inner point
      ctx.beginPath();
      
      // Color based on body part
      let fillColor;
      if (index === 11 || index === 12 || index === 23 || index === 24) {
        fillColor = 'rgba(255, 70, 70, 1)'; // Red for torso joints
      } else if (index === 13 || index === 14 || index === 15 || index === 16) {
        fillColor = 'rgba(255, 255, 255, 1)'; // White for arm joints
      } else {
        fillColor = 'rgba(70, 255, 70, 1)'; // Green for leg joints
      }
      
      ctx.fillStyle = fillColor;
      ctx.arc(x, y, jointRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add highlight to give 3D effect
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
     // lib/utils/poseDrawing.ts (continued)
     ctx.arc(x - jointRadius/3, y - jointRadius/3, jointRadius/3, 0, 2 * Math.PI);
     ctx.fill();
   }
 });

 // Process and show feedback with enhanced visuals
 const currentTime = Date.now();
 const recentFeedback = feedback.filter(item => currentTime - item.timestamp < 2000);
 
 recentFeedback.forEach(item => {
   if (item.type === 'error' && item.keypoints && item.keypoints.length >= 3) {
     // Explicitly cast keypoints to Landmark[] to avoid type issues
     const keypoints = item.keypoints as unknown as Landmark[];
     const [start, mid, end] = keypoints;
     
     if (start && mid && end && 
         start.visibility > 0.3 && 
         mid.visibility > 0.3 && 
         end.visibility > 0.3) {
       
       const feedbackAge = currentTime - item.timestamp;
       const fadeOutStart = 1500;
       const fadeOutDuration = 500;
       
       let opacity = 1;
       if (feedbackAge > fadeOutStart) {
         opacity = Math.max(0, 1 - (feedbackAge - fadeOutStart) / fadeOutDuration);
       }
       
       // Draw feedback line with glow effect
       const startX = start.x * videoDisplayWidth + xOffset;
       const startY = start.y * videoDisplayHeight + yOffset;
       const midX = mid.x * videoDisplayWidth + xOffset;
       const midY = mid.y * videoDisplayHeight + yOffset;
       const endX = end.x * videoDisplayWidth + xOffset;
       const endY = end.y * videoDisplayHeight + yOffset;
       
       // Draw glow
       ctx.beginPath();
       ctx.lineWidth = lineWidth * 3;
       ctx.strokeStyle = `rgba(255, 0, 0, ${opacity * 0.3})`;
       ctx.moveTo(startX, startY);
       ctx.lineTo(midX, midY);
       ctx.lineTo(endX, endY);
       ctx.stroke();
       
       // Draw main line
       ctx.beginPath();
       ctx.lineWidth = lineWidth * 1.5;
       ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
       ctx.moveTo(startX, startY);
       ctx.lineTo(midX, midY);
       ctx.lineTo(endX, endY);
       ctx.stroke();
       
       // Draw feedback points with pulsing effect
       const pulseSize = 1 + 0.3 * Math.sin(Date.now() / 150); // More pronounced pulsing
       
       [start, mid, end].forEach((point) => {
         const x = point.x * videoDisplayWidth + xOffset;
         const y = point.y * videoDisplayHeight + yOffset;
         
         // Draw outer glow
         ctx.beginPath();
         ctx.fillStyle = `rgba(255, 0, 0, ${opacity * 0.3})`;
         ctx.arc(x, y, jointRadius * 2 * pulseSize, 0, 2 * Math.PI);
         ctx.fill();
         
         // Draw inner point
         ctx.beginPath();
         ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
         ctx.arc(x, y, jointRadius * 1.2 * pulseSize, 0, 2 * Math.PI);
         ctx.fill();
         
         // Add white highlight to give 3D effect
         ctx.beginPath();
         ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
         ctx.arc(x - jointRadius/2, y - jointRadius/2, jointRadius/2, 0, 2 * Math.PI);
         ctx.fill();
       });
     }
   }
 });

 return true;
};