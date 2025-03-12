import React from "react";
import { formatDate } from "@/data/mockExerciseData";
import { ExerciseHistory, ExerciseFormMetrics } from "@/lib/types/exercise";

// Progress visualization component
export const ProgressBar: React.FC<{
  value: number;
  maxValue?: number;
}> = ({ value, maxValue = 100 }) => {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="w-full bg-gray-800 rounded-full h-2.5">
      <div
        className="bg-[#FF6500] h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// Simple chart component to visualize progress
export const SimpleChart: React.FC<{
  data: ExerciseHistory[];
  height?: number;
}> = ({ data, height = 100 }) => {
  // Get min and max for scaling
  const scores = data.map((item) => item.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const range = maxScore - minScore;

  return (
    <div className="flex items-end h-40 gap-1 mt-4">
      {data.map((item, index) => {
        // Scale the height between 10% and 100%
        const scaledHeight =
          range === 0 ? 100 : 10 + ((item.score - minScore) / range) * 90;

        return (
          <div key={index} className="flex flex-col items-center flex-1 ">
            <div
              className="w-full bg-[#FF6500] rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
              style={{ height: `${scaledHeight}%` }}
              title={`${item.score}%`}
            ></div>
            <div className="text-xs text-gray-400 mt-1 truncate w-full text-center">
              {formatDate(item.date)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Form radar chart approximation
export const FormRadar: React.FC<{
  formData: ExerciseFormMetrics;
}> = ({ formData }) => {
  const categories = Object.keys(formData);
  const values = Object.values(formData);

  // Create points for each category in a radar shape
  const points = categories.map((_, index) => {
    const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
    const value = values[index] / 100; // Normalize to 0-1
    const x = 100 + value * 80 * Math.cos(angle);
    const y = 100 + value * 80 * Math.sin(angle);
    return `${x},${y}`;
  });

  return (
    <div className="w-full h-64 flex justify-center items-center mt-4">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Background grid circles */}
        {[0.25, 0.5, 0.75, 1].map((radius, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={radius * 80}
            fill="none"
            stroke="#2D3748"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        ))}

        {/* Category lines */}
        {categories.map((_, index) => {
          const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
          const x = 100 + 80 * Math.cos(angle);
          const y = 100 + 80 * Math.sin(angle);
          return (
            <line
              key={index}
              x1="100"
              y1="100"
              x2={x}
              y2={y}
              stroke="#2D3748"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={points.join(" ")}
          fill="#FF6500"
          fillOpacity="0.4"
          stroke="#FF6500"
          strokeWidth="2"
        />

        {/* Data points */}
        {points.map((point, index) => {
          const [x, y] = point.split(",").map(Number);
          return <circle key={index} cx={x} cy={y} r="3" fill="#FF6500" />;
        })}

        {/* Category labels */}
        {categories.map((category, index) => {
          const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
          const labelRadius = 0.95;
          const x = 100 + (80 + 20) * labelRadius * Math.cos(angle);
          const y = 100 + (80 + 20) * labelRadius * Math.sin(angle);

          // Format the category name
          const formattedCategory = category
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#718096"
              fontSize="8"
              className="select-none"
            >
              {formattedCategory}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
