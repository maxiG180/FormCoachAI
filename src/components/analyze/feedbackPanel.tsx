// src/components/analyze/feedbackPanel.tsx
"use client";

import React, { useState } from "react";
import {
  Star,
  StarHalf,
  Award,
  Target,
  Shield,
  Scale,
  Activity,
  ChevronUp,
  ChevronDown,
  Cpu,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FeedbackPanelProps {
  className?: string;
  isVideoComplete?: boolean;
  feedback?: {
    type: string;
    category: string;
    message: string;
    timestamp: number;
  }[];
  categoryScores?: {
    form: number;
    depth: number;
    alignment: number;
    balance: number;
  };
  overallScore?: number;
  repCount?: number;
  consecutiveGoodReps?: number;
  aiConfidence?: number;
}

const FeedbackPanel = ({
  className = "",
  isVideoComplete = false,
  feedback = [],
  categoryScores = {
    form: 0,
    depth: 0,
    alignment: 0,
    balance: 0,
  },
  overallScore = 0,
  repCount = 0,
  consecutiveGoodReps = 0,
  aiConfidence = 0,
}: FeedbackPanelProps) => {
  // Performance history visibility
  const [showPerformanceHistory, setShowPerformanceHistory] = useState(true);

  // For demo purposes only - if you're in demo mode
  const useDemoData = repCount === 0 && overallScore === 0;

  // Demo data for design purposes - only use these if no real data is provided
  const isAnalyzing = !isVideoComplete;
  const effectiveOverallScore = useDemoData ? 85 : overallScore;
  const effectiveRepCount = useDemoData ? 12 : repCount;
  const effectiveConsecutiveGoodReps = useDemoData ? 8 : consecutiveGoodReps;
  const effectiveAiConfidence = useDemoData ? 92 : aiConfidence;

  // Sample chart data - only use if no real rep history data provided
  const chartData = [
    { name: "Rep 1", score: 75, depth: 85, duration: 2.5 },
    { name: "Rep 2", score: 78, depth: 82, duration: 2.3 },
    { name: "Rep 3", score: 82, depth: 88, duration: 2.4 },
    { name: "Rep 4", score: 85, depth: 90, duration: 2.2 },
    { name: "Rep 5", score: 83, depth: 87, duration: 2.4 },
    { name: "Rep 6", score: 88, depth: 92, duration: 2.3 },
    { name: "Rep 7", score: 90, depth: 95, duration: 2.1 },
    { name: "Rep 8", score: 91, depth: 93, duration: 2.0 },
    { name: "Rep 9", score: 89, depth: 90, duration: 2.2 },
    { name: "Rep 10", score: 87, depth: 88, duration: 2.3 },
    { name: "Rep 11", score: 92, depth: 94, duration: 2.1 },
    { name: "Rep 12", score: 94, depth: 96, duration: 2.0 },
  ];

  // Sample feedback items - only use if no real feedback provided
  const demoFeedbackItems = [
    {
      type: "success",
      category: "form",
      message: "Excellent overall form!",
      timestamp: Date.now() - 15000,
    },
    {
      type: "warning",
      category: "depth",
      message: "Try to squat a bit deeper for better muscle activation",
      timestamp: Date.now() - 45000,
    },
    {
      type: "error",
      category: "alignment",
      message: "Keep your knees in line with your toes",
      timestamp: Date.now() - 90000,
    },
  ];

  const feedbackItems = feedback.length > 0 ? feedback : demoFeedbackItems;

  // Category information with icons and descriptions
  const categoryInfo = {
    form: {
      icon: Shield,
      title: "Overall Form",
      description: "Posture and movement patterns",
      weight: 0.3,
      score: useDemoData ? 88 : categoryScores.form,
    },
    depth: {
      icon: Target,
      title: "Range of Motion",
      description: "Movement depth and completion",
      weight: 0.25,
      score: useDemoData ? 82 : categoryScores.depth,
    },
    alignment: {
      icon: Award,
      title: "Body Alignment",
      description: "Joint and limb positioning",
      weight: 0.25,
      score: useDemoData ? 85 : categoryScores.alignment,
    },
    balance: {
      icon: Scale,
      title: "Balance & Symmetry",
      description: "Even weight distribution",
      weight: 0.2,
      score: useDemoData ? 90 : categoryScores.balance,
    },
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 75) return "text-blue-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Main content with equal height columns */}
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        {/* Performance Overview Card */}
        <div className="bg-brand-secondary/20 rounded-xl p-4 flex-1">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">{isAnalyzing ? "⏳" : "🏆"}</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isAnalyzing
                ? "Analysis in Progress..."
                : "Form Analysis Results"}
            </h2>

            {/* Star Rating - Only show if not analyzing */}
            {!isAnalyzing && (
              <div className="flex justify-center gap-1 mb-3">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <StarHalf className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              </div>
            )}

            {/* Overall Score */}
            <div
              className={`text-3xl font-bold mb-3 ${
                isAnalyzing
                  ? "text-gray-400"
                  : getScoreColor(effectiveOverallScore)
              }`}
            >
              {isAnalyzing ? "Analyzing..." : `${effectiveOverallScore}%`}
            </div>

            {/* AI Confidence Indicator */}
            {effectiveAiConfidence > 0 && !isAnalyzing && (
              <div className="flex items-center justify-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm">
                  AI Confidence: {effectiveAiConfidence}%
                </span>
              </div>
            )}

            {/* Rep Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-brand-primary/10 rounded-lg p-4">
                <Activity className="w-5 h-5 text-brand-primary mx-auto mb-2" />
                <div className="text-sm text-gray-400">Total Reps</div>
                <div className="text-2xl font-bold text-white">
                  {effectiveRepCount}
                </div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4">
                <Award className="w-5 h-5 text-green-400 mx-auto mb-2" />
                <div className="text-sm text-gray-400">Perfect Reps</div>
                <div className="text-2xl font-bold text-green-400">
                  {effectiveConsecutiveGoodReps}
                </div>
              </div>
            </div>

            {/* Category Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(categoryInfo).map(([category, info]) => {
                return (
                  <div key={category} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <info.icon className="w-5 h-5 text-brand-primary" />
                      <h3 className="text-white font-medium">
                        {info.title}
                        <span className="text-xs text-gray-400 ml-1">
                          ({Math.round(info.weight * 100)}%)
                        </span>
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      {info.description}
                    </p>
                    <div className="flex items-end justify-between">
                      <div className="w-full mr-3">
                        {isAnalyzing ? (
                          // Show animated loading progress bar during analysis
                          <div className="h-2 bg-gray-700 rounded overflow-hidden">
                            <div className="animate-pulse h-full bg-gray-500 rounded w-1/2"></div>
                          </div>
                        ) : (
                          // Show actual score progress bar after analysis
                          <div className="w-full bg-gray-700 rounded h-2">
                            <div
                              className={`h-full rounded ${getScoreColor(
                                info.score
                              )}`}
                              style={{ width: `${info.score}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isAnalyzing
                            ? "text-gray-400"
                            : getScoreColor(info.score)
                        }`}
                      >
                        {isAnalyzing ? "Analyzing..." : `${info.score}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right panel - AI Form Analysis */}
        <div className="bg-brand-secondary/20 rounded-xl p-6 flex-1">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-blue-400" />
            AI Form Analysis
            {effectiveAiConfidence > 0 && !isAnalyzing && (
              <span className="text-blue-400 text-sm ml-2">
                ({effectiveAiConfidence}% confidence)
              </span>
            )}
          </h3>

          {/* Feedback section */}
          <div className="h-32 overflow-y-auto mb-4">
            <div className="space-y-3">
              {isAnalyzing ? (
                <div className="text-center text-gray-400 py-4">
                  Get ready! Position yourself and start exercising.
                </div>
              ) : (
                feedbackItems.map((item, index) => {
                  const info =
                    categoryInfo[item.category as keyof typeof categoryInfo];
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        item.type === "success"
                          ? "bg-green-500/20 text-green-400"
                          : item.type === "warning"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <info.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {info.title}
                        </span>
                      </div>
                      <p className="text-sm ml-7">{item.message}</p>
                      <div className="text-xs opacity-70 mt-2 ml-7">
                        {Math.floor((Date.now() - item.timestamp) / 1000)}s ago
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Performance History Chart */}
          {!isAnalyzing && (
            <div className="mt-4 flex-grow">
              <button
                onClick={() =>
                  setShowPerformanceHistory(!showPerformanceHistory)
                }
                className="flex items-center justify-between w-full text-white font-medium p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <span>Performance History</span>
                {showPerformanceHistory ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {showPerformanceHistory && (
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#4ade80"
                        name="Form Score"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="depth"
                        stroke="#60a5fa"
                        name="Depth %"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="duration"
                        stroke="#f472b6"
                        name="Duration (s)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPanel;
