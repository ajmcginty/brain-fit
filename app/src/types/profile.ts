/**
 * Basic profile interface for device-based user identification
 */
export interface BasicProfile {
  deviceId: string;
  createdAt: string;
  lastActive: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
}

/**
 * Device information for unique identification
 */
export interface DeviceInfo {
  deviceId: string;
  createdAt: string;
}

/**
 * Profile store state interface
 */
export interface ProfileState {
  profile: BasicProfile | null;
  isLoading: boolean;
  error: Error | null;
}
