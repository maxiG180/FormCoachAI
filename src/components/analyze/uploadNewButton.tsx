// src/components/analyze/uploadNewButton.tsx
import { FolderUp } from "lucide-react";

interface UploadButtonProps {
  onUploadNew: () => void;
  className?: string;
}

// A specialized button component for the video upload functionality
const UploadNewButton = ({
  onUploadNew,
  className = "",
}: UploadButtonProps) => {
  return (
    <button
      onClick={onUploadNew}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium 
        bg-white/10 hover:bg-white/20 text-white transition-colors ${className}`}
    >
      <FolderUp className="w-5 h-5" />
      <span>Upload New Video</span>
    </button>
  );
};

export default UploadNewButton;
