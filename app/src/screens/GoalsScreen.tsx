import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoalCheckbox } from '../components/GoalCheckbox';
import type { GoalIcon } from '../components/GoalCheckbox';
import { HelpButton } from '../components/HelpButton';
import { GoalDetailModal } from '../components/GoalDetailModal';
import { useGoalsStore } from '../store/goalsStore';
import { createEmptyGoal, formatDate, getWeekDateRange, calculateWeeklyExerciseTotal } from '../utils/goalUtils';
import { DietRating } from '../types/goals';

const GOAL_ICONS = {
  exercise: 'run',
  cognitive: 'brain',
  social: 'account-group',
  sleep: 'sleep',
  diet: 'food-apple',
};

const GOAL_LABELS = {
  exercise: 'Exercised for 30 minutes',
  cognitive: 'Challenged my brain',
  social: 'Did a social activity',
  sleep: 'Got a good nights sleep',
  diet: 'Ate healthy meals',
};

const GOAL_DESCRIPTIONS = {
  exercise: 'This can be going for a walk, doing some light weight lifting, swimming, gardening, or dancing to your favorite music.',
  cognitive: 'This can be doing a crossword puzzle, reading a book, learning something new, playing cards, or trying a new recipe.',
  social: 'This can be calling a friend or family member, attending a group activity, volunteering, visiting a neighbor, or joining a club.',
  sleep: 'This means getting 7-9 hours of quality sleep. Try going to bed and waking up at the same time each day.',
  diet: 'This can be eating fruits and vegetables, choosing whole grains, drinking plenty of water, and limiting processed foods and sugary drinks.',
};

type GoalType = 'exercise' | 'cognitive' | 'social' | 'diet' | 'sleep';

export const GoalsScreen = () => {
  const { addGoal, updateGoal, getGoalByDate, getWeeklyGoals } = useGoalsStore();
  const [currentDate, setCurrentDate] = useState<string>(formatDate(new Date()));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoalType, setSelectedGoalType] = useState<GoalType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const todayGoal = getGoalByDate(currentDate);

  // Calculate weekly exercise total for progress tracking
  const { start } = getWeekDateRange(new Date());
  const weeklyGoals = getWeeklyGoals(start);
  const weeklyExerciseTotal = calculateWeeklyExerciseTotal(weeklyGoals);

  useEffect(() => {
    if (!todayGoal) {
      // Create today's goal if it doesn't exist
      addGoal(createEmptyGoal(currentDate));
    }
  }, [todayGoal, addGoal, currentDate]);

  // Auto-reset goals daily by watching for date changes (checks every 60s)
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = formatDate(new Date());
      if (now !== currentDate) {
        setCurrentDate(now);
        const existing = getGoalByDate(now);
        if (!existing) {
          addGoal(createEmptyGoal(now));
        }
      }
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [currentDate, addGoal, getGoalByDate]);

  const handleToggleGoal = (type: GoalType) => {
    if (!todayGoal) return;

    const isCurrentlyChecked = todayGoal[type];

    if (isCurrentlyChecked) {
      // Goal is already checked - open modal in edit mode
      setSelectedGoalType(type);
      setIsEditMode(true);
      setModalVisible(true);
    } else {
      // Goal is not checked - open modal to collect data
      setSelectedGoalType(type);
      setIsEditMode(false);
      setModalVisible(true);
    }
  };

  const handleSaveGoalDetails = (data: {
    exerciseMinutes?: number;
    cognitiveMinutes?: number;
    socialNewPeople?: number;
    dietRating?: DietRating;
    sleepHours?: number;
  }) => {
    if (!todayGoal || !selectedGoalType) return;

    // Mark goal as checked and save the detailed data
    updateGoal(todayGoal.id, {
      [selectedGoalType]: true,
      ...data,
    });

    setModalVisible(false);
    setSelectedGoalType(null);
    setIsEditMode(false);
  };

  const handleCancelGoalDetails = () => {
    setModalVisible(false);
    setSelectedGoalType(null);
    setIsEditMode(false);
  };

  const handleUncheckGoal = () => {
    if (!todayGoal || !selectedGoalType) return;

    // Clear the goal checkbox and all associated data
    updateGoal(todayGoal.id, {
      [selectedGoalType]: false,
      // Clear all related metrics
      ...(selectedGoalType === 'exercise' && { exerciseMinutes: undefined }),
      ...(selectedGoalType === 'cognitive' && { cognitiveMinutes: undefined }),
      ...(selectedGoalType === 'social' && { socialNewPeople: undefined }),
      ...(selectedGoalType === 'diet' && { dietRating: undefined }),
      ...(selectedGoalType === 'sleep' && { sleepHours: undefined }),
    });

    setModalVisible(false);
    setSelectedGoalType(null);
    setIsEditMode(false);
  };

  const getInitialValues = () => {
    if (!todayGoal || !selectedGoalType || !isEditMode) return undefined;

    return {
      exerciseMinutes: todayGoal.exerciseMinutes,
      cognitiveMinutes: todayGoal.cognitiveMinutes,
      socialNewPeople: todayGoal.socialNewPeople,
      dietRating: todayGoal.dietRating,
      sleepHours: todayGoal.sleepHours,
    };
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
          <Text style={styles.title}>Today's Brain Health Goals</Text>
          <Text style={styles.subtitle}>Tap each goal to add details and mark it as complete. Tap again to edit your entry.</Text>
          
          <HelpButton 
            helpText="This page shows your 5 daily brain health goals. Tap any goal to enter details about that activity. You'll be asked for specific information like minutes exercised, hours slept, etc. This helps track your progress over time. Try to complete all 5 goals each day to keep your brain healthy and build a strong streak!"
            style={styles.helpButton}
          />
        </View>
        
        <View style={styles.goalsContainer}>
          {([...Object.keys(GOAL_ICONS)] as Array<GoalType>)
            .sort((a, b) => Number(!!todayGoal?.[a]) - Number(!!todayGoal?.[b]))
            .map((type) => (
            <GoalCheckbox
              key={type}
              label={GOAL_LABELS[type]}
              description={GOAL_DESCRIPTIONS[type]}
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

      {selectedGoalType && (
        <GoalDetailModal
          visible={modalVisible}
          goalType={selectedGoalType}
          isEditMode={isEditMode}
          weeklyExerciseTotal={weeklyExerciseTotal}
          initialValues={getInitialValues()}
          onSave={handleSaveGoalDetails}
          onUncheck={handleUncheckGoal}
          onCancel={handleCancelGoalDetails}
        />
      )}
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
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    lineHeight: 22,
  },
  helpButton: {
    marginBottom: 0,
  },
  goalsContainer: {
    paddingHorizontal: 20,
  },
  infoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
});
