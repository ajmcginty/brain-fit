export type DietRating = 1 | 2 | 3 | 4 | 5;

export interface DailyGoal {
  id: string;
  date: string;
  exercise: boolean;
  cognitive: boolean;
  social: boolean;
  sleep: boolean;
  diet: boolean;
  // Detailed metrics (required when respective goal is checked)
  exerciseMinutes?: number;
  cognitiveMinutes?: number;
  socialNewPeople?: number;
  dietRating?: DietRating;
  sleepHours?: number;
  notes?: string;
  updatedAt?: string; // ISO timestamp for conflict resolution
}

export interface GoalStats {
  weeklyCompletion: number;
  monthlyCompletion: number;
  streak: number;
  lastUpdated: string;
}

export interface WeekComparison {
  current: number;
  previous: number;
  difference: number;
  percentChange: number;
  improved: boolean;
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  // Current week metrics
  exerciseTotal: number;
  exerciseGoalMet: boolean;
  cognitiveAverage: number;
  socialTotal: number;
  dietAverage: number;
  sleepAverage: number;
  completionRate: number;
  // Comparisons with previous week
  exerciseComparison?: WeekComparison;
  cognitiveComparison?: WeekComparison;
  socialComparison?: WeekComparison;
  dietComparison?: WeekComparison;
  sleepComparison?: WeekComparison;
  isFirstWeek: boolean;
}

export interface GoalsState {
  dailyGoals: DailyGoal[];
  stats: GoalStats;
  // Actions
  addGoal: (goal: Omit<DailyGoal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<DailyGoal>) => void;
  getGoalByDate: (date: string) => DailyGoal | undefined;
  // Stats
  updateStats: () => void;
  getCompletionRate: (days: number) => number;
  getCurrentStreak: () => number;
  // Weekly summary functions
  getWeeklyGoals: (weekStartDate: string) => DailyGoal[];
  calculateWeeklySummary: (weekStartDate: string) => WeeklySummary;
  hasSeenWeeklySummary: (weekStartDate: string) => boolean;
  markWeeklySummaryViewed: (weekStartDate: string) => void;
  isWeeklySummaryAvailable: () => boolean;
  // Store management
  reset: () => void;
}
