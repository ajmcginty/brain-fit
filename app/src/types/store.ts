export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
}

export interface DailyGoal {
  id: string;
  date: string;
  exercise: boolean;
  cognition: boolean;
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
