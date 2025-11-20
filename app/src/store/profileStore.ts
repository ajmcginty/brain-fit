import { create } from 'zustand';
import { BasicProfile, ProfileState } from '../types/profile';
import {
  createProfile,
  getProfile,
  updateProfile,
  validateProfileIntegrity,
  recoverProfile,
  restructureExistingData,
  needsDataRestructuring,
  cleanupLegacyStorage,
} from '../services/profileService';

interface ProfileStore extends ProfileState {
  initializeProfile: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateProfileData: (updates: Partial<BasicProfile>) => Promise<void>;
  validateProfile: () => Promise<boolean>;
  migrateData: () => Promise<void>;
  recoverFromError: () => Promise<void>;
  reset: () => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  initializeProfile: async () => {
    console.log('Initializing profile...');
    try {
      set({ isLoading: true, error: null });
      
      // Check if data restructuring is needed
      const needsRestructuring = await needsDataRestructuring();
      if (needsRestructuring) {
        console.log('Data restructuring needed, will migrate after profile creation');
      }
      
      const profile = await createProfile();
      console.log('Profile initialized:', profile);
      
      // Note: Storage is initialized with Firebase UID in App.tsx
      
      // If restructuring is needed, do it now
      if (needsRestructuring) {
        console.log('Starting data restructuring...');
        await restructureExistingData(profile.deviceId);
        console.log('Data restructuring completed');
      }
      
      set({ profile, isLoading: false });
    } catch (error) {
      console.error('Profile initialization error:', error);
      set({ 
        error: error instanceof Error ? error : new Error('Failed to initialize profile'),
        isLoading: false 
      });
    }
  },

  loadProfile: async () => {
    console.log('Loading profile...');
    try {
      set({ isLoading: true, error: null });
      const profile = await getProfile();
      console.log('Loaded profile:', profile);
      
      if (!profile) {
        console.log('No profile found, creating new one...');
        // If no profile exists, create one
        const newProfile = await createProfile();
        console.log('New profile created:', newProfile);
        
        // Note: Storage is initialized with Firebase UID in App.tsx
        
        set({ profile: newProfile, isLoading: false });
        return;
      }

      // Validate profile integrity
      const isValid = await validateProfileIntegrity(profile);
      if (!isValid) {
        console.log('Profile validation failed, attempting recovery...');
        const recoveredProfile = await recoverProfile();
        if (recoveredProfile) {
          console.log('Profile recovered successfully');
          
          // Note: Storage is initialized with Firebase UID in App.tsx
          
          set({ profile: recoveredProfile, isLoading: false });
          return;
        } else {
          throw new Error('Profile validation failed and recovery unsuccessful');
        }
      }

      // Note: Storage is initialized with Firebase UID in App.tsx
      
      set({ profile, isLoading: false });
    } catch (error) {
      console.error('Profile loading error:', error);
      set({ 
        error: error instanceof Error ? error : new Error('Failed to load profile'),
        isLoading: false 
      });
    }
  },

  updateProfileData: async (updates: Partial<BasicProfile>) => {
    console.log('Updating profile with:', updates);
    try {
      set({ isLoading: true, error: null });
      const updatedProfile = await updateProfile(updates);
      console.log('Profile updated:', updatedProfile);
      set({ profile: updatedProfile, isLoading: false });
    } catch (error) {
      console.error('Profile update error:', error);
      set({ 
        error: error instanceof Error ? error : new Error('Failed to update profile'),
        isLoading: false 
      });
    }
  },

  validateProfile: async () => {
    const { profile } = get();
    if (!profile) {
      return false;
    }
    
    try {
      const isValid = await validateProfileIntegrity(profile);
      if (!isValid) {
        set({ error: new Error('Profile validation failed') });
      }
      return isValid;
    } catch (error) {
      console.error('Profile validation error:', error);
      set({ error: error instanceof Error ? error : new Error('Profile validation failed') });
      return false;
    }
  },

  migrateData: async () => {
    const { profile } = get();
    if (!profile) {
      throw new Error('No profile available for data migration');
    }

    try {
      set({ isLoading: true, error: null });
      console.log('Starting data migration for profile:', profile.deviceId);
      
      await restructureExistingData(profile.deviceId);
      
      // Clean up legacy storage after successful migration
      await cleanupLegacyStorage();
      
      console.log('Data migration completed successfully');
      set({ isLoading: false });
    } catch (error) {
      console.error('Data migration error:', error);
      set({ 
        error: error instanceof Error ? error : new Error('Data migration failed'),
        isLoading: false 
      });
      throw error;
    }
  },

  recoverFromError: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log('Attempting profile recovery...');
      
      const recoveredProfile = await recoverProfile();
      if (recoveredProfile) {
        console.log('Profile recovered successfully');
        set({ profile: recoveredProfile, isLoading: false, error: null });
      } else {
        throw new Error('Profile recovery unsuccessful');
      }
    } catch (error) {
      console.error('Profile recovery error:', error);
      set({ 
        error: error instanceof Error ? error : new Error('Profile recovery failed'),
        isLoading: false 
      });
      throw error;
    }
  },

  // Reset store (for logout)
  reset: () => {
    console.log('[profileStore] Resetting store');
    set({
      profile: null,
      isLoading: false,
      error: null,
    });
  },
}));