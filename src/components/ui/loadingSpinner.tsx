"use client";

import React from "react";
import { motion } from "framer-motion";

type SpinnerSize = "small" | "medium" | "large";
type SpinnerVariant = "primary" | "white";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  variant = "primary",
  text = "Loading...",
  fullScreen = false,
}) => {
  // Size mappings
  const sizesMap = {
    small: {
      container: "w-6 h-6",
      circle: "w-6 h-6 border-2",
      textClass: "text-sm mt-2",
    },
    medium: {
      container: "w-12 h-12",
      circle: "w-12 h-12 border-3",
      textClass: "text-base mt-3",
    },
    large: {
      container: "w-16 h-16",
      circle: "w-16 h-16 border-4",
      textClass: "text-lg mt-4",
    },
  };

  // Color mappings
  const colorMap = {
    primary: {
      circle: "border-[#FF6500]/20 border-t-[#FF6500]",
      text: "text-[#FF6500]",
    },
    white: {
      circle: "border-white/20 border-t-white",
      text: "text-white",
    },
  };

  const currentSize = sizesMap[size];
  const colors = colorMap[variant];

  const containerClass = fullScreen
    ? "fixed inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center";

  return (
    <div className={containerClass}>
      <div className="relative flex justify-center items-center">
        <motion.div
          className={`${currentSize.circle} ${colors.circle} rounded-full animate-spin border-solid`}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />

        {/* Optional decorative elements */}
        <motion.div
          className={`absolute inset-0 ${colors.circle} rounded-full opacity-20`}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            repeatType: "reverse",
          }}
        />
      </div>

      {text && (
        <p className={`${currentSize.textClass} ${colors.text} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
