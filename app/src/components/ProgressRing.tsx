import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated, AccessibilityInfo } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Easing } from 'react-native';
import { colors, typography, animation } from '../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

import { useGoalsStore } from '../store/goalsStore';
import { formatDate } from '../utils/goalUtils';
import { DailyGoal } from '../types/goals';

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  style?: ViewStyle;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  size = 200,
  strokeWidth = 20,
  style,
}) => {
  const today = formatDate(new Date());
  const todayGoal = useGoalsStore((state) => {
    // Subscribe to the entire goals array to catch updates
    state.dailyGoals;
    return state.getGoalByDate(today);
  });

  // Calculate completion percentage
  const totalGoals = 5; // Exercise, Cognitive, Social, Sleep, Diet
  const completedGoals = todayGoal
    ? Object.entries(todayGoal)
        .filter(([key, value]) => 
          ['exercise', 'cognitive', 'social', 'sleep', 'diet'].includes(key) && value === true
        ).length
    : 0;
  const percentage = (completedGoals / totalGoals) * 100;

  // SVG calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Animation setup
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const prevPercentage = useRef(percentage);

  useEffect(() => {
    // Only animate if the percentage has changed
    if (prevPercentage.current !== percentage) {
      Animated.timing(progressAnimation, {
        toValue: percentage,
        duration: animation.medium,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }).start();
      prevPercentage.current = percentage;

      // Announce progress change to screen readers
      const message = `Progress updated to ${Math.round(percentage)}%. ${completedGoals} out of ${totalGoals} goals completed today.`;
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, [percentage, completedGoals]);

  // Convert the animated value to strokeDashoffset
  const strokeDashoffset = progressAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View 
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={`Daily progress ring showing ${Math.round(percentage)}% completion`}
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(percentage),
      }}
      accessibilityHint="Shows your progress in completing today's goals"
    >
      <Animated.View style={{ transform: [{ rotate: '-90deg' }] }}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.background.secondary}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.primary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
      <View style={styles.textContainer}>
        <Text 
          style={styles.percentageText}
          accessibilityRole="text"
        >
          {Math.round(percentage)}%
        </Text>
        <Text 
          style={styles.label}
          accessibilityRole="text"
        >
          Today's Progress
        </Text>
        <Text 
          style={styles.completionText}
          accessibilityRole="text"
        >
          {completedGoals} of {totalGoals} goals
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  percentageText: {
    fontSize: typography.sizes.heading,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  label: {
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    marginTop: 4,
    fontWeight: typography.weights.medium,
  },
  completionText: {
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
    marginTop: 8,
  },
});
