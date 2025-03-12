"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import Link from "next/link";
import { Calendar, Settings } from "lucide-react";

// Import components
import StatsCards from "@/components/dashboard/statsCards";
import ExerciseSelector from "@/components/dashboard/exerciseSelector";
import ProgressChart from "@/components/dashboard/progressChart";
import FormAnalysis from "@/components/dashboard/formAnalysis";
import ExerciseTips from "@/components/dashboard/exerciseTips";
import RecentWorkouts from "@/components/dashboard/recentWorkouts";

// Import data and types
import { exerciseStats, recentWorkouts } from "@/data/mockExerciseData";
import type { ExerciseName } from "@/lib/types/exercise";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseName>("Squats");

  return (
    <main className="min-h-screen pt-20 pb-12 px-4 bg-black">
      <div className="container mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome,{" "}
              <span className="text-[#FF6500]">
                {user?.displayName || user?.email?.split("@")[0] || "Athlete"}
              </span>
              !
            </h1>
            <p className="text-gray-400 mt-2">
              Track your progress and improve your form
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            <button className="flex items-center gap-2 bg-[#FF6500]/10 hover:bg-[#FF6500]/20 text-[#FF6500] px-4 py-2 rounded-lg transition-colors cursor-pointer">
              <Calendar size={18} />
              Last 30 Days
            </button>
            <Link href="/profile">
              <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
                <Settings size={18} />
                Settings
              </button>
            </Link>
          </div>
        </div>

        {/* Overview Cards */}
        <StatsCards />

        {/* Exercise Selector */}
        <ExerciseSelector
          selectedExercise={selectedExercise}
          onSelectExercise={setSelectedExercise}
        />

        {/* Selected Exercise Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ProgressChart
            exercise={selectedExercise}
            data={exerciseStats[selectedExercise]}
          />
          <FormAnalysis
            exercise={selectedExercise}
            formData={exerciseStats[selectedExercise].form}
          />
        </div>

        {/* Tips and Suggestions */}
        <ExerciseTips exercise={selectedExercise} />

        {/* Recent Workouts */}
        <RecentWorkouts workouts={recentWorkouts} />
      </div>
    </main>
  );
}
