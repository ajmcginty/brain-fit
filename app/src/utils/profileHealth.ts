import AsyncStorage from '@react-native-async-storage/async-storage';
import { BasicProfile } from '../types/profile';
import { validateProfileIntegrity } from '../services/profileService';
import { storage } from '../services/storage';

/**
 * Profile health status interface
 */
export interface ProfileHealthStatus {
  isHealthy: boolean;
  profileExists: boolean;
  profileValid: boolean;
  storageInitialized: boolean;
  dataAccessible: boolean;
  issues: string[];
  recommendations: string[];
}

/**
 * Comprehensive profile health check
 */
export async function checkProfileHealth(): Promise<ProfileHealthStatus> {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  try {
    // Check if profile exists
    const profile = await getProfileFromStorage();
    const profileExists = !!profile;
    
    if (!profileExists) {
      issues.push('No profile found in storage');
      recommendations.push('Initialize profile system');
      return {
        isHealthy: false,
        profileExists: false,
        profileValid: false,
        storageInitialized: false,
        dataAccessible: false,
        issues,
        recommendations,
      };
    }

    // Validate profile integrity
    const profileValid = await validateProfileIntegrity(profile);
    if (!profileValid) {
      issues.push('Profile validation failed');
      recommendations.push('Attempt profile recovery');
    }

    // Check if profile storage is initialized
    const storageInitialized = storage.isProfileStorageEnabled();
    if (!storageInitialized) {
      issues.push('Profile storage not initialized');
      recommendations.push('Load profile to initialize storage');
    }

    // Test data accessibility
    const dataAccessible = await testDataAccessibility();
    if (!dataAccessible) {
      issues.push('Data access issues detected');
      recommendations.push('Check storage permissions and integrity');
    }

    // Determine overall health
    const isHealthy = profileExists && profileValid && storageInitialized && dataAccessible;

    return {
      isHealthy,
      profileExists,
      profileValid,
      storageInitialized,
      dataAccessible,
      issues,
      recommendations,
    };
  } catch (error) {
    issues.push(`Health check error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    recommendations.push('Review error logs and restart app');
    
    return {
      isHealthy: false,
      profileExists: false,
      profileValid: false,
      storageInitialized: false,
      dataAccessible: false,
      issues,
      recommendations,
    };
  }
}

/**
 * Get profile from storage directly
 */
async function getProfileFromStorage(): Promise<BasicProfile | null> {
  try {
    const profileData = await AsyncStorage.getItem('profile');
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error('Error reading profile from storage:', error);
    return null;
  }
}

/**
 * Test if data can be accessed through the storage service
 */
async function testDataAccessibility(): Promise<boolean> {
  try {
    // Try to access a small piece of data
    const articles = await storage.getArticles();
    return Array.isArray(articles);
  } catch (error) {
    console.error('Data accessibility test failed:', error);
    return false;
  }
}

/**
 * Get detailed profile information for debugging
 */
export async function getProfileDebugInfo(): Promise<{
  profile: BasicProfile | null;
  storageKeys: any;
  legacyDataExists: boolean;
  profileStorageEnabled: boolean;
}> {
  try {
    const profile = await getProfileFromStorage();
    const storageKeys = storage.getProfileStorageKeys();
    const profileStorageEnabled = storage.isProfileStorageEnabled();
    
    // Check for legacy data
    const legacyGoals = await AsyncStorage.getItem('daily_goals');
    const legacyStats = await AsyncStorage.getItem('goal_stats');
    const legacyArticles = await AsyncStorage.getItem('articles');
    const legacyDataExists = !!(legacyGoals || legacyStats || legacyArticles);

    return {
      profile,
      storageKeys,
      legacyDataExists,
      profileStorageEnabled,
    };
  } catch (error) {
    console.error('Error getting debug info:', error);
    return {
      profile: null,
      storageKeys: null,
      legacyDataExists: false,
      profileStorageEnabled: false,
    };
  }
}

/**
 * Generate a health report summary
 */
export function generateHealthReport(status: ProfileHealthStatus): string {
  const report = [
    '=== Profile Health Report ===',
    `Overall Health: ${status.isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`,
    `Profile Exists: ${status.profileExists ? '✅ Yes' : '❌ No'}`,
    `Profile Valid: ${status.profileValid ? '✅ Yes' : '❌ No'}`,
    `Storage Initialized: ${status.storageInitialized ? '✅ Yes' : '❌ No'}`,
    `Data Accessible: ${status.dataAccessible ? '✅ Yes' : '❌ No'}`,
  ];

  if (status.issues.length > 0) {
    report.push('\nIssues Found:');
    status.issues.forEach(issue => report.push(`• ${issue}`));
  }

  if (status.recommendations.length > 0) {
    report.push('\nRecommendations:');
    status.recommendations.forEach(rec => report.push(`• ${rec}`));
  }

  return report.join('\n');
}
