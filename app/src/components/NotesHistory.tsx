import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useGoalsStore } from '../store/goalsStore';
import { DailyGoal } from '../types/goals';

interface NotesHistoryProps {
  visible: boolean;
  onClose: () => void;
}

export const NotesHistory: React.FC<NotesHistoryProps> = ({ visible, onClose }) => {
  const dailyGoals = useGoalsStore((state) => state.dailyGoals);

  // Filter goals with notes and sort by date (most recent first)
  const goalsWithNotes = dailyGoals
    .filter((goal) => goal.notes && goal.notes.trim().length > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderNoteCard = (goal: DailyGoal) => {
    const completedGoals = ['exercise', 'cognitive', 'social', 'sleep', 'diet'].filter(
      (key) => goal[key as keyof DailyGoal]
    );

    return (
      <View key={goal.id} style={styles.noteCard}>
        <Text style={styles.dateText}>{formatDate(goal.date)}</Text>
        <Text style={styles.noteText}>{goal.notes}</Text>
        <View style={styles.goalsContainer}>
          {completedGoals.map((goalName) => (
            <View key={goalName} style={styles.goalTag}>
              <Text style={styles.goalTagText}>
                {goalName.charAt(0).toUpperCase() + goalName.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Notes History</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          {goalsWithNotes.length > 0 ? (
            <ScrollView style={styles.scrollView}>
              {goalsWithNotes.map(renderNoteCard)}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No notes yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add notes to your daily goals to see them here
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  noteCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  goalTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  goalTagText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
