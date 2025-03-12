import React from "react";
import { FormRadar, ProgressBar } from "./ui/chartComponents";
import { ExerciseFormMetrics, ExerciseName } from "@/lib/types/exercise";
import { getAreasToImprove } from "@/data/mockExerciseData";

interface FormAnalysisProps {
  exercise: ExerciseName;
  formData: ExerciseFormMetrics;
}

const FormAnalysis: React.FC<FormAnalysisProps> = ({ exercise, formData }) => {
  const areasToImprove = getAreasToImprove(exercise);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Form Analysis</h3>
        <div className="text-[#FF6500] text-sm font-medium">{exercise}</div>
      </div>

      <FormRadar formData={formData} />

      <div className="mt-4">
        <h4 className="font-semibold text-white mb-2">Areas to Improve</h4>
        {areasToImprove.map((area, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-gray-300 text-sm">{area.name}</span>
              <span className="text-white text-sm font-medium">
                {area.value}%
              </span>
            </div>
            <ProgressBar value={area.value} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormAnalysis;
