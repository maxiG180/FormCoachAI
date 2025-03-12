import { ExerciseStats, Workout } from "@/lib/types/exercise";

export const recentWorkouts: Workout[] = [
  { date: "2025-03-05", exercise: "Squats", score: 87, reps: 12 },
  { date: "2025-03-03", exercise: "Bench Press", score: 75, reps: 8 },
  { date: "2025-03-01", exercise: "Deadlifts", score: 92, reps: 6 },
  { date: "2025-02-28", exercise: "Squats", score: 83, reps: 10 },
];

export const exerciseStats: ExerciseStats = {
  "Squats": {
    totalReps: 358,
    bestScore: 94,
    lastPerformed: "2025-03-05",
    history: [
      { date: "2025-02-01", score: 78 },
      { date: "2025-02-08", score: 80 },
      { date: "2025-02-15", score: 82 },
      { date: "2025-02-22", score: 83 },
      { date: "2025-03-01", score: 85 },
      { date: "2025-03-05", score: 87 },
    ],
    form: {
      depth: 80,
      kneeAlignment: 65,
      backPosition: 90,
      stability: 75,
    },
  },
  "Bench Press": {
    totalReps: 212,
    bestScore: 88,
    lastPerformed: "2025-03-03",
    history: [
      { date: "2025-02-03", score: 70 },
      { date: "2025-02-10", score: 72 },
      { date: "2025-02-17", score: 73 },
      { date: "2025-02-24", score: 74 },
      { date: "2025-03-03", score: 75 },
    ],
    form: {
      elbowPosition: 60,
      barPath: 75,
      shoulderPosition: 85,
      stability: 70,
    },
  },
  "Deadlifts": {
    totalReps: 164,
    bestScore: 92,
    lastPerformed: "2025-03-01",
    history: [
      { date: "2025-02-05", score: 88 },
      { date: "2025-02-12", score: 89 },
      { date: "2025-02-19", score: 90 },
      { date: "2025-02-26", score: 91 },
      { date: "2025-03-01", score: 92 },
    ],
    form: {
      hipHinge: 85,
      backPosition: 95,
      shoulderAlignment: 75,
      stability: 80,
    },
  },
};

// Helper to get areas that need improvement for a given exercise
export const getAreasToImprove = (exercise: string) => {
  if (!exerciseStats[exercise]) return [];
  
  const form = exerciseStats[exercise].form;
  
  const lowestAreas = Object.entries(form)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2);
    
  return lowestAreas.map(([key, value]) => ({
    name: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
    value,
  }));
};

// Format date strings for consistent display
export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};