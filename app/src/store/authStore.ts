import { create } from 'zustand';
import { AuthState, User } from '../types/store';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user: User | null) => set({ user }),
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
