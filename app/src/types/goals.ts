export interface DailyGoal {
  id: string;
  date: string;
  exercise: boolean;
  cognitive: boolean;
  social: boolean;
  sleep: boolean;
  diet: boolean;
  notes?: string;
}

export interface GoalStats {
  weeklyCompletion: number;
  monthlyCompletion: number;
  streak: number;
  lastUpdated: string;
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
}
