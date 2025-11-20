import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MainTabParamList, RootStackParamList } from './types/navigation';
import { HomeScreen } from './screens/HomeScreen';
import { GoalsNavigator } from './navigation/GoalsNavigator';
import { LearnNavigator } from './navigation/LearnNavigator';
import { ProfileScreen } from './screens/ProfileScreen';
import { AuthScreen } from './screens/AuthScreen';
import { useAuthStore } from './store/authStore';
import { LoadingScreen } from './components/LoadingScreen';
import { Platform } from 'react-native';
import { colors, typography, layout } from './constants/theme';

// Create navigators
const Tab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

// Main Tab Navigator (after auth)
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.disabled,
        tabBarStyle: {
          height: layout.touchableMinHeight * 1.75,
          paddingBottom: layout.touchableGap / 2,
          paddingTop: layout.touchableGap / 2,
        },
        tabBarLabelStyle: {
          fontSize: typography.sizes.caption,
          fontWeight: typography.weights.medium,
          paddingBottom: layout.touchableGap / 2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        headerTitleStyle: {
          fontSize: typography.sizes.subtitle,
          fontWeight: typography.weights.semibold,
          color: colors.text.primary,
        },
        headerStyle: {
          backgroundColor: colors.background.primary,
          ...Platform.select({
            ios: {
              shadowColor: colors.text.primary,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            },
            android: {
              elevation: 2,
            },
          }),
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Goals" 
        component={GoalsNavigator}
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="check-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Learn" 
        component={LearnNavigator}
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator with Auth Gating
export const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <NavigationContainer>
        <LoadingScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Stack (not authenticated)
          <RootStack.Screen name="Auth" component={AuthScreen} />
        ) : (
          // Main App Stack (authenticated)
          <RootStack.Screen name="Main" component={MainTabs} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};