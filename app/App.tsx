import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { initializeGoalsStore } from './src/store/goalsStore';
import { initializeArticleStore } from './src/store/articleStore';
import { useProfileStore } from './src/store/profileStore';
import { LoadingScreen } from './src/components/LoadingScreen';
import { ensureAuthWithDevice } from './src/services/cloudAuth';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { loadProfile } = useProfileStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // First, ensure profile is loaded
        console.log('[init] loadProfile: start');
        await loadProfile();
        console.log('[init] loadProfile: done');
        // Ensure authenticated user (anonymous) and upsert profile doc (with timeout)
        const withTimeout = <T,>(p: Promise<T>, ms = 5000) =>
          Promise.race<T>([
            p,
            new Promise<T>((_, rej) => setTimeout(() => rej(new Error('auth timeout')), ms)) as Promise<T>,
          ]);
        console.log('[init] ensureAuthWithDevice: start');
        try {
          await withTimeout(ensureAuthWithDevice(), 5000);
          console.log('[init] ensureAuthWithDevice: done');
        } catch (e) {
          console.warn('[init] ensureAuthWithDevice failed/timeout, continuing offline', e);
        }
        
        // Initialize other stores
        console.log('[init] initialize stores: start');
        await Promise.all([
          initializeGoalsStore(),
          initializeArticleStore(),
        ]);
        console.log('[init] initialize stores: done');

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