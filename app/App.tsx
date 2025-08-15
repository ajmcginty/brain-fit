import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { initializeGoalsStore } from './src/store/goalsStore';
import { initializeArticleStore } from './src/store/articleStore';
import { useProfileStore } from './src/store/profileStore';
import { LoadingScreen } from './src/components/LoadingScreen';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { loadProfile } = useProfileStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // First, ensure profile is loaded
        await loadProfile();
        
        // Initialize other stores
        await Promise.all([
          initializeGoalsStore(),
          initializeArticleStore(),
        ]);

        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing app:', err);
        // Even on error, we should show the app as it might have partial functionality
        setIsInitialized(true);
      }
    };
    
    initializeApp();
  }, []); // Remove dependencies that cause loops

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