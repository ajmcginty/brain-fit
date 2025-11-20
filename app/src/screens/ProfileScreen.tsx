import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useGoalsStore } from '../store/goalsStore';
import { calculateStreak } from '../utils/goalUtils';
import { colors, spacing, typography, layout } from '../constants/theme';

export function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { dailyGoals } = useGoalsStore();
  
  // Calculate user statistics
  const totalGoalsCompleted = dailyGoals.reduce((count, day) => {
    const completedCount = [day.exercise, day.cognitive, day.social, day.sleep, day.diet]
      .filter(Boolean).length;
    return count + completedCount;
  }, 0);
  
  // Calculate current streak (requires all 5 goals to be completed)
  const currentStreak = calculateStreak(dailyGoals);
  const daysActive = dailyGoals.length;
  
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };
  
  const handleContactSupport = () => {
    Linking.openURL('mailto:support@brainfit.app?subject=BrainFit Support Request');
  };
  
  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy would be displayed here or opened in a web view.');
  };
  
  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Terms of service would be displayed here or opened in a web view.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* User Info Section */}
        <View style={styles.section}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons 
                name="account-circle" 
                size={80} 
                color={colors.primary} 
              />
            </View>
            <Text style={styles.userName}>{user?.name || 'BrainFit User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.memberSince}>
              Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* Progress Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statValue}>{currentStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>✓</Text>
                <Text style={styles.statValue}>{totalGoalsCompleted}</Text>
                <Text style={styles.statLabel}>Goals Completed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>📅</Text>
                <Text style={styles.statValue}>{daysActive}</Text>
                <Text style={styles.statLabel}>Days Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons 
                  name="bell-outline" 
                  size={24} 
                  color={colors.text.primary} 
                />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color={colors.text.disabled} 
              />
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons 
                  name="theme-light-dark" 
                  size={24} 
                  color={colors.text.primary} 
                />
                <Text style={styles.settingText}>Appearance</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>Light</Text>
                <MaterialCommunityIcons 
                  name="chevron-right" 
                  size={24} 
                  color={colors.text.disabled} 
                />
              </View>
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons 
                  name="clock-outline" 
                  size={24} 
                  color={colors.text.primary} 
                />
                <Text style={styles.settingText}>Daily Reminders</Text>
              </View>
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color={colors.text.disabled} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handlePrivacyPolicy}
            >
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons 
                  name="shield-check-outline" 
                  size={24} 
                  color={colors.text.primary} 
                />
                <Text style={styles.settingText}>Privacy Policy</Text>
              </View>
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color={colors.text.disabled} 
              />
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleTermsOfService}
            >
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons 
                  name="file-document-outline" 
                  size={24} 
                  color={colors.text.primary} 
                />
                <Text style={styles.settingText}>Terms of Service</Text>
              </View>
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color={colors.text.disabled} 
              />
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleContactSupport}
            >
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons 
                  name="email-outline" 
                  size={24} 
                  color={colors.text.primary} 
                />
                <Text style={styles.settingText}>Contact Support</Text>
              </View>
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color={colors.text.disabled} 
              />
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons 
                  name="information-outline" 
                  size={24} 
                  color={colors.text.primary} 
                />
                <Text style={styles.settingText}>App Version</Text>
              </View>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <MaterialCommunityIcons 
              name="logout" 
              size={20} 
              color={colors.text.inverse} 
            />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.subtitle,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  avatarContainer: {
    marginBottom: spacing.sm,
  },
  userName: {
    fontSize: typography.sizes.heading,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  memberSince: {
    fontSize: typography.sizes.caption,
    color: colors.text.disabled,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    minHeight: layout.touchableMinHeight,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    marginLeft: spacing.md,
    flex: 1,
  },
  settingValue: {
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 24, // Icon size + margin
  },
  signOutButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.touchableMinHeight,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  signOutText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    marginLeft: spacing.sm,
  },
});
