import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoalCheckbox } from '../components/GoalCheckbox';
import type { GoalIcon } from '../components/GoalCheckbox';
import { useGoalsStore } from '../store/goalsStore';
import { createEmptyGoal, formatDate } from '../utils/goalUtils';

const GOAL_ICONS = {
  exercise: 'run',
  cognitive: 'brain',
  social: 'account-group',
  sleep: 'sleep',
  diet: 'food-apple',
};

const GOAL_LABELS = {
  exercise: 'Physical Exercise',
  cognitive: 'Brain Training',
  social: 'Social Activity',
  sleep: 'Quality Sleep',
  diet: 'Healthy Diet',
};

export const GoalsScreen = () => {
  const { addGoal, updateGoal, getGoalByDate } = useGoalsStore();
  const today = formatDate(new Date());
  const todayGoal = getGoalByDate(today);

  useEffect(() => {
    if (!todayGoal) {
      // Create today's goal if it doesn't exist
      addGoal(createEmptyGoal(today));
    }
  }, [todayGoal, addGoal, today]);

  const handleToggleGoal = (type: keyof typeof GOAL_ICONS) => {
    if (!todayGoal) return;
    updateGoal(todayGoal.id, {
      [type]: !todayGoal[type],
    });
  };

  if (!todayGoal) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Today's Goals</Text>
          <Text style={styles.subtitle}>Track your daily wellness activities</Text>
        </View>
        
        <View style={styles.goalsContainer}>
          {(Object.keys(GOAL_ICONS) as Array<keyof typeof GOAL_ICONS>).map((type) => (
            <GoalCheckbox
              key={type}
              label={GOAL_LABELS[type]}
              isChecked={todayGoal[type]}
              onToggle={() => handleToggleGoal(type)}
              icon={GOAL_ICONS[type] as GoalIcon}
            />
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Complete all 5 activities to maintain your streak!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  goalsContainer: {
    paddingHorizontal: 20,
  },
  infoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
