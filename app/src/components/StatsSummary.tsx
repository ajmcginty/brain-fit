import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useGoalsStore } from '../store/goalsStore';
import { colors, typography, layout, shadows } from '../constants/theme';

interface StatsSummaryProps {
  style?: ViewStyle;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ style }) => {
  const stats = useGoalsStore((state) => state.stats);
  const streak = useGoalsStore((state) => state.getCurrentStreak());

  return (
    <View 
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel="Goal completion statistics"
    >
      <View 
        style={styles.statCard}
        accessible={true}
        accessibilityLabel={`Current streak: ${streak} days`}
      >
        <Text style={styles.statValue}>{streak}</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View 
        style={styles.statCard}
        accessible={true}
        accessibilityLabel={`Weekly completion rate: ${Math.round(stats.weeklyCompletion)}%`}
      >
        <Text style={styles.statValue}>{Math.round(stats.weeklyCompletion)}%</Text>
        <Text style={styles.statLabel}>Weekly Rate</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View 
        style={styles.statCard}
        accessible={true}
        accessibilityLabel={`Monthly completion rate: ${Math.round(stats.monthlyCompletion)}%`}
      >
        <Text style={styles.statValue}>{Math.round(stats.monthlyCompletion)}%</Text>
        <Text style={styles.statLabel}>Monthly Rate</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.lg,
    padding: layout.containerPadding,
    ...shadows.small,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    minHeight: layout.touchableMinHeight,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: typography.sizes.subtitle,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
    marginTop: layout.touchableGap / 2,
    fontWeight: typography.weights.medium,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.border,
    marginHorizontal: layout.containerPadding,
  },
});
