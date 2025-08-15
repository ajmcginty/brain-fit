import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyGoal, GoalStats } from '../types/goals';
import { Article } from '../types/articles';
import { getProfileStorageKey } from './profileService';
import { storage } from './storage';

/**
 * Service for migrating data from legacy storage to profile-aware storage
 */
export class DataMigrationService {
  private deviceId: string;

  constructor(deviceId: string) {
    this.deviceId = deviceId;
  }

  /**
   * Migrates all existing data to profile-aware storage structure
   */
  async migrateAllData(): Promise<void> {
    try {
      console.log('Starting comprehensive data migration for device:', this.deviceId);
      
      // Migrate goals data
      await this.migrateGoalsData();
      
      // Migrate articles data
      await this.migrateArticlesData();
      
      // Validate migration success
      const isValid = await this.validateMigrationSuccess();
      if (!isValid) {
        throw new Error('Migration validation failed');
      }
      
      console.log('Data migration completed successfully');
    } catch (error) {
      console.error('Data migration failed:', error);
      throw new Error(`Data migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Migrates goals-related data to profile-aware storage
   */
  private async migrateGoalsData(): Promise<void> {
    try {
      console.log('Migrating goals data...');
      
      // Migrate daily goals
      const dailyGoals = await storage.getDailyGoals();
      if (dailyGoals && dailyGoals.length > 0) {
        const profileKey = getProfileStorageKey(this.deviceId, 'daily_goals');
        await AsyncStorage.setItem(profileKey, JSON.stringify(dailyGoals));
        console.log(`Migrated ${dailyGoals.length} daily goals`);
      }

      // Migrate goal stats
      const goalStats = await storage.getGoalStats();
      if (goalStats) {
        const profileKey = getProfileStorageKey(this.deviceId, 'goal_stats');
        await AsyncStorage.setItem(profileKey, JSON.stringify(goalStats));
        console.log('Migrated goal stats');
      }
      
      console.log('Goals data migration completed');
    } catch (error) {
      console.error('Goals data migration error:', error);
      throw error;
    }
  }

  /**
   * Migrates articles data to profile-aware storage
   */
  private async migrateArticlesData(): Promise<void> {
    try {
      console.log('Migrating articles data...');
      
      const articles = await storage.getArticles();
      if (articles && articles.length > 0) {
        const profileKey = getProfileStorageKey(this.deviceId, 'articles');
        await AsyncStorage.setItem(profileKey, JSON.stringify(articles));
        console.log(`Migrated ${articles.length} articles`);
      }
      
      console.log('Articles data migration completed');
    } catch (error) {
      console.error('Articles data migration error:', error);
      throw error;
    }
  }

  /**
   * Validates that migration was successful
   */
  async validateMigrationSuccess(): Promise<boolean> {
    try {
      console.log('Validating migration success...');
      
      // Check if profile-specific keys exist and contain data
      const dailyGoalsKey = getProfileStorageKey(this.deviceId, 'daily_goals');
      const goalStatsKey = getProfileStorageKey(this.deviceId, 'goal_stats');
      const articlesKey = getProfileStorageKey(this.deviceId, 'articles');
      
      const dailyGoals = await AsyncStorage.getItem(dailyGoalsKey);
      const goalStats = await AsyncStorage.getItem(goalStatsKey);
      const articles = await AsyncStorage.getItem(articlesKey);
      
      // Basic validation - at least some data should exist
      const hasMigratedData = dailyGoals || goalStats || articles;
      
      if (!hasMigratedData) {
        console.warn('No migrated data found during validation');
        return false;
      }
      
      console.log('Migration validation successful');
      return true;
    } catch (error) {
      console.error('Migration validation error:', error);
      return false;
    }
  }

  /**
   * Rolls back migration by restoring original data structure
   */
  async rollbackMigration(): Promise<void> {
    try {
      console.log('Rolling back data migration...');
      
      // Restore original storage structure
      const dailyGoalsKey = getProfileStorageKey(this.deviceId, 'daily_goals');
      const goalStatsKey = getProfileStorageKey(this.deviceId, 'goal_stats');
      const articlesKey = getProfileStorageKey(this.deviceId, 'articles');
      
      // Get migrated data
      const migratedGoals = await AsyncStorage.getItem(dailyGoalsKey);
      const migratedStats = await AsyncStorage.getItem(goalStatsKey);
      const migratedArticles = await AsyncStorage.getItem(articlesKey);
      
      // Restore to original keys
      if (migratedGoals) {
        await storage.saveDailyGoals(JSON.parse(migratedGoals));
      }
      
      if (migratedStats) {
        await storage.saveGoalStats(JSON.parse(migratedStats));
      }
      
      if (migratedArticles) {
        await storage.saveArticles(JSON.parse(migratedArticles));
      }
      
      // Clean up profile-specific keys
      await AsyncStorage.removeItem(dailyGoalsKey);
      await AsyncStorage.removeItem(goalStatsKey);
      await AsyncStorage.removeItem(articlesKey);
      
      console.log('Migration rollback completed successfully');
    } catch (error) {
      console.error('Migration rollback error:', error);
      throw new Error(`Migration rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets migration status and statistics
   */
  async getMigrationStatus(): Promise<{
    isMigrated: boolean;
    hasLegacyData: boolean;
    migratedDataCount: number;
    errors: string[];
  }> {
    try {
      const errors: string[] = [];
      let migratedDataCount = 0;
      
      // Check for legacy data
      const hasLegacyData = await this.hasLegacyData();
      
      // Check for migrated data
      const dailyGoalsKey = getProfileStorageKey(this.deviceId, 'daily_goals');
      const goalStatsKey = getProfileStorageKey(this.deviceId, 'goal_stats');
      const articlesKey = getProfileStorageKey(this.deviceId, 'articles');
      
      const dailyGoals = await AsyncStorage.getItem(dailyGoalsKey);
      const goalStats = await AsyncStorage.getItem(goalStatsKey);
      const articles = await AsyncStorage.getItem(articlesKey);
      
      if (dailyGoals) migratedDataCount++;
      if (goalStats) migratedDataCount++;
      if (articles) migratedDataCount++;
      
      const isMigrated = migratedDataCount > 0;
      
      return {
        isMigrated,
        hasLegacyData,
        migratedDataCount,
        errors,
      };
    } catch (error) {
      console.error('Error getting migration status:', error);
      return {
        isMigrated: false,
        hasLegacyData: false,
        migratedDataCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Checks if legacy data still exists
   */
  private async hasLegacyData(): Promise<boolean> {
    try {
      const legacyGoals = await AsyncStorage.getItem('daily_goals');
      const legacyStats = await AsyncStorage.getItem('goal_stats');
      const legacyArticles = await AsyncStorage.getItem('articles');
      
      return !!(legacyGoals || legacyStats || legacyArticles);
    } catch (error) {
      console.error('Error checking legacy data:', error);
      return false;
    }
  }
}

/**
 * Factory function to create a data migration service
 */
export function createDataMigrationService(deviceId: string): DataMigrationService {
  return new DataMigrationService(deviceId);
}
