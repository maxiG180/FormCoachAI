// src/components/analyze/uploadSection.tsx
"use client";

import { ChangeEvent, useRef, useState, useEffect, useCallback } from "react";

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  hasFile: boolean;
  isExerciseSelected: boolean;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const UploadSection = ({
  onFileSelect,
  onAnalyze,
  isAnalyzing,
  hasFile,
  isExerciseSelected,
}: UploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState("Analyze Workout");
  const [buttonClicked, setButtonClicked] = useState(false);

  const cleanupPreviewUrl = useCallback(() => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(null);
    }
  }, [videoPreviewUrl]);

  // Update selected file when hasFile prop changes (external reset)
  useEffect(() => {
    if (!hasFile && selectedFile) {
      setSelectedFile(null);
      cleanupPreviewUrl();
    }
  }, [hasFile, cleanupPreviewUrl, selectedFile]);

  // Reset button state when analyzing state changes
  useEffect(() => {
    if (isAnalyzing) {
      setButtonText("Analyzing...");
      setButtonClicked(true);
    } else {
      setButtonText("Analyze Workout");
      setButtonClicked(false);
    }
  }, [isAnalyzing, cleanupPreviewUrl]);

  const validateFile = (file: File) => {
    if (!isExerciseSelected) {
      setError("Please select an exercise before uploading a video.");
      return false;
    }
    if (!file.type.startsWith("video/")) {
      setError("Invalid file type. Please upload a video.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 50MB limit.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      // Create a preview URL for the video
      cleanupPreviewUrl(); // Clean up previous URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(previewUrl);
      onFileSelect(file);
    }

    // Reset the input value to allow selecting the same file again
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      // Create a preview URL for the video
      cleanupPreviewUrl(); // Clean up previous URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(previewUrl);
      onFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    if (!isExerciseSelected) {
      setError("Please select an exercise before uploading a video.");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleAnalyzeClick = () => {
    setButtonClicked(true);
    onAnalyze();
  };

  // Clean up object URL when component unmounts or when preview changes
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupPreviewUrl();
    };
  }, [cleanupPreviewUrl]);

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
          isDragging
            ? "border-[#FF6500] bg-[#FF6500]/10 shadow-[0_0_20px_rgba(255,101,0,0.2)]"
            : hasFile
            ? "border-[#FF6500] bg-[#FF6500]/5"
            : "border-[#FF6500]/30 hover:border-[#FF6500]/60 hover:bg-[#FF6500]/5"
        } relative overflow-hidden ${
          hasFile ? "cursor-default" : "cursor-pointer"
        }`}
        onDragOver={isExerciseSelected && !hasFile ? handleDragOver : undefined}
        onDragLeave={
          isExerciseSelected && !hasFile ? handleDragLeave : undefined
        }
        onDrop={isExerciseSelected && !hasFile ? handleDrop : undefined}
        onClick={!hasFile ? handleUploadClick : undefined}
      >
        {/* Animated background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-[#FF6500]/10 to-transparent transition-opacity duration-500 ${
            isDragging || hasFile ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept="video/*"
          className="hidden"
          disabled={!isExerciseSelected}
        />

        {hasFile && selectedFile ? (
          <div className="relative z-10 py-2">
            {videoPreviewUrl ? (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-lg shadow-lg mx-auto max-w-xs">
                  <video
                    ref={videoRef}
                    src={videoPreviewUrl}
                    className="w-full object-cover max-h-40"
                    controls
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        // Set a poster frame by seeking a bit into the video
                        videoRef.current.currentTime = 0.5;
                      }
                    }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-white text-lg truncate max-w-xs mx-auto">
                    {selectedFile.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  onClick={handleUploadClick}
                  className="text-[#FF6500] hover:text-[#FF6500]/80 text-sm flex items-center justify-center mx-auto mt-2"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Change video
                </button>
              </div>
            ) : (
              <div className="py-4">
                <div className="mb-3 bg-[#FF6500]/20 p-3 rounded-full inline-flex">
                  <svg
                    className="w-6 h-6 text-[#FF6500]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-white text-lg truncate max-w-xs mx-auto">
                  {selectedFile.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {formatFileSize(selectedFile.size)}
                </p>
                <button
                  onClick={handleUploadClick}
                  className="text-[#FF6500] hover:text-[#FF6500]/80 text-sm flex items-center justify-center mx-auto mt-2"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Change video
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-[#FF6500]/20 flex items-center justify-center mx-auto mb-4 relative z-10">
              <svg
                className="w-8 h-8 text-[#FF6500]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>

            <span className="text-white font-medium text-lg block relative z-10">
              Upload Or Drag your workout video
            </span>
            <span className="text-sm text-gray-400 mt-2 block relative z-10">
              MP4, MOV up to 50MB
            </span>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 animate-fade-in">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleAnalyzeClick}
        disabled={!hasFile || isAnalyzing || buttonClicked}
        className={`w-full py-4 rounded-lg text-white font-medium transition-all duration-300 ${
          hasFile && !isAnalyzing && !buttonClicked
            ? "bg-[#FF6500] cursor-pointer hover:bg-[#FF6500]/90 shadow-[0_0_15px_rgba(255,101,0,0.3)]"
            : buttonClicked || isAnalyzing
            ? "bg-[#FF6500]/70 cursor-wait"
            : "bg-gray-700/50 cursor-not-allowed"
        }`}
      >
        {isAnalyzing ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Analyzing...
          </div>
        ) : buttonClicked ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </div>
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
};

export default UploadSection;
