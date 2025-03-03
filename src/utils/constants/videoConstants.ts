// File: utils/constants/videoConstants.ts

export const VIDEO_VALIDATION = {
    MIN_RESOLUTION: {
      WIDTH: 320,
      HEIGHT: 240
    },
    ASPECT_RATIO: {
      MIN: 0.5,  // Portrait videos
      MAX: 2.0   // Landscape videos
    },
    MAX_DURATION: 300, // 5 minutes in seconds
    MIN_DURATION: 3,   // 3 seconds
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    SUPPORTED_FORMATS: ['video/mp4', 'video/webm', 'video/quicktime'],
    TRACKING: {
      LOSS_THRESHOLD: 3,
      MIN_LANDMARK_CONFIDENCE: 0.7
    }
  };
  
  export const RECORDING_GUIDELINES = {
    Squats: {
      title: "How to Record Squat Video",
      guidelines: [
        {
          text: "Record from a side view (90 degrees)",
          importance: "critical",
          reason: "Enables accurate tracking of hip and knee angles"
        },
        {
          text: "Ensure your full body is visible",
          importance: "critical",
          reason: "All joints must be tracked for accurate form analysis"
        },
        {
          text: "Record in a well-lit area",
          importance: "high",
          reason: "Good lighting improves pose detection accuracy"
        },
        {
          text: "Wear fitted clothing",
          importance: "medium",
          reason: "Loose clothing can interfere with joint tracking"
        },
        {
          text: "Keep the camera stable",
          importance: "high",
          reason: "Camera movement can affect tracking quality"
        },
        {
          text: "Record at 1-2 meters distance",
          importance: "medium",
          reason: "Optimal distance for full-body tracking"
        },
        {
          text: "Ensure clear background",
          importance: "medium",
          reason: "Moving objects can interfere with tracking"
        }
      ],
      setup: {
        distance: "1-2 meters",
        angle: "90 degrees (side view)",
        lighting: "Well-lit, avoid backlighting",
        background: "Clear, solid color if possible"
      }
    }
  };