import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { DietRating } from '../types/goals';

type GoalType = 'exercise' | 'cognitive' | 'social' | 'diet' | 'sleep';

interface GoalDetailModalProps {
  visible: boolean;
  goalType: GoalType;
  isEditMode?: boolean;
  weeklyExerciseTotal?: number; // Total exercise minutes for the current week
  initialValues?: {
    exerciseMinutes?: number;
    cognitiveMinutes?: number;
    socialNewPeople?: number;
    dietRating?: DietRating;
    sleepHours?: number;
  };
  onSave: (data: {
    exerciseMinutes?: number;
    cognitiveMinutes?: number;
    socialNewPeople?: number;
    dietRating?: DietRating;
    sleepHours?: number;
  }) => void;
  onUncheck?: () => void;
  onCancel: () => void;
}

const DIET_RATINGS: { value: DietRating; label: string; emoji: string }[] = [
  { value: 1, label: 'Poor', emoji: '⭐' },
  { value: 2, label: 'Fair', emoji: '⭐⭐' },
  { value: 3, label: 'Good', emoji: '⭐⭐⭐' },
  { value: 4, label: 'Very Good', emoji: '⭐⭐⭐⭐' },
  { value: 5, label: 'Excellent', emoji: '⭐⭐⭐⭐⭐' },
];

const GOAL_TITLES: Record<GoalType, string> = {
  exercise: 'Exercise Details',
  cognitive: 'Brain Challenge Details',
  social: 'Social Activity Details',
  diet: 'Diet Quality',
  sleep: 'Sleep Details',
};

const GOAL_DESCRIPTIONS: Record<GoalType, string> = {
  exercise: 'How many minutes did you exercise today? (Aim for 150 minutes per week)',
  cognitive: 'How many minutes did you spend on new or challenging activities?',
  social: 'How many new people outside your household did you interact with?',
  diet: 'How would you rate your diet today?',
  sleep: 'How many hours did you sleep last night?',
};

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({
  visible,
  goalType,
  isEditMode = false,
  weeklyExerciseTotal = 0,
  initialValues,
  onSave,
  onUncheck,
  onCancel,
}) => {
  const [exerciseMinutes, setExerciseMinutes] = useState<string>('');
  const [cognitiveMinutes, setCognitiveMinutes] = useState<string>('');
  const [socialNewPeople, setSocialNewPeople] = useState<string>('');
  const [dietRating, setDietRating] = useState<DietRating | null>(null);
  const [sleepHours, setSleepHours] = useState<string>('');

  // Reset form when modal opens or goal type changes
  useEffect(() => {
    if (visible) {
      if (initialValues) {
        // Edit mode - populate with existing values
        setExerciseMinutes(initialValues.exerciseMinutes?.toString() || '');
        setCognitiveMinutes(initialValues.cognitiveMinutes?.toString() || '');
        setSocialNewPeople(initialValues.socialNewPeople?.toString() || '');
        setDietRating(initialValues.dietRating || null);
        setSleepHours(initialValues.sleepHours?.toString() || '');
      } else {
        // New entry mode - reset to empty
        setExerciseMinutes('');
        setCognitiveMinutes('');
        setSocialNewPeople('');
        setDietRating(null);
        setSleepHours('');
      }
    }
  }, [visible, goalType, initialValues]);

  const isFormValid = (): boolean => {
    switch (goalType) {
      case 'exercise':
        return exerciseMinutes.trim() !== '' && Number(exerciseMinutes) >= 0;
      case 'cognitive':
        return cognitiveMinutes.trim() !== '' && Number(cognitiveMinutes) >= 0;
      case 'social':
        return socialNewPeople.trim() !== '' && Number(socialNewPeople) >= 0;
      case 'diet':
        return dietRating !== null;
      case 'sleep':
        return sleepHours.trim() !== '' && Number(sleepHours) >= 0 && Number(sleepHours) <= 24;
      default:
        return false;
    }
  };

  const handleSave = () => {
    if (!isFormValid()) {
      Alert.alert('Invalid Input', 'Please fill in all required fields with valid values.');
      return;
    }

    const data: any = {};

    switch (goalType) {
      case 'exercise':
        data.exerciseMinutes = Number(exerciseMinutes);
        break;
      case 'cognitive':
        data.cognitiveMinutes = Number(cognitiveMinutes);
        break;
      case 'social':
        data.socialNewPeople = Number(socialNewPeople);
        break;
      case 'diet':
        data.dietRating = dietRating;
        break;
      case 'sleep':
        data.sleepHours = Number(sleepHours);
        break;
    }

    onSave(data);
  };

  const handleUncheck = () => {
    Alert.alert(
      'Uncheck Goal',
      'Are you sure you want to uncheck this goal? All data for this goal will be cleared.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Uncheck',
          style: 'destructive',
          onPress: () => {
            if (onUncheck) {
              onUncheck();
            }
          },
        },
      ]
    );
  };

  const renderInput = () => {
    switch (goalType) {
      case 'exercise':
        const currentExercise = isEditMode && initialValues?.exerciseMinutes 
          ? weeklyExerciseTotal - initialValues.exerciseMinutes 
          : weeklyExerciseTotal;
        const remaining = 150 - currentExercise;
        const newTotal = currentExercise + (Number(exerciseMinutes) || 0);
        const newRemaining = 150 - newTotal;
        
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Minutes Exercised *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 30"
              keyboardType="numeric"
              value={exerciseMinutes}
              onChangeText={setExerciseMinutes}
              returnKeyType="done"
            />
            <View style={styles.exerciseProgressContainer}>
              <Text style={styles.hint}>Weekly Goal: 150 minutes</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${Math.min((newTotal / 150) * 100, 100)}%`,
                      backgroundColor: newTotal >= 150 ? '#4caf50' : '#2196f3',
                    }
                  ]} 
                />
              </View>
              {newTotal >= 150 ? (
                <Text style={styles.goalMetText}>
                  🎉 Goal met! {newTotal} minutes this week
                </Text>
              ) : (
                <Text style={styles.remainingText}>
                  {newRemaining > 0 ? `${newRemaining} minutes remaining` : 'Goal met!'} ({newTotal}/150 this week)
                </Text>
              )}
            </View>
          </View>
        );

      case 'cognitive':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Minutes on New Activities *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 20"
              keyboardType="numeric"
              value={cognitiveMinutes}
              onChangeText={setCognitiveMinutes}
              returnKeyType="done"
            />
          </View>
        );

      case 'social':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New People Interacted With *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 2"
              keyboardType="numeric"
              value={socialNewPeople}
              onChangeText={setSocialNewPeople}
              returnKeyType="done"
            />
            <Text style={styles.hint}>Outside your typical household</Text>
          </View>
        );

      case 'diet':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Rate Your Diet Today *</Text>
            <View style={styles.ratingContainer}>
              {DIET_RATINGS.map((rating) => (
                <TouchableOpacity
                  key={rating.value}
                  style={[
                    styles.ratingButton,
                    dietRating === rating.value && styles.ratingButtonSelected,
                  ]}
                  onPress={() => setDietRating(rating.value)}
                >
                  <Text style={styles.ratingEmoji}>{rating.emoji}</Text>
                  <Text
                    style={[
                      styles.ratingLabel,
                      dietRating === rating.value && styles.ratingLabelSelected,
                    ]}
                  >
                    {rating.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'sleep':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hours Slept Last Night *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 7.5"
              keyboardType="decimal-pad"
              value={sleepHours}
              onChangeText={setSleepHours}
              returnKeyType="done"
            />
            <Text style={styles.hint}>Recommended: 7-9 hours</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <ScrollView 
                  style={styles.scrollView} 
                  contentContainerStyle={styles.scrollContentContainer}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <Text style={styles.title}>{GOAL_TITLES[goalType]}</Text>
                  <Text style={styles.description}>{GOAL_DESCRIPTIONS[goalType]}</Text>

                  {renderInput()}

                  <Text style={styles.requiredNote}>* Required field</Text>
                </ScrollView>

                {/* Uncheck button for edit mode */}
                {isEditMode && onUncheck && (
                  <TouchableOpacity
                    style={styles.uncheckButton}
                    onPress={handleUncheck}
                  >
                    <Text style={styles.uncheckButtonText}>✕ Uncheck Goal & Clear Data</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onCancel}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.saveButton,
                      !isFormValid() && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={!isFormValid()}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 24,
    paddingBottom: 20,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollView: {
    paddingHorizontal: 24,
    maxHeight: '100%',
  },
  scrollContentContainer: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  hint: {
    fontSize: 14,
    color: '#999',
    marginTop: 6,
    fontStyle: 'italic',
  },
  exerciseProgressContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  remainingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  goalMetText: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '700',
    textAlign: 'center',
  },
  ratingContainer: {
    gap: 12,
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  ratingButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  ratingEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  ratingLabelSelected: {
    color: '#2196f3',
    fontWeight: '700',
  },
  requiredNote: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  uncheckButton: {
    marginHorizontal: 24,
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: '#ffebee',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ef5350',
    alignItems: 'center',
  },
  uncheckButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d32f2f',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#4caf50',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

