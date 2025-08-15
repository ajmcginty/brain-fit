import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { DailyGoal } from '../types/goals';
import { useGoalsStore } from '../store/goalsStore';

interface GoalFormProps {
  initialData?: DailyGoal;
  date: string;
  onSave: (goalData: Omit<DailyGoal, 'id'>) => void;
}

interface GoalToggleProps {
  label: string;
  value: boolean;
  onToggle: () => void;
}

const GoalToggle: React.FC<GoalToggleProps> = ({ label, value, onToggle }) => (
  <TouchableOpacity style={styles.toggleContainer} onPress={onToggle}>
    <View style={[styles.checkbox, value && styles.checkboxChecked]}>
      {value && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.toggleLabel}>{label}</Text>
  </TouchableOpacity>
);

export const GoalForm: React.FC<GoalFormProps> = ({
  initialData,
  date,
  onSave,
}) => {
  const [formData, setFormData] = useState<Omit<DailyGoal, 'id'>>({
    date,
    exercise: initialData?.exercise ?? false,
    cognitive: initialData?.cognitive ?? false,
    social: initialData?.social ?? false,
    sleep: initialData?.sleep ?? false,
    diet: initialData?.diet ?? false,
    notes: initialData?.notes ?? '',
  });

  const { updateGoal } = useGoalsStore();

  const toggleGoal = async (key: keyof Omit<DailyGoal, 'id' | 'date' | 'notes'>) => {
    const newValue = !formData[key];
    
    // Update local state
    setFormData(prev => ({
      ...prev,
      [key]: newValue,
    }));

    // Update store immediately if we have an existing goal
    if (initialData?.id) {
      await updateGoal(initialData.id, {
        [key]: newValue,
      });
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>
        {new Date(date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>

      <View style={styles.goalsContainer}>
        <GoalToggle
          label="Exercise"
          value={formData.exercise}
          onToggle={() => toggleGoal('exercise')}
        />
        <GoalToggle
          label="Cognitive Activity"
          value={formData.cognitive}
          onToggle={() => toggleGoal('cognitive')}
        />
        <GoalToggle
          label="Social Activity"
          value={formData.social}
          onToggle={() => toggleGoal('social')}
        />
        <GoalToggle
          label="Sleep"
          value={formData.sleep}
          onToggle={() => toggleGoal('sleep')}
        />
        <GoalToggle
          label="Healthy Diet"
          value={formData.diet}
          onToggle={() => toggleGoal('diet')}
        />
      </View>

      <Text style={styles.notesLabel}>Notes</Text>
      <TextInput
        style={styles.notesInput}
        multiline
        numberOfLines={4}
        value={formData.notes}
        onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
        placeholder="Add any notes about your goals..."
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Goals</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  goalsContainer: {
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
