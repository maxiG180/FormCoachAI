// File: components/analyze/FeedbackPanel.tsx

import React from "react";
import { formatTime } from "@/utils/timeFormat";
import { AIInsight, FeedbackItem } from "@/types/analyze";
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
import { SQUAT_CONSTANTS } from "@/utils/constants/squatConstants";
import { FEEDBACK_CONSTANTS } from "@/utils/constants/feedbackConstants";

interface FeedbackPanelProps {
  feedback: FeedbackItem[];
  categoryScores: Record<string, number>;
  overallScore: number;
  className?: string;
  repCount?: number;
  consecutiveGoodReps?: number;
  repHistory?: Array<{
    timestamp: number;
    score: number;
    depth: number;
    duration: number;
  }>;
  aiInsights?: AIInsight;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  feedback,
  categoryScores,
  overallScore,
  repCount = 0,
  consecutiveGoodReps = 0,
  repHistory = [],
  className = "",
  aiInsights, // Add this parameter to fix the "Cannot find name" errors
}) => {
  // State management for animated scores and performance history visibility
  const [animatedScores, setAnimatedScores] = React.useState(categoryScores);
  const [showPerformanceHistory, setShowPerformanceHistory] =
    React.useState(true);

  // Update animated scores when categoryScores change
  React.useEffect(() => {
    setAnimatedScores(categoryScores);
  }, [categoryScores]);

  // Category information with icons and descriptions
  const categoryInfo = {
    form: {
      icon: Shield,
      title: "Overall Form",
      description: "Posture and movement patterns",
      weight: FEEDBACK_CONSTANTS.CATEGORY_WEIGHTS.form,
    },
    depth: {
      icon: Target,
      title: "Range of Motion",
      description: "Movement depth and completion",
      weight: FEEDBACK_CONSTANTS.CATEGORY_WEIGHTS.depth,
    },
    alignment: {
      icon: Award,
      title: "Body Alignment",
      description: "Joint and limb positioning",
      weight: FEEDBACK_CONSTANTS.CATEGORY_WEIGHTS.alignment,
    },
    balance: {
      icon: Scale,
      title: "Balance & Symmetry",
      description: "Even weight distribution",
      weight: FEEDBACK_CONSTANTS.CATEGORY_WEIGHTS.balance,
    },
  };

  const getScoreColor = (score: number) => {
    if (score >= SQUAT_CONSTANTS.PERFECT_REP_THRESHOLD) return "text-green-400";
    if (score >= 75) return "text-blue-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getPerformanceEmoji = (score: number) => {
    if (score >= SQUAT_CONSTANTS.PERFECT_REP_THRESHOLD) return "🏆";
    if (score >= 75) return "💪";
    if (score >= 60) return "📈";
    return "💡";
  };

  // Format rep history data for the chart
  const chartData = repHistory.map((rep, index) => ({
    name: `Rep ${index + 1}`,
    score: rep.score,
    depth: Math.round(rep.depth * 100),
    duration: Math.round(rep.duration / 100) / 10, // Convert to seconds with 1 decimal
  }));

  return (
    <div className={`flex space-x-6 pb-2 ${className}`}>
      {/* Performance Overview Card */}
      <div className="bg-brand-secondary/20 rounded-xl p-4 flex-1">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">
            {getPerformanceEmoji(overallScore)}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Real-time Form Analysis
          </h2>
          {/* Star Rating */}
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(Math.floor((overallScore / 100) * 5))].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 fill-yellow-400 text-yellow-400"
              />
            ))}
            {((overallScore / 100) * 5) % 1 >= 0.5 && (
              <StarHalf className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            )}
          </div>
          {/* Overall Score */}
          <div
            className={`text-3xl font-bold mb-3 ${getScoreColor(overallScore)}`}
          >
            {overallScore}%
          </div>
          {/* Rep Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-brand-primary/10 rounded-lg p-4">
              <Activity className="w-5 h-5 text-brand-primary mx-auto mb-2" />
              <div className="text-sm text-gray-400">Total Reps</div>
              <div className="text-2xl font-bold text-white">{repCount}</div>
            </div>
            <div className="bg-green-500/10 rounded-lg p-4">
              <Award className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <div className="text-sm text-gray-400">Perfect Reps</div>
              <div className="text-2xl font-bold text-green-400">
                {consecutiveGoodReps}
              </div>
            </div>
          </div>
          {/* Category Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(animatedScores).map(([category, score]) => {
              const info = categoryInfo[category as keyof typeof categoryInfo];
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
                      {/* DaisyUI Progress Bar */}
                      <progress
                        className={`progress ${getScoreColor(Math.round(score))}`}
                        value={Math.max(0, Math.min(100, score))}
                        max="100"
                      />
                    </div>
                    <span
                      className={`text-sm font-medium ${getScoreColor(score)}`}
                    >
                      {Math.round(score)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Insights Section - Fixed the TypeScript errors */}
      {aiInsights && aiInsights.issues && aiInsights.issues.length > 0 && (
        <div className="mt-4 bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Form Analysis
          </h3>
          <div className="text-sm mb-3">
            <span className="text-blue-400">AI detected: </span>
            <span className="text-white">{aiInsights.category}</span>
            <span className="text-gray-400 ml-2">
              ({Math.round(aiInsights.confidence * 100)}% confidence)
            </span>
          </div>
          {aiInsights.issues.length > 0 && (
            <div className="space-y-2">
              {aiInsights.issues.map(
                (issue: { type: string; confidence: number }, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-white">{issue.type}</span>
                    <span className="text-gray-400 text-xs">
                      ({Math.round(issue.confidence * 100)}%)
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* Real-time Feedback Section */}
      <div className="bg-brand-secondary/20 rounded-xl p-6 flex-1">
        <h3 className="text-lg font-semibold text-white mb-4">Form Feedback</h3>
        <div className="h-32 overflow-y-auto">
          {" "}
          {/* Fixed height and scrollable */}
          <div className="space-y-3">
            {feedback.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                {repCount === 0
                  ? "Get ready! Position yourself and start exercising."
                  : "Great form! Keep going..."}
              </div>
            ) : (
              feedback.map((item, index) => {
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
                      <span className="text-sm font-medium">{info.title}</span>
                    </div>
                    <p className="text-sm ml-7">{item.message}</p>
                    <div className="text-xs opacity-70 mt-2 ml-7">
                      {formatTime(item.timestamp)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {/* Performance History Chart */}
        {repHistory.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowPerformanceHistory(!showPerformanceHistory)}
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
  );
};

export default FeedbackPanel;
