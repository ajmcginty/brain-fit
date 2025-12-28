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

// Weekly summary utility functions

export const getWeekDateRange = (date: Date): { start: string; end: string } => {
  const d = new Date(date);
  const day = d.getDay();
  
  // Week runs Sunday (0) to Saturday (6)
  // Calculate Sunday of the week
  const diff = day; // days since Sunday
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - diff);
  sunday.setHours(0, 0, 0, 0);
  
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  saturday.setHours(23, 59, 59, 999);
  
  return {
    start: formatDate(sunday),
    end: formatDate(saturday),
  };
};

export const getPreviousWeekDateRange = (): { start: string; end: string } => {
  const today = new Date();
  // Go back 7 days to get last week's Sunday
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - 7);
  lastSunday.setHours(0, 0, 0, 0);
  
  // Find the Sunday of that week
  const day = lastSunday.getDay();
  const diff = day; // days since Sunday
  const weekStart = new Date(lastSunday);
  weekStart.setDate(lastSunday.getDate() - diff);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return {
    start: formatDate(weekStart),
    end: formatDate(weekEnd),
  };
};

export const isSunday = (date: Date = new Date()): boolean => {
  return date.getDay() === 0;
};

export const calculateWeeklyExerciseTotal = (goals: DailyGoal[]): number => {
  return goals.reduce((total, goal) => {
    return total + (goal.exercise && goal.exerciseMinutes ? goal.exerciseMinutes : 0);
  }, 0);
};

export const calculateAverageCognitiveMinutes = (goals: DailyGoal[]): number => {
  const goalsWithData = goals.filter(g => g.cognitive && g.cognitiveMinutes !== undefined);
  if (goalsWithData.length === 0) return 0;
  
  const total = goalsWithData.reduce((sum, goal) => sum + (goal.cognitiveMinutes || 0), 0);
  return total / goalsWithData.length;
};

export const calculateTotalNewPeople = (goals: DailyGoal[]): number => {
  return goals.reduce((total, goal) => {
    return total + (goal.social && goal.socialNewPeople ? goal.socialNewPeople : 0);
  }, 0);
};

export const calculateAverageDietRating = (goals: DailyGoal[]): number => {
  const goalsWithData = goals.filter(g => g.diet && g.dietRating !== undefined);
  if (goalsWithData.length === 0) return 0;
  
  const total = goalsWithData.reduce((sum, goal) => sum + (goal.dietRating || 0), 0);
  return total / goalsWithData.length;
};

export const calculateAverageSleep = (goals: DailyGoal[]): number => {
  const goalsWithData = goals.filter(g => g.sleep && g.sleepHours !== undefined);
  if (goalsWithData.length === 0) return 0;
  
  const total = goalsWithData.reduce((sum, goal) => sum + (goal.sleepHours || 0), 0);
  return total / goalsWithData.length;
};

export const compareWeeks = (current: number, previous: number) => {
  const difference = current - previous;
  const percentChange = previous === 0 ? 
    (current > 0 ? 100 : 0) : 
    ((difference / previous) * 100);
  
  return {
    current,
    previous,
    difference,
    percentChange,
    improved: difference > 0,
  };
};
