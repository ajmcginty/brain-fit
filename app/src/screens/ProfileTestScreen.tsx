import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useProfileStore } from '../store/profileStore';
import { colors, spacing, typography } from '../constants/theme';
import { storage } from '../services/storage';
import { INITIAL_ARTICLES } from '../constants/articleLinks';

export function ProfileTestScreen() {
  const { profile, isLoading, error, loadProfile, updateProfileData } = useProfileStore();
  const [localError, setLocalError] = useState<Error | null>(null);

  const handleRefresh = async () => {
    console.log('ProfileTestScreen: Refreshing profile...');
    setLocalError(null);
    try {
      await loadProfile();
      console.log('ProfileTestScreen: Profile refreshed successfully');
    } catch (err) {
      console.error('ProfileTestScreen: Error refreshing profile:', err);
      setLocalError(err instanceof Error ? err : new Error('Failed to refresh profile'));
    }
  };

  const handleToggleTheme = async () => {
    if (!profile || isLoading) return;
    
    console.log('ProfileTestScreen: Toggling theme...');
    try {
      const newTheme = profile.preferences?.theme === 'light' ? 'dark' : 'light';
      await updateProfileData({
        preferences: {
          ...profile.preferences,
          theme: newTheme,
        },
      });
      console.log('ProfileTestScreen: Theme toggled successfully');
    } catch (err) {
      console.error('ProfileTestScreen: Error toggling theme:', err);
      setLocalError(err instanceof Error ? err : new Error('Failed to toggle theme'));
    }
  };

  const handleToggleNotifications = async () => {
    if (!profile || isLoading) return;

    console.log('ProfileTestScreen: Toggling notifications...');
    try {
      const newNotificationsSetting = !profile.preferences?.notifications;
      await updateProfileData({
        preferences: {
          ...profile.preferences,
          notifications: newNotificationsSetting,
        },
      });
      console.log('ProfileTestScreen: Notifications toggled successfully');
    } catch (err) {
      console.error('ProfileTestScreen: Error toggling notifications:', err);
      setLocalError(err instanceof Error ? err : new Error('Failed to toggle notifications'));
    }
  };

  const handleResetArticles = async () => {
    Alert.alert(
      'Reset Articles',
      'This will replace old articles with new article links. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Now',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Resetting articles to new format...');
              await storage.saveArticles(INITIAL_ARTICLES);
              console.log('Articles reset successfully');
              Alert.alert(
                'Success!', 
                'Articles reset! Close Expo Go completely and reopen it, then scan the QR code again.',
                [{ text: 'OK' }]
              );
            } catch (err) {
              console.error('Failed to reset articles:', err);
              Alert.alert('Error', 'Failed to reset articles: ' + (err instanceof Error ? err.message : 'Unknown'));
            }
          },
        },
      ]
    );
  };

  if (isLoading && !profile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const displayError = error || localError;
  if (displayError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {displayError.message}</Text>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>No profile data available</Text>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Profile Test Screen</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>Device ID:</Text>
          <Text style={styles.value}>{profile.deviceId || 'Not set'}</Text>
          
          <Text style={styles.label}>Created At:</Text>
          <Text style={styles.value}>
            {profile.createdAt ? new Date(profile.createdAt).toLocaleString() : 'Not set'}
          </Text>
          
          <Text style={styles.label}>Last Active:</Text>
          <Text style={styles.value}>
            {profile.lastActive ? new Date(profile.lastActive).toLocaleString() : 'Not set'}
          </Text>
          
          <Text style={styles.label}>Theme:</Text>
          <Text style={styles.value}>{profile.preferences?.theme || 'Not set'}</Text>
          
          <Text style={styles.label}>Notifications:</Text>
          <Text style={styles.value}>
            {profile.preferences?.notifications ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleToggleTheme}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Toggle Theme</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleToggleNotifications}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Toggle Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleRefresh}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Refresh Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.warningButton]} 
            onPress={handleResetArticles}
          >
            <Text style={styles.buttonText}>🔄 Reset Articles</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.md,
  },
  section: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.sizes.heading,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  value: {
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  buttonContainer: {
    gap: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  },
  warningButton: {
    backgroundColor: '#f59e0b', // Orange for reset
    marginTop: spacing.md,
  },
  error: {
    color: colors.error,
    fontSize: typography.sizes.body,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  loadingText: {
    color: colors.text.primary,
    fontSize: typography.sizes.body,
    marginTop: spacing.md,
  },
});