import React from "react";
import Image from "next/image";
import { exerciseStats, formatDate } from "@/data/mockExerciseData";
import { ExerciseName } from "@/lib/types/exercise";

// Import images
import benchImg from "@/../public/img/bench.png";
import squatImg from "@/../public/img/squat.png";
import deadliftImg from "@/../public/img/deadlift.png";

interface ExerciseSelectorProps {
  selectedExercise: ExerciseName;
  onSelectExercise: (exercise: ExerciseName) => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  selectedExercise,
  onSelectExercise,
}) => {
  // Define the exercise images with proper typing
  const exerciseImages: Record<ExerciseName, any> = {
    "Bench Press": benchImg,
    Squats: squatImg,
    Deadlifts: deadliftImg,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {(Object.keys(exerciseStats) as ExerciseName[]).map((exercise) => (
        <button
          key={exercise}
          onClick={() => onSelectExercise(exercise)}
          className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 h-48 cursor-pointer ${
            selectedExercise === exercise
              ? "border-[#FF6500] shadow-[0_0_15px_rgba(255,101,0,0.3)]"
              : "border-[#FF6500]/30 hover:border-[#FF6500]/60"
          }`}
        >
          {/* Background glow effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 transition-opacity duration-500 z-10`}
          ></div>

          {/* Image */}
          <div className="absolute inset-0">
            <Image
              src={exerciseImages[exercise]}
              alt={exercise}
              className={`object-cover w-full h-full transition-transform duration-700 ${
                selectedExercise === exercise ? "scale-110" : "hover:scale-105"
              }`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>

          {/* Content overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-4">
            <div>
              <h3
                className={`text-xl font-bold transition-colors duration-300 ${
                  selectedExercise === exercise
                    ? "text-[#FF6500]"
                    : "text-white"
                }`}
              >
                {exercise}
              </h3>
              <div className="flex items-center mt-1 text-sm">
                <span className="text-gray-300">Best: </span>
                <span className="ml-2 text-white font-medium">
                  {exerciseStats[exercise].bestScore}
                </span>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-400">Total Reps</p>
                  <p className="text-white font-medium">
                    {exerciseStats[exercise].totalReps}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Last Active</p>
                  <p className="text-white font-medium">
                    {formatDate(exerciseStats[exercise].lastPerformed)}
                  </p>
                </div>
              </div>
            </div>

            {/* Selection indicator */}
            {selectedExercise === exercise && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#FF6500] flex items-center justify-center">
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
          </div>
        </button>
      ))}
    </div>
  );
};

export default ExerciseSelector;
