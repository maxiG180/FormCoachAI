export interface ExerciseHistory {
    date: string;
    score: number;
  }
  
  export interface ExerciseFormMetrics {
    [key: string]: number;
  }
  
  export interface ExerciseData {
    totalReps: number;
    bestScore: number;
    lastPerformed: string;
    history: ExerciseHistory[];
    form: ExerciseFormMetrics;
  }
  
  export interface ExerciseStats {
    [key: string]: ExerciseData;
  }
  
  export type ExerciseName = "Squats" | "Bench Press" | "Deadlifts";
  
  export interface Workout {
    date: string;
    exercise: string;
    score: number;
    reps: number;
  }
  
  export interface ImprovementArea {
    name: string;
    value: number;
  }