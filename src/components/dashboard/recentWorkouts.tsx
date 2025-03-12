import React from "react";
import Link from "next/link";
import { formatDate } from "@/data/mockExerciseData";
import { Workout } from "@/lib/types/exercise";

interface RecentWorkoutsProps {
  workouts: Workout[];
}

const RecentWorkouts: React.FC<RecentWorkoutsProps> = ({ workouts }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 ">
      <h3 className="text-xl font-bold text-white mb-6">Recent Workouts</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left pb-3 text-gray-400 font-medium">Date</th>
              <th className="text-left pb-3 text-gray-400 font-medium">
                Exercise
              </th>
              <th className="text-left pb-3 text-gray-400 font-medium">
                Form Score
              </th>
              <th className="text-left pb-3 text-gray-400 font-medium">Reps</th>
              <th className="text-left pb-3 text-gray-400 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout, index) => (
              <tr
                key={index}
                className={
                  index < workouts.length - 1 ? "border-b border-gray-800" : ""
                }
              >
                <td className="py-4 pr-4">{formatDate(workout.date)}</td>
                <td className="py-4 pr-4">{workout.exercise}</td>
                <td className="py-4 pr-4">
                  <div className="flex items-center">
                    <span
                      className={`font-medium ${
                        workout.score >= 90
                          ? "text-green-500"
                          : workout.score >= 80
                          ? "text-[#FF6500]"
                          : workout.score >= 70
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {workout.score}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">/100</span>
                  </div>
                </td>
                <td className="py-4 pr-4">{workout.reps}</td>
                <td className="py-4">
                  <button className="text-[#FF6500] hover:text-[#FF8533] transition-colors cursor-pointer">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <Link href="/workouts">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
            View All Workouts
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RecentWorkouts;
