import React, { useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity, Animated, AccessibilityInfo } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGoalsStore } from '../store/goalsStore';
import { formatDate } from '../utils/goalUtils';
import { colors, typography, layout, shadows, animation } from '../constants/theme';

const GOAL_ICONS = {
  exercise: 'run',
  cognitive: 'brain',
  social: 'account-group',
  sleep: 'sleep',
  diet: 'food-apple',
} as const;

const GOAL_LABELS = {
  exercise: 'Exercise',
  cognitive: 'Brain',
  social: 'Social',
  sleep: 'Sleep',
  diet: 'Diet',
} as const;

interface WeeklyCalendarProps {
  style?: ViewStyle;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ style }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detailsAnim] = useState(new Animated.Value(0));

  // Subscribe to both the getGoalByDate function and the entire dailyGoals array
  // This ensures we re-render when any goal is updated
  const getGoalByDate = useGoalsStore((state) => state.getGoalByDate);
  const dailyGoals = useGoalsStore((state) => state.dailyGoals);

  const handleDayPress = (date: string) => {
    if (selectedDate === date) {
      // Animate out
      Animated.timing(detailsAnim, {
        toValue: 0,
        duration: animation.short,
        useNativeDriver: false,
      }).start(() => {
        setSelectedDate(null);
        AccessibilityInfo.announceForAccessibility('Details view closed');
      });
    } else {
      setSelectedDate(date);
      // Animate in
      Animated.timing(detailsAnim, {
        toValue: 1,
        duration: animation.short,
        useNativeDriver: false,
      }).start(() => {
        const selectedDay = days.find(d => d.date === date);
        if (selectedDay) {
          const message = `Showing details for ${selectedDay.dayName}. ${Math.round(selectedDay.percentage)}% of goals completed.`;
          AccessibilityInfo.announceForAccessibility(message);
        }
      });
    }
  };

  // Generate last 7 days
  const getDayData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = formatDate(date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const goal = getGoalByDate(formattedDate);
      
      const completedGoals = goal
        ? Object.entries(goal)
            .filter(([key, value]) => 
              ['exercise', 'cognitive', 'social', 'sleep', 'diet'].includes(key) && value === true
            ).length
        : 0;
      
      const percentage = (completedGoals / 5) * 100;
      
      days.push({
        date: formattedDate,
        dayName,
        percentage,
        goals: goal ? {
          exercise: goal.exercise,
          cognitive: goal.cognitive,
          social: goal.social,
          sleep: goal.sleep,
          diet: goal.diet,
        } : null,
      });
    }
    return days;
  };

  const days = getDayData();

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Weekly Overview</Text>
      <View style={styles.daysContainer}>
        {days.map((day) => (
                <TouchableOpacity
        key={day.date}
        style={[styles.dayColumn, { minHeight: layout.touchableMinHeight }]}
        onPress={() => handleDayPress(day.date)}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${day.dayName}, ${Math.round(day.percentage)}% complete`}
        accessibilityHint={selectedDate === day.date ? "Double tap to hide details" : "Double tap to show details"}
        accessibilityState={{
          selected: selectedDate === day.date,
        }}
      >
        <Text style={[
          styles.dayText,
          selectedDate === day.date && styles.selectedDayText
        ]}>{day.dayName}</Text>
        <View style={styles.barContainer}>
          <View 
            style={[
              styles.bar,
              { height: `${day.percentage}%` },
              day.percentage > 0 && styles.activeBar,
              selectedDate === day.date && styles.selectedBar,
            ]} 
          />
        </View>
        <Text style={[
          styles.percentageText,
          selectedDate === day.date && styles.selectedText
        ]}>{Math.round(day.percentage)}%</Text>
        
        {selectedDate === day.date && day.goals && (
          <Animated.View style={[
            styles.detailsContainer,
            {
              opacity: detailsAnim,
              transform: [{
                translateY: detailsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                })
              }]
            }
          ]}>
            {Object.entries(GOAL_ICONS).map(([key, icon]) => (
              <View key={key} style={styles.goalIcon}>
                <View style={styles.goalIconContainer}>
                  <MaterialCommunityIcons
                    name={icon}
                    size={16}
                    color={day.goals?.[key as keyof typeof GOAL_ICONS] ? colors.primary : colors.text.disabled}
                  />
                  {day.goals?.[key as keyof typeof GOAL_ICONS] && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={14}
                      color={colors.primary}
                      style={styles.checkIcon}
                    />
                  )}
                </View>
                <Text style={[
                  styles.goalLabel,
                  day.goals?.[key as keyof typeof GOAL_ICONS] && styles.completedGoalLabel
                ]}>
                  {GOAL_LABELS[key as keyof typeof GOAL_LABELS]}
                </Text>
              </View>
            ))}
          </Animated.View>
        )}
      </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    position: 'absolute',
    bottom: '100%',
    left: -50,
    right: -50,
    backgroundColor: colors.background.primary,
    padding: layout.containerPadding,
    borderRadius: layout.borderRadius.md,
    ...shadows.medium,
    zIndex: 1,
    marginBottom: layout.touchableGap,
  },
  goalIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: layout.touchableGap / 2,
    minHeight: layout.touchableMinHeight * 0.75,
  },
  goalIconContainer: {
    width: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkIcon: {
    marginLeft: -6,
    marginTop: -6,
  },
  goalLabel: {
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    marginLeft: layout.touchableGap,
  },
  completedGoalLabel: {
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  selectedDayText: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  selectedBar: {
    backgroundColor: colors.primaryDark,
  },
  container: {
    padding: layout.containerPadding,
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.lg,
    ...shadows.small,
  },
  title: {
    fontSize: typography.sizes.subtitle,
    fontWeight: typography.weights.bold,
    marginBottom: layout.containerPadding,
    color: colors.text.primary,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
    minWidth: layout.touchableMinWidth,
  },
  dayText: {
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
    marginBottom: layout.touchableGap,
    fontWeight: typography.weights.medium,
  },
  barContainer: {
    height: 100,
    width: layout.touchableGap,
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.sm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.sm,
  },
  activeBar: {
    backgroundColor: colors.primary,
  },
  percentageText: {
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
    marginTop: layout.touchableGap / 2,
    fontWeight: typography.weights.medium,
  },
});
