// Auth types are now in authStore.ts

export interface DailyGoal {
  id: string;
  date: string;
  exercise: boolean;
  cognitive: boolean;
  social: boolean;
  sleep: boolean;
  diet: boolean;
}

export interface GoalsState {
  dailyGoals: DailyGoal[];
  addDailyGoal: (goal: DailyGoal) => void;
  updateDailyGoal: (id: string, updates: Partial<DailyGoal>) => void;
  getDailyGoal: (date: string) => DailyGoal | undefined;
}
