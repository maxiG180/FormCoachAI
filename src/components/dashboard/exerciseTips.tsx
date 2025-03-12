import React from "react";
import { Dumbbell, Target } from "lucide-react";
import { ExerciseName } from "@/lib/types/exercise";

interface ExerciseTipsProps {
  exercise: ExerciseName;
}

const ExerciseTips: React.FC<ExerciseTipsProps> = ({ exercise }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 ">
      <h3 className="text-xl font-bold text-white mb-4">Tips for {exercise}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-[#FF6500] mb-3">
            Form Improvements
          </h4>
          <ul className="space-y-3">
            {exercise === "Squats" && (
              <>
                <li className="flex items-start">
                  <Target className="text-[#FF6500] mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                  <span className="text-gray-300">
                    Focus on knee alignment - keep knees tracking over toes
                  </span>
                </li>
                <li className="flex items-start">
                  <Target className="text-[#FF6500] mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                  <span className="text-gray-300">
                    Work on hitting consistent depth with each rep
                  </span>
                </li>
              </>
            )}
            {exercise === "Bench Press" && (
              <>
                <li className="flex items-start">
                  <Target className="text-[#FF6500] mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                  <span className="text-gray-300">
                    Improve elbow position - keep elbows at 45° angle
                  </span>
                </li>
                <li className="flex items-start">
                  <Target className="text-[#FF6500] mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                  <span className="text-gray-300">
                    Keep bar path consistent through each rep
                  </span>
                </li>
              </>
            )}
            {exercise === "Deadlifts" && (
              <>
                <li className="flex items-start">
                  <Target className="text-[#FF6500] mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                  <span className="text-gray-300">
                    Work on shoulder alignment during the pull
                  </span>
                </li>
                <li className="flex items-start">
                  <Target className="text-[#FF6500] mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                  <span className="text-gray-300">
                    Focus on hip hinge movement pattern
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[#FF6500] mb-3">Next Steps</h4>
          <ul className="space-y-3">
            <li className="flex items-start">
              <Dumbbell className="text-[#FF6500] mr-2 mt-1 h-4 w-4 flex-shrink-0" />
              <span className="text-gray-300">
                Try recording from a side angle for better depth analysis
              </span>
            </li>
            <li className="flex items-start">
              <Dumbbell className="text-[#FF6500] mr-2 mt-1 h-4 w-4 flex-shrink-0" />
              <span className="text-gray-300">
                Focus on consistency and form before increasing weight
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <button className="bg-[#FF6500]/10 hover:bg-[#FF6500]/20 text-[#FF6500] px-4 py-2 rounded-lg transition-colors ">
          Analyze New Workout
        </button>
      </div>
    </div>
  );
};

export default ExerciseTips;
