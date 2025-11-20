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
  if (goals.length === 0) return 0;
  
  // Sort by date descending (most recent first)
  const sortedGoals = [...goals].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (const goal of sortedGoals) {
    const goalDate = new Date(goal.date);
    goalDate.setHours(0, 0, 0, 0);
    
    // Calculate how many days ago this goal was from today
    const daysDiff = Math.floor((today.getTime() - goalDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check if this goal is for the expected consecutive day
    if (daysDiff === streak) {
      // Check if all 5 goals were completed this day
      if (isGoalComplete(goal)) {
        streak++;
      } else {
        break; // Streak is broken
      }
    } else {
      // Gap in dates, streak is broken
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
    updatedAt: new Date().toISOString(),
  };
};
