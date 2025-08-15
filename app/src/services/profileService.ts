import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';  // This needs to be imported before uuid
import { v4 as uuidv4 } from 'uuid';
import { Platform } from 'react-native';
import { BasicProfile, DeviceInfo } from '../types/profile';

const STORAGE_KEYS = {
  DEVICE_ID: 'device_id',
  PROFILE: 'profile',
  // Legacy keys that need to be restructured
  LEGACY_DAILY_GOALS: 'daily_goals',
  LEGACY_GOAL_STATS: 'goal_stats',
  LEGACY_ARTICLES: 'articles',
} as const;

/**
 * Generates a unique device ID using UUID, timestamp, and platform info
 */
export async function generateDeviceId(): Promise<DeviceInfo> {
  try {
    // Check if we already have a device ID
    const existingId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    if (existingId) {
      return JSON.parse(existingId);
    }

    // Generate new device ID
    const deviceInfo: DeviceInfo = {
      deviceId: `${Platform.OS}_${uuidv4()}_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Store the device ID
    await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, JSON.stringify(deviceInfo));
    return deviceInfo;
  } catch (error) {
    console.error('Error generating device ID:', error);
    throw new Error('Failed to generate device ID');
  }
}

/**
 * Creates a new basic profile
 */
export async function createProfile(): Promise<BasicProfile> {
  try {
    const deviceInfo = await generateDeviceId();
    
    const profile: BasicProfile = {
      ...deviceInfo,
      lastActive: new Date().toISOString(),
      preferences: {
        theme: 'light',
        notifications: false,
      },
    };

    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw new Error('Failed to create profile');
  }
}

/**
 * Retrieves the current profile
 */
export async function getProfile(): Promise<BasicProfile | null> {
  try {
    const profileData = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw new Error('Failed to get profile');
  }
}

/**
 * Updates the current profile
 */
export async function updateProfile(updates: Partial<BasicProfile>): Promise<BasicProfile> {
  try {
    const currentProfile = await getProfile();
    if (!currentProfile) {
      throw new Error('No profile exists to update');
    }

    const updatedProfile: BasicProfile = {
      ...currentProfile,
      ...updates,
      lastActive: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));
    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile');
  }
}

/**
 * Validates profile integrity and returns true if valid
 */
export async function validateProfileIntegrity(profile: BasicProfile): Promise<boolean> {
  try {
    // Check required fields
    if (!profile.deviceId || !profile.createdAt || !profile.lastActive) {
      return false;
    }

    // Validate date formats
    const createdAt = new Date(profile.createdAt);
    const lastActive = new Date(profile.lastActive);
    
    if (isNaN(createdAt.getTime()) || isNaN(lastActive.getTime())) {
      return false;
    }

    // Validate device ID format (should contain platform prefix)
    if (!profile.deviceId.includes('_')) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Profile validation error:', error);
    return false;
  }
}

/**
 * Recovers profile from storage or creates a new one if recovery fails
 */
export async function recoverProfile(): Promise<BasicProfile | null> {
  try {
    // Try to get existing profile
    const existingProfile = await getProfile();
    if (existingProfile && await validateProfileIntegrity(existingProfile)) {
      return existingProfile;
    }

    // Try to recover device ID
    const deviceInfo = await generateDeviceId();
    
    // Create new profile with recovered device ID
    const recoveredProfile: BasicProfile = {
      ...deviceInfo,
      lastActive: new Date().toISOString(),
      preferences: {
        theme: 'light',
        notifications: false,
      },
    };

    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(recoveredProfile));
    return recoveredProfile;
  } catch (error) {
    console.error('Profile recovery error:', error);
    return null;
  }
}

/**
 * Restructures existing AsyncStorage data to be profile-aware
 */
export async function restructureExistingData(deviceId: string): Promise<void> {
  try {
    console.log('Starting data restructuring for device:', deviceId);
    
    // Create profile-specific storage keys
    const profileKeys = {
      DAILY_GOALS: `profile_${deviceId}_daily_goals`,
      GOAL_STATS: `profile_${deviceId}_goal_stats`,
      ARTICLES: `profile_${deviceId}_articles`,
    };

    // Migrate daily goals
    const legacyGoals = await AsyncStorage.getItem(STORAGE_KEYS.LEGACY_DAILY_GOALS);
    if (legacyGoals) {
      await AsyncStorage.setItem(profileKeys.DAILY_GOALS, legacyGoals);
      console.log('Migrated daily goals to profile structure');
    }

    // Migrate goal stats
    const legacyStats = await AsyncStorage.getItem(STORAGE_KEYS.LEGACY_GOAL_STATS);
    if (legacyStats) {
      await AsyncStorage.setItem(profileKeys.GOAL_STATS, legacyStats);
      console.log('Migrated goal stats to profile structure');
    }

    // Migrate articles
    const legacyArticles = await AsyncStorage.getItem(STORAGE_KEYS.LEGACY_ARTICLES);
    if (legacyArticles) {
      await AsyncStorage.setItem(profileKeys.ARTICLES, legacyArticles);
      console.log('Migrated articles to profile structure');
    }

    console.log('Data restructuring completed successfully');
  } catch (error) {
    console.error('Data restructuring error:', error);
    throw new Error('Failed to restructure existing data');
  }
}

/**
 * Gets profile-specific storage key for a given data type
 */
export function getProfileStorageKey(deviceId: string, dataType: string): string {
  return `profile_${deviceId}_${dataType}`;
}

/**
 * Cleans up legacy storage keys after successful migration
 */
export async function cleanupLegacyStorage(): Promise<void> {
  try {
    console.log('Cleaning up legacy storage keys...');
    
    // Remove legacy keys after confirming migration was successful
    await AsyncStorage.removeItem(STORAGE_KEYS.LEGACY_DAILY_GOALS);
    await AsyncStorage.removeItem(STORAGE_KEYS.LEGACY_GOAL_STATS);
    await AsyncStorage.removeItem(STORAGE_KEYS.LEGACY_ARTICLES);
    
    console.log('Legacy storage cleanup completed');
  } catch (error) {
    console.error('Legacy storage cleanup error:', error);
    // Don't throw error for cleanup - it's not critical
  }
}

/**
 * Checks if data restructuring is needed
 */
export async function needsDataRestructuring(): Promise<boolean> {
  try {
    // Check if legacy keys exist
    const legacyGoals = await AsyncStorage.getItem(STORAGE_KEYS.LEGACY_DAILY_GOALS);
    const legacyStats = await AsyncStorage.getItem(STORAGE_KEYS.LEGACY_GOAL_STATS);
    const legacyArticles = await AsyncStorage.getItem(STORAGE_KEYS.LEGACY_ARTICLES);
    
    return !!(legacyGoals || legacyStats || legacyArticles);
  } catch (error) {
    console.error('Error checking data restructuring needs:', error);
    return false;
  }
}