import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyGoal, GoalStats } from '../types/goals';
import { Article } from '../types/articles';
import { StorageError } from '../utils/errors';
import { INITIAL_ARTICLES } from '../constants/articleLinks';
import { getProfileStorageKey } from './profileService';

export const StorageKeys = {
  DAILY_GOALS: 'daily_goals',
  GOAL_STATS: 'goal_stats',
  ARTICLES: 'articles',
} as const;

// Profile-aware storage keys (will be set dynamically)
let profileStorageKeys: {
  DAILY_GOALS: string;
  GOAL_STATS: string;
  ARTICLES: string;
} | null = null;

/**
 * Initialize profile-aware storage keys
 */
export function initializeProfileStorage(deviceId: string): void {
  profileStorageKeys = {
    DAILY_GOALS: getProfileStorageKey(deviceId, 'daily_goals'),
    GOAL_STATS: getProfileStorageKey(deviceId, 'goal_stats'),
    ARTICLES: getProfileStorageKey(deviceId, 'articles'),
  };
  console.log('Profile storage keys initialized for device:', deviceId);
}

/**
 * Reset profile-aware storage keys (for logout)
 */
export function resetProfileStorage(): void {
  profileStorageKeys = null;
  console.log('Profile storage keys cleared');
}

/**
 * Get the appropriate storage key (profile-aware or legacy)
 */
function getStorageKey(key: string): string {
  if (profileStorageKeys) {
    // Use profile-aware keys if available
    switch (key) {
      case StorageKeys.DAILY_GOALS:
        return profileStorageKeys.DAILY_GOALS;
      case StorageKeys.GOAL_STATS:
        return profileStorageKeys.GOAL_STATS;
      case StorageKeys.ARTICLES:
        return profileStorageKeys.ARTICLES;
      default:
        return key;
    }
  }
  // Fall back to legacy keys
  return key;
}

export const storage = {
  // Generic methods
  async set(key: string, value: any): Promise<void> {
    try {
      const storageKey = getStorageKey(key);
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(storageKey, jsonValue);
    } catch (error) {
      console.error('Error saving data', { key, storageKey: getStorageKey(key), error });
      throw new StorageError(
        'Failed to save data to storage',
        'write',
        key,
        error
      );
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const storageKey = getStorageKey(key);
      const jsonValue = await AsyncStorage.getItem(storageKey);
      if (jsonValue === null) {
        return null;
      }
      try {
        return JSON.parse(jsonValue);
      } catch (parseError) {
        console.error('Error parsing stored data', { key, storageKey, jsonValue, parseError });
        throw new StorageError(
          'Failed to parse stored data',
          'read',
          key,
          parseError
        );
      }
    } catch (error) {
      console.error('Error reading data', { key, storageKey: getStorageKey(key), error });
      throw new StorageError(
        'Failed to read data from storage',
        'read',
        key,
        error
      );
    }
  },

  async remove(key: string): Promise<void> {
    try {
      const storageKey = getStorageKey(key);
      await AsyncStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error removing data', { key, storageKey: getStorageKey(key), error });
      throw new StorageError(
        'Failed to remove data from storage',
        'delete',
        key,
        error
      );
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing data', { error });
      throw new StorageError(
        'Failed to clear storage',
        'delete',
        undefined,
        error
      );
    }
  },

  // Goals specific methods
  async getDailyGoals(): Promise<DailyGoal[]> {
    try {
      const goals = await this.get<DailyGoal[]>(StorageKeys.DAILY_GOALS);
      return goals || [];
    } catch (error) {
      console.error('Error getting daily goals', error);
      // Return empty array as fallback for read errors
      return [];
    }
  },

  async saveDailyGoals(goals: DailyGoal[]): Promise<void> {
    try {
      await this.set(StorageKeys.DAILY_GOALS, goals);
    } catch (error) {
      console.error('Error saving daily goals', error);
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(
        'Failed to save daily goals',
        'write',
        StorageKeys.DAILY_GOALS,
        error
      );
    }
  },

  async getGoalStats(): Promise<GoalStats | null> {
    try {
      return await this.get<GoalStats>(StorageKeys.GOAL_STATS);
    } catch (error) {
      console.error('Error getting goal stats', error);
      // Return null as fallback for read errors
      return null;
    }
  },

  async saveGoalStats(stats: GoalStats): Promise<void> {
    try {
      await this.set(StorageKeys.GOAL_STATS, stats);
    } catch (error) {
      console.error('Error saving goal stats', error);
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(
        'Failed to save goal statistics',
        'write',
        StorageKeys.GOAL_STATS,
        error
      );
    }
  },

  // Article specific methods
  async getArticles(): Promise<Article[]> {
    try {
      const articles = await this.get<Article[]>(StorageKeys.ARTICLES);
      if (!articles) {
        // If no articles exist, save and return initial articles
        await this.saveArticles(INITIAL_ARTICLES);
        return INITIAL_ARTICLES;
      }
      return articles;
    } catch (error) {
      console.error('Error getting articles', error);
      // Return initial articles as fallback for read errors
      return INITIAL_ARTICLES;
    }
  },

  async saveArticles(articles: Article[]): Promise<void> {
    try {
      await this.set(StorageKeys.ARTICLES, articles);
    } catch (error) {
      console.error('Error saving articles', error);
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(
        'Failed to save articles',
        'write',
        StorageKeys.ARTICLES,
        error
      );
    }
  },

  // Profile management methods
  isProfileStorageEnabled(): boolean {
    return profileStorageKeys !== null;
  },

  getProfileStorageKeys(): typeof profileStorageKeys {
    return profileStorageKeys;
  },
};