import { ChangeEvent, useRef, useState } from "react";
import ExerciseSelector from "./ExerciseSelector";

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  hasFile: boolean;
  onExerciseSelect: (exercise: string) => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const UploadSection = ({
  onFileSelect,
  onAnalyze,
  isAnalyzing,
  hasFile,
  onExerciseSelect,
}: UploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExerciseSelected, setIsExerciseSelected] = useState(false);

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
      onFileSelect(file);
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

  return (
    <div className="space-y-6">
      <ExerciseSelector
        onExerciseSelect={onExerciseSelect}
        onValidityChange={setIsExerciseSelected}
      />

      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
          !isExerciseSelected
            ? "border-gray-600 opacity-50 cursor-not-allowed"
            : isDragging
              ? "border-brand-primary bg-gray-800 cursor-pointer"
              : "border-gray-600 cursor-pointer"
        }`}
        onDragOver={isExerciseSelected ? handleDragOver : undefined}
        onDragLeave={isExerciseSelected ? handleDragLeave : undefined}
        onDrop={isExerciseSelected ? handleDrop : undefined}
        onClick={handleUploadClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept="video/*"
          className="hidden"
          disabled={!isExerciseSelected}
        />
        <div
          className={`w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center mx-auto ${
            !isExerciseSelected ? "opacity-50" : ""
          }`}
        >
          <svg
            className="w-8 h-8 text-brand-primary"
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
        <span className="text-gray-300 block">
          {isExerciseSelected
            ? "Upload Or Drag your workout video"
            : "Select an exercise before uploading"}
        </span>
        <span className="text-sm text-gray-500">MP4, MOV up to 50MB</span>
      </div>

      {error && <p className="text-red-500 text-sm animate-fade-in">{error}</p>}

      <button
        onClick={onAnalyze}
        disabled={!hasFile || isAnalyzing || !isExerciseSelected}
        className={`w-full py-3 rounded-lg text-white transition-colors ${
          hasFile && !isAnalyzing && isExerciseSelected
            ? "bg-brand-primary hover:bg-brand-primary/90"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Workout"}
      </button>
    </div>
  );
};

export default UploadSection;
