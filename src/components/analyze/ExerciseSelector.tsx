import { useState } from "react";
import benchImg from "@/img/bench.png";
import squatImg from "@/img/squat.png";
import deadliftImg from "@/img/deadlift.png";

interface ExerciseSelectorProps {
  onExerciseSelect: (exercise: string) => void;
  onValidityChange: (isValid: boolean) => void;
}

const ExerciseSelector = ({
  onExerciseSelect,
  onValidityChange,
}: ExerciseSelectorProps) => {
  const [selectedExercise, setSelectedExercise] = useState("");

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
    setSelectedExercise(exercise);
    onExerciseSelect(exercise);
    onValidityChange(!!exercise);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-200 text-center">
        Select Your Exercise
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {exercises.map((exercise) => (
          <button
            key={exercise.name}
            onClick={() => handleSelect(exercise.name)}
            className={`flex flex-col items-center p-4 sm:p-6 rounded-lg transition-all duration-300 ${
              selectedExercise === exercise.name
                ? "bg-brand-primary text-white ring-2 ring-brand-accent"
                : "bg-secondary hover:bg-gray-700 text-gray-300"
            }`}
          >
            <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg bg-black shadow-md">
              <img
                src={exercise.imageUrl}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                {exercise.name}
              </h3>
              <p className="text-sm sm:text-base opacity-80">
                {exercise.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {!selectedExercise && (
        <p className="text-sm sm:text-base text-amber-400 text-center">
          Please select an exercise before uploading a video
        </p>
      )}
    </div>
  );
};

export default ExerciseSelector;
