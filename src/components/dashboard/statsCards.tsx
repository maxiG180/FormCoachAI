import React from "react";
import { ArrowUp, Award, Dumbbell, Flame } from "lucide-react";

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#FF6500]/30 transition-colors ">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm">Total Workouts</p>
            <h3 className="text-2xl font-bold text-white mt-1">32</h3>
          </div>
          <div className="bg-[#FF6500]/20 p-2 rounded-lg">
            <Dumbbell size={24} className="text-[#FF6500]" />
          </div>
        </div>
        <div className="flex items-center mt-4 text-green-500 text-sm">
          <ArrowUp size={16} />
          <span className="ml-1">12% from last month</span>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#FF6500]/30 transition-colors">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm">Avg. Form Score</p>
            <h3 className="text-2xl font-bold text-white mt-1">82.4</h3>
          </div>
          <div className="bg-[#FF6500]/20 p-2 rounded-lg">
            <Award size={24} className="text-[#FF6500]" />
          </div>
        </div>
        <div className="flex items-center mt-4 text-green-500 text-sm">
          <ArrowUp size={16} />
          <span className="ml-1">5.7% from last month</span>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#FF6500]/30 transition-colors ">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm">Total Reps</p>
            <h3 className="text-2xl font-bold text-white mt-1">734</h3>
          </div>
          <div className="bg-[#FF6500]/20 p-2 rounded-lg">
            <Flame size={24} className="text-[#FF6500]" />
          </div>
        </div>
        <div className="flex items-center mt-4 text-green-500 text-sm">
          <ArrowUp size={16} />
          <span className="ml-1">18.3% from last month</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
