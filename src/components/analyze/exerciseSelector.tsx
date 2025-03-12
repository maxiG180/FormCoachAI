"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// Import the images directly
import benchImg from "@/../public/img/bench.png";
import squatImg from "@/../public/img/squat.png";
import deadliftImg from "@/../public/img/deadlift.png";

interface ExerciseSelectorProps {
  onExerciseSelect: (exercise: string) => void;
  onValidityChange: (isValid: boolean) => void;
  selectedExercise: string;
}

const ExerciseSelector = ({
  onExerciseSelect,
  onValidityChange,
  selectedExercise,
}: ExerciseSelectorProps) => {
  const exercises = [
    {
      name: "Bench Press",
      description: "Build upper body strength",
      imageUrl: benchImg,
    },
    {
      name: "Squats",
      description: "Develop lower body power",
      imageUrl: squatImg,
    },
    {
      name: "Deadlifts",
      description: "Full body compound movement",
      imageUrl: deadliftImg,
    },
  ];

  const handleSelect = (exercise: string) => {
    onExerciseSelect(exercise);
    onValidityChange(!!exercise);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
        Select Your Exercise
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <button
            key={exercise.name}
            onClick={() => handleSelect(exercise.name)}
            className={`flex flex-col items-center overflow-hidden rounded-xl border-2 transition-all duration-300 ${
              selectedExercise === exercise.name
                ? "border-[#FF6500] bg-[#FF6500]/10 shadow-[0_0_15px_rgba(255,101,0,0.3)] cursor-default"
                : "border-[#FF6500]/30 bg-black/20 hover:border-[#FF6500]/60 hover:bg-[#FF6500]/5 cursor-pointer"
            } relative group transform ${
              selectedExercise === exercise.name
                ? "scale-[1.02]"
                : "scale-100 hover:scale-[1.01]"
            }`}
          >
            {/* Background glow effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-b from-[#FF6500]/20 to-transparent transition-opacity duration-500 ${
                selectedExercise === exercise.name
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-50"
              }`}
            ></div>

            {/* Image container */}
            <div className="relative w-full aspect-square overflow-hidden">
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              <Image
                src={exercise.imageUrl}
                alt={exercise.name}
                className={`object-cover w-full h-full transition-transform duration-700 ${
                  selectedExercise === exercise.name
                    ? "scale-110"
                    : "group-hover:scale-105"
                }`}
                width={400}
                height={400}
                priority
              />
            </div>

            {/* Text content */}
            <div className="text-center p-4 w-full relative z-10 bg-black/60">
              <h3
                className={`text-xl font-bold mb-1 transition-colors duration-300 ${
                  selectedExercise === exercise.name
                    ? "text-[#FF6500]"
                    : "text-white group-hover:text-[#FF6500]/80"
                }`}
              >
                {exercise.name}
              </h3>
              <p className="text-sm opacity-80 text-gray-300">
                {exercise.description}
              </p>
            </div>

            {/* Selection indicator */}
            {selectedExercise === exercise.name && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#FF6500] flex items-center justify-center z-20 animate-pulse">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 13L9 17L19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {!selectedExercise && (
        <p className="text-sm sm:text-base text-[#FF6500] text-center font-medium">
          Please select an exercise to continue
        </p>
      )}
    </div>
  );
};

export default ExerciseSelector;
