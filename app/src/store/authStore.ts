import { create } from 'zustand';
import { signOut as firebaseSignOut, subscribeAuth, getCurrentUser } from '../services/cloudAuth';

export interface User {
  uid: string;
  email: string;
  name?: string;
  displayName?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
  clearError: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  
  setUser: (user: User | null) => {
    console.log('[authStore] Setting user:', user?.uid || 'null');
    set({ 
      user, 
      isAuthenticated: !!user,
      error: null,
      isLoading: false,
    });
  },
  
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  
  setLoading: (value: boolean) => set({ isLoading: value }),
  
  setError: (error: string | null) => set({ error, isLoading: false }),
  
  clearError: () => set({ error: null }),
  
  logout: async () => {
    try {
      console.log('[authStore] Logging out');
      await firebaseSignOut();
      set({ user: null, isAuthenticated: false, error: null });
      console.log('[authStore] Logout successful');
    } catch (error) {
      console.error('[authStore] Logout error:', error);
      set({ error: 'Failed to sign out. Please try again.' });
      throw error;
    }
  },
  
  initialize: () => {
    console.log('[authStore] Initializing auth state listener');
    
    // Check if there's already a current user (from Firebase persistence)
    const currentUser = getCurrentUser();
    if (currentUser) {
      console.log('[authStore] Found existing Firebase user:', currentUser.uid);
      const user: User = {
        uid: currentUser.uid,
        email: currentUser.email!,
        name: currentUser.displayName || undefined,
      };
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
    
    // Subscribe to auth state changes
    subscribeAuth((firebaseUser) => {
      if (firebaseUser) {
        console.log('[authStore] Auth state changed: user logged in:', firebaseUser.uid);
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || undefined,
        };
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        console.log('[authStore] Auth state changed: user logged out');
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },
}));
