import React from "react";
import { SimpleChart } from "./ui/chartComponents";
import { ExerciseData, ExerciseName } from "@/lib/types/exercise";

interface ProgressChartProps {
  exercise: ExerciseName;
  data: ExerciseData;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ exercise, data }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Progress Over Time</h3>
        <div className="text-[#FF6500] text-sm font-medium">{exercise}</div>
      </div>

      <SimpleChart data={data.history} />

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-3 ">
          <p className="text-gray-400 text-xs">Best Score</p>
          <p className="text-xl font-bold text-[#FF6500]">{data.bestScore}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 ">
          <p className="text-gray-400 text-xs">Latest Score</p>
          <p className="text-xl font-bold text-white">
            {data.history[data.history.length - 1].score}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
