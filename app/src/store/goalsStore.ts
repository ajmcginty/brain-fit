import { create } from 'zustand';
import { Alert } from 'react-native';
import { GoalsState, DailyGoal, GoalStats, WeeklySummary } from '../types/goals';
import { 
  calculateCompletionRate, 
  calculateStreak, 
  formatDate,
  getWeekDateRange,
  isSunday,
  calculateWeeklyExerciseTotal,
  calculateAverageCognitiveMinutes,
  calculateTotalNewPeople,
  calculateAverageDietRating,
  calculateAverageSleep,
  compareWeeks,
  isGoalComplete
} from '../utils/goalUtils';
import { storage } from '../services/storage';
import { StorageError } from '../utils/errors';
import { getCurrentUid } from '../services/cloudAuth';
import { syncTodayGoal } from '../services/cloudSync';

const INITIAL_STATS: GoalStats = {
  weeklyCompletion: 0,
  monthlyCompletion: 0,
  streak: 0,
  lastUpdated: new Date().toISOString(),
};

export const useGoalsStore = create<GoalsState>((set, get) => ({
  dailyGoals: [],
  stats: INITIAL_STATS,

  addGoal: async (goalData) => {
    const newGoal: DailyGoal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      dailyGoals: [...state.dailyGoals, newGoal],
    }));

    try {
      // Persist to storage
      const { dailyGoals } = get();
      await storage.saveDailyGoals(dailyGoals);
      await get().updateStats();
      // Best-effort cloud sync
      const uid = getCurrentUid();
      if (uid) {
        await syncTodayGoal(uid);
      }
    } catch (error) {
      // Revert state on error
      set((state) => ({
        dailyGoals: state.dailyGoals.filter(goal => goal.id !== newGoal.id),
      }));

      if (error instanceof StorageError) {
        Alert.alert(
          'Storage Error',
          StorageError.getReadableMessage(error),
          [{ text: 'OK' }]
        );
      }
      throw error;
    }
  },

  updateGoal: async (id, updates) => {
    const previousGoals = get().dailyGoals;
    const goalToUpdate = previousGoals.find(goal => goal.id === id);

    if (!goalToUpdate) {
      console.error('Attempted to update non-existent goal:', id);
      return;
    }

    set((state) => ({
      dailyGoals: state.dailyGoals.map((goal) =>
        goal.id === id ? { ...goal, ...updates, updatedAt: new Date().toISOString() } : goal
      ),
    }));

    try {
      // Persist to storage
      const { dailyGoals } = get();
      await storage.saveDailyGoals(dailyGoals);
      await get().updateStats();
      // Best-effort cloud sync
      const uid = getCurrentUid();
      if (uid) {
        await syncTodayGoal(uid);
      }
    } catch (error) {
      // Revert state on error
      set({ dailyGoals: previousGoals });

      if (error instanceof StorageError) {
        Alert.alert(
          'Storage Error',
          StorageError.getReadableMessage(error),
          [{ text: 'OK' }]
        );
      }
      throw error;
    }
  },

  getGoalByDate: (date) => {
    const { dailyGoals } = get();
    return dailyGoals.find((goal) => goal.date === date);
  },

  updateStats: async () => {
    const { dailyGoals } = get();
    const previousStats = get().stats;
    const stats: GoalStats = {
      weeklyCompletion: calculateCompletionRate(dailyGoals, 7),
      monthlyCompletion: calculateCompletionRate(dailyGoals, 30),
      streak: calculateStreak(dailyGoals),
      lastUpdated: new Date().toISOString(),
    };

    set({ stats });

    try {
      await storage.saveGoalStats(stats);
    } catch (error) {
      // Revert stats on error
      set({ stats: previousStats });

      if (error instanceof StorageError) {
        Alert.alert(
          'Storage Error',
          StorageError.getReadableMessage(error),
          [{ text: 'OK' }]
        );
      }
      throw error;
    }
  },

  getCompletionRate: (days) => {
    const { dailyGoals } = get();
    return calculateCompletionRate(dailyGoals, days);
  },

  getCurrentStreak: () => {
    const { stats } = get();
    return stats.streak;
  },

  // Weekly summary functions
  getWeeklyGoals: (weekStartDate: string) => {
    const { dailyGoals } = get();
    const weekStart = new Date(weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return dailyGoals.filter(goal => {
      const goalDate = new Date(goal.date);
      return goalDate >= weekStart && goalDate <= weekEnd;
    });
  },

  calculateWeeklySummary: (weekStartDate: string) => {
    const { getWeeklyGoals } = get();
    const currentWeekGoals = getWeeklyGoals(weekStartDate);
    
    // Calculate previous week's date range
    const prevWeekStart = new Date(weekStartDate);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const previousWeekGoals = getWeeklyGoals(formatDate(prevWeekStart));
    
    // Calculate current week metrics
    const exerciseTotal = calculateWeeklyExerciseTotal(currentWeekGoals);
    const cognitiveAverage = calculateAverageCognitiveMinutes(currentWeekGoals);
    const socialTotal = calculateTotalNewPeople(currentWeekGoals);
    const dietAverage = calculateAverageDietRating(currentWeekGoals);
    const sleepAverage = calculateAverageSleep(currentWeekGoals);
    
    const completedGoals = currentWeekGoals.filter(isGoalComplete);
    const completionRate = currentWeekGoals.length > 0 
      ? (completedGoals.length / currentWeekGoals.length) * 100 
      : 0;
    
    // Calculate previous week metrics
    const prevExerciseTotal = calculateWeeklyExerciseTotal(previousWeekGoals);
    const prevCognitiveAverage = calculateAverageCognitiveMinutes(previousWeekGoals);
    const prevSocialTotal = calculateTotalNewPeople(previousWeekGoals);
    const prevDietAverage = calculateAverageDietRating(previousWeekGoals);
    const prevSleepAverage = calculateAverageSleep(previousWeekGoals);
    
    const isFirstWeek = previousWeekGoals.length === 0;
    
    const weekRange = getWeekDateRange(new Date(weekStartDate));
    
    const summary: WeeklySummary = {
      weekStart: weekRange.start,
      weekEnd: weekRange.end,
      exerciseTotal,
      exerciseGoalMet: exerciseTotal >= 150,
      cognitiveAverage: Math.round(cognitiveAverage * 10) / 10,
      socialTotal,
      dietAverage: Math.round(dietAverage * 10) / 10,
      sleepAverage: Math.round(sleepAverage * 10) / 10,
      completionRate: Math.round(completionRate),
      isFirstWeek,
    };
    
    // Add comparisons if not first week
    if (!isFirstWeek) {
      summary.exerciseComparison = compareWeeks(exerciseTotal, prevExerciseTotal);
      summary.cognitiveComparison = compareWeeks(cognitiveAverage, prevCognitiveAverage);
      summary.socialComparison = compareWeeks(socialTotal, prevSocialTotal);
      summary.dietComparison = compareWeeks(dietAverage, prevDietAverage);
      summary.sleepComparison = compareWeeks(sleepAverage, prevSleepAverage);
    }
    
    return summary;
  },

  hasSeenWeeklySummary: async (weekStartDate: string) => {
    try {
      const viewed = await storage.getWeeklySummaryViewed();
      return viewed.includes(weekStartDate);
    } catch (error) {
      console.error('Error checking weekly summary viewed:', error);
      return false;
    }
  },

  markWeeklySummaryViewed: async (weekStartDate: string) => {
    try {
      const viewed = await storage.getWeeklySummaryViewed();
      if (!viewed.includes(weekStartDate)) {
        await storage.saveWeeklySummaryViewed([...viewed, weekStartDate]);
      }
    } catch (error) {
      console.error('Error marking weekly summary as viewed:', error);
    }
  },

  isWeeklySummaryAvailable: () => {
    return isSunday();
  },

  // Reset store (for logout)
  reset: () => {
    console.log('[goalsStore] Resetting store');
    set({
      dailyGoals: [],
      stats: INITIAL_STATS,
    });
  },
}));

// Initialize store with data from storage and cloud
export const initializeGoalsStore = async () => {
  try {
    // Try to pull and merge from cloud first
    const { getCurrentUid } = await import('../services/cloudAuth');
    const { pullAndMergeGoals } = await import('../services/cloudSync');
    
    const uid = getCurrentUid();
    let mergedGoals;
    
    if (uid) {
      // Pull from cloud and merge with local
      mergedGoals = await pullAndMergeGoals(uid);
      
      // Save merged goals back to local storage
      if (mergedGoals.length > 0) {
        await storage.saveDailyGoals(mergedGoals);
        useGoalsStore.setState({ dailyGoals: mergedGoals });
      }
    } else {
      // No uid, just load local
      const storedGoals = await storage.getDailyGoals();
      if (storedGoals.length > 0) {
        useGoalsStore.setState({ dailyGoals: storedGoals });
      }
    }

    // Load or recalculate stats
    const storedStats = await storage.getGoalStats();
    if (storedStats) {
      useGoalsStore.setState({ stats: storedStats });
    } else {
      await useGoalsStore.getState().updateStats();
    }
  } catch (error) {
    console.error('Error initializing goals store:', error);
    // Use default state on initialization error
    Alert.alert(
      'Data Loading Error',
      'Unable to load your saved data. Starting with empty state.',
      [{ text: 'OK' }]
    );
  }
};