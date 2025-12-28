import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { WeeklySummary, WeekComparison } from '../types/goals';

interface WeeklySummaryModalProps {
  visible: boolean;
  summary: WeeklySummary | null;
  onClose: () => void;
}

const ComparisonCard: React.FC<{
  title: string;
  icon: string;
  currentValue: string;
  comparison?: WeekComparison;
  goalMet?: boolean;
  goalText?: string;
}> = ({ title, icon, currentValue, comparison, goalMet, goalText }) => {
  const renderComparison = () => {
    if (!comparison) {
      return (
        <Text style={styles.firstWeekText}>
          This is your first week! Great start! 🎉
        </Text>
      );
    }

    const { improved, difference } = comparison;
    const arrow = improved ? '↑' : difference < 0 ? '↓' : '→';
    const color = improved ? '#4caf50' : difference < 0 ? '#f44336' : '#999';
    
    let comparisonText = '';
    if (difference === 0) {
      comparisonText = 'Same as last week';
    } else if (improved) {
      comparisonText = `${Math.abs(difference).toFixed(1)} more than last week!`;
    } else {
      comparisonText = `${Math.abs(difference).toFixed(1)} less than last week`;
    }

    return (
      <View style={styles.comparisonRow}>
        <Text style={[styles.comparisonArrow, { color }]}>{arrow}</Text>
        <Text style={[styles.comparisonText, improved && styles.comparisonTextImproved]}>
          {comparisonText}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      
      <Text style={styles.cardValue}>{currentValue}</Text>
      
      {goalText && (
        <View style={[styles.goalBadge, goalMet ? styles.goalBadgeMet : styles.goalBadgeNotMet]}>
          <Text style={styles.goalBadgeText}>
            {goalMet ? '✓ ' : ''}
            {goalText}
          </Text>
        </View>
      )}
      
      {renderComparison()}
    </View>
  );
};

export const WeeklySummaryModal: React.FC<WeeklySummaryModalProps> = ({
  visible,
  summary,
  onClose,
}) => {
  if (!summary) return null;

  const formatDateRange = () => {
    const start = new Date(summary.weekStart);
    const end = new Date(summary.weekEnd);
    
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return `${startStr} - ${endStr}`;
  };

  const getMotivationalMessage = () => {
    const { completionRate, exerciseGoalMet, isFirstWeek } = summary;
    
    if (isFirstWeek) {
      return "Welcome to your brain health journey! Keep building these healthy habits! 🌟";
    }

    if (completionRate === 100) {
      return "Perfect week! You completed all your goals! 🏆";
    } else if (completionRate >= 80) {
      return "Excellent work this week! You're building great habits! 🎉";
    } else if (completionRate >= 60) {
      return "Good progress! Keep pushing yourself! 💪";
    } else if (completionRate >= 40) {
      return "Nice start! Remember, consistency is key! 🌱";
    } else {
      return "Every journey starts somewhere. Keep going! 🚀";
    }
  };

  const getDietRatingLabel = (rating: number): string => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Very Good';
    if (rating >= 2.5) return 'Good';
    if (rating >= 1.5) return 'Fair';
    return 'Needs Improvement';
  };

  const getSleepQuality = (hours: number): string => {
    if (hours >= 7 && hours <= 9) return '✓ Optimal range';
    if (hours >= 6 && hours < 7) return 'Slightly below recommended';
    if (hours > 9) return 'More than recommended';
    return 'Below recommended';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>📊</Text>
            <Text style={styles.headerTitle}>Your Weekly Report</Text>
            <Text style={styles.headerSubtitle}>{formatDateRange()}</Text>
          </View>

          {/* Motivational Message */}
          <View style={styles.motivationCard}>
            <Text style={styles.motivationText}>{getMotivationalMessage()}</Text>
          </View>

          {/* Completion Rate */}
          <View style={styles.completionSection}>
            <Text style={styles.sectionLabel}>Overall Completion</Text>
            <View style={styles.completionBar}>
              <View 
                style={[
                  styles.completionBarFill, 
                  { width: `${summary.completionRate}%` }
                ]} 
              />
            </View>
            <Text style={styles.completionText}>{summary.completionRate}% of daily goals completed</Text>
          </View>

          {/* Metric Cards */}
          <View style={styles.cardsContainer}>
            <ComparisonCard
              title="Exercise"
              icon="🏃"
              currentValue={`${summary.exerciseTotal} minutes`}
              comparison={summary.exerciseComparison}
              goalMet={summary.exerciseGoalMet}
              goalText="Goal: 150 min/week"
            />

            <ComparisonCard
              title="Brain Challenges"
              icon="🧠"
              currentValue={`${summary.cognitiveAverage} min/day average`}
              comparison={summary.cognitiveComparison}
            />

            <ComparisonCard
              title="Social Connections"
              icon="👥"
              currentValue={`${summary.socialTotal} new people`}
              comparison={summary.socialComparison}
            />

            <ComparisonCard
              title="Diet Quality"
              icon="🍎"
              currentValue={`${summary.dietAverage.toFixed(1)}/5 (${getDietRatingLabel(summary.dietAverage)})`}
              comparison={summary.dietComparison}
            />

            <ComparisonCard
              title="Sleep"
              icon="😴"
              currentValue={`${summary.sleepAverage} hours/night average`}
              comparison={summary.sleepComparison}
              goalText={getSleepQuality(summary.sleepAverage)}
            />
          </View>

          {/* Encouragement */}
          <View style={styles.encouragementSection}>
            <Text style={styles.encouragementText}>
              Keep up the great work! Every small step counts toward better brain health. 💪
            </Text>
          </View>
        </ScrollView>

        {/* Close Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#666',
  },
  motivationCard: {
    backgroundColor: '#e3f2fd',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  motivationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1565c0',
    textAlign: 'center',
    lineHeight: 26,
  },
  completionSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  completionBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  completionBarFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 6,
  },
  completionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2196f3',
    marginBottom: 12,
  },
  goalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  goalBadgeMet: {
    backgroundColor: '#e8f5e9',
  },
  goalBadgeNotMet: {
    backgroundColor: '#fff3e0',
  },
  goalBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonArrow: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  comparisonText: {
    fontSize: 16,
    color: '#666',
  },
  comparisonTextImproved: {
    color: '#4caf50',
    fontWeight: '600',
  },
  firstWeekText: {
    fontSize: 16,
    color: '#9c27b0',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  encouragementSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4caf50',
    borderStyle: 'dashed',
  },
  encouragementText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

