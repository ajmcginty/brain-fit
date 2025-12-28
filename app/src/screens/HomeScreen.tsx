import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressRing } from '../components/ProgressRing';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { StatsSummary } from '../components/StatsSummary';
import { HelpButton } from '../components/HelpButton';
import { WeeklySummaryModal } from '../components/WeeklySummaryModal';
import { useGoalsStore } from '../store/goalsStore';
import { getWeekDateRange, formatDate, getPreviousWeekDateRange } from '../utils/goalUtils';
import { WeeklySummary } from '../types/goals';

export const HomeScreen = () => {
  const { isWeeklySummaryAvailable, calculateWeeklySummary, markWeeklySummaryViewed } = useGoalsStore();
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [isSunday, setIsSunday] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Check if it's Sunday
    const checkDay = () => {
      const today = new Date();
      const sunday = today.getDay() === 0;
      setIsSunday(sunday);
    };

    checkDay();
    
    // Check every minute in case day changes
    const interval = setInterval(checkDay, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Pulse animation for the button
    if (isSunday) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isSunday, pulseAnim]);

  const handleViewWeeklyReport = () => {
    // On Sunday, show the PREVIOUS week (last Sunday through last Saturday)
    // This week's Sunday data counts toward the NEW week
    const { start } = getPreviousWeekDateRange();
    
    // Calculate the summary for the previous week
    const summary = calculateWeeklySummary(start);
    setWeeklySummary(summary);
    setShowSummaryModal(true);
    
    // Mark as viewed
    markWeeklySummaryViewed(start);
  };

  const handleCloseSummary = () => {
    setShowSummaryModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Daily Progress</Text>
          <Text style={styles.subtitle}>Track your brain health activities and see how you're doing today</Text>
          
          <HelpButton 
            helpText="This is your home screen where you can see your daily progress at a glance. The circle shows how many of today's 5 goals you've completed. Below that, you'll find your weekly and monthly statistics to track your progress over time. Complete more goals each day to keep your brain healthy!"
            style={styles.helpButton}
          />
        </View>
        
        <View style={styles.progressSection}>
          <ProgressRing size={200} style={styles.progressRing} />
        </View>

        {/* Sunday Weekly Report Button */}
        {isSunday && (
          <Animated.View style={[styles.weeklyReportContainer, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity 
              style={styles.weeklyReportButton}
              onPress={handleViewWeeklyReport}
            >
              <View style={styles.weeklyReportContent}>
                <Text style={styles.weeklyReportEmoji}>📊</Text>
                <View style={styles.weeklyReportTextContainer}>
                  <Text style={styles.weeklyReportTitle}>Your Weekly Report is Ready!</Text>
                  <Text style={styles.weeklyReportSubtitle}>Tap to see your progress this week</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        <StatsSummary style={styles.statsSummary} />
        
        <WeeklyCalendar style={styles.weeklyCalendar} />
      </ScrollView>

      {/* Weekly Summary Modal */}
      <WeeklySummaryModal
        visible={showSummaryModal}
        summary={weeklySummary}
        onClose={handleCloseSummary}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  helpButton: {
    marginTop: 10,
    width: '100%',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressRing: {
    marginVertical: 20,
  },
  statsSummary: {
    marginBottom: 24,
  },
  weeklyCalendar: {
    marginBottom: 24,
  },
  weeklyReportContainer: {
    marginBottom: 24,
  },
  weeklyReportButton: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#667eea',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  weeklyReportContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weeklyReportEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  weeklyReportTextContainer: {
    flex: 1,
  },
  weeklyReportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  weeklyReportSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
});
