import { create } from 'zustand';
import { Alert } from 'react-native';
import { GoalsState, DailyGoal, GoalStats } from '../types/goals';
import { calculateCompletionRate, calculateStreak, formatDate } from '../utils/goalUtils';
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