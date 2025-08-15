import { DailyGoal } from '../types/goals';

export const isGoalComplete = (goal: DailyGoal): boolean => {
  return goal.exercise && 
         goal.cognitive && 
         goal.social && 
         goal.sleep && 
         goal.diet;
};

export const calculateCompletionRate = (goals: DailyGoal[], days: number): number => {
  const now = new Date();
  const startDate = new Date(now.setDate(now.getDate() - days));
  
  const recentGoals = goals.filter(goal => new Date(goal.date) >= startDate);
  if (recentGoals.length === 0) return 0;
  
  const completedGoals = recentGoals.filter(isGoalComplete);
  return (completedGoals.length / recentGoals.length) * 100;
};

export const calculateStreak = (goals: DailyGoal[]): number => {
  let streak = 0;
  const sortedGoals = [...goals].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (const goal of sortedGoals) {
    if (isGoalComplete(goal)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const createEmptyGoal = (date: string): Omit<DailyGoal, 'id'> => {
  return {
    date,
    exercise: false,
    cognitive: false,
    social: false,
    sleep: false,
    diet: false,
  };
};
