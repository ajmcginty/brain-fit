import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';

export const AuthScreen = () => {
  const navigation = useNavigation();
  const setIsAuthenticated = useAuthStore(state => state.setIsAuthenticated);

  const handleDemoLogin = () => {
    // For development, just set authenticated to true
    setIsAuthenticated(true);
    navigation.navigate('Main' as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>BrainFit</Text>
        <Text style={styles.subtitle}>Your Cognitive Wellness Journey</Text>
        
        <Pressable 
          style={styles.button}
          onPress={handleDemoLogin}
        >
          <Text style={styles.buttonText}>Enter App (Demo)</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
