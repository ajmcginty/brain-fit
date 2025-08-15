import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressRing } from '../components/ProgressRing';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { StatsSummary } from '../components/StatsSummary';

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to BrainFit</Text>
          <Text style={styles.subtitle}>Your daily cognitive wellness companion</Text>
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
    marginBottom: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
