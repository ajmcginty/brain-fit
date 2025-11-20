import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { initializeGoalsStore } from './src/store/goalsStore';
import { initializeArticleStore } from './src/store/articleStore';
import { useProfileStore } from './src/store/profileStore';
import { useAuthStore } from './src/store/authStore';
import { LoadingScreen } from './src/components/LoadingScreen';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { loadProfile } = useProfileStore();
  const { initialize: initializeAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('[App] Starting initialization...');
        
        // Initialize auth store (sets up Firebase auth listener)
        initializeAuth();
        
        setIsInitialized(true);
        console.log('[App] App initialization complete');
      } catch (err) {
        console.error('[App] Error initializing app:', err);
        setIsInitialized(true);
      }
    };
    
    initializeApp();
  }, []);

  // Load user-specific data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('[App] User authenticated, loading user data...');
      
      const loadUserData = async () => {
        try {
          // Get Firebase UID and initialize storage with it
          const { user } = useAuthStore.getState();
          if (user?.uid) {
            console.log('[App] Initializing storage for user:', user.uid);
            const { initializeProfileStorage } = await import('./src/services/storage');
            initializeProfileStorage(user.uid);
          }
          
          await loadProfile();
          await Promise.all([
            initializeGoalsStore(),
            initializeArticleStore(),
          ]);
          console.log('[App] User data loaded successfully');
        } catch (error) {
          console.error('[App] Error loading user data:', error);
        }
      };
      
      loadUserData();
    }
  }, [isAuthenticated]);

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <SafeAreaProvider>
        <LoadingScreen />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}