import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressRing } from '../components/ProgressRing';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { StatsSummary } from '../components/StatsSummary';
import { HelpButton } from '../components/HelpButton';

export const HomeScreen = () => {
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

        <StatsSummary style={styles.statsSummary} />
        
        <WeeklyCalendar style={styles.weeklyCalendar} />
      </ScrollView>
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
});
