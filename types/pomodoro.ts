export type PomodoroMode = "focus" | "shortBreak" | "longBreak";

export interface PomodoroState {
  mode: PomodoroMode;
  isRunning: boolean;
  endTimestamp: number | null;
  remainingSeconds: number;
  dailyHistory: Record<string, number>; // YYYY-MM-DD -> count
}

export interface DaySessionCount {
  date: string;
  dayName: string;
  count: number;
  isToday: boolean;
}
