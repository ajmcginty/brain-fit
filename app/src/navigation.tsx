import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MainTabParamList } from './types/navigation';
import { HomeScreen } from './screens/HomeScreen';
import { GoalsNavigator } from './navigation/GoalsNavigator';
import { LearnNavigator } from './navigation/LearnNavigator';
import { ProfileTestScreen } from './screens/ProfileTestScreen';
import { Platform } from 'react-native';
import { colors, typography, layout } from './constants/theme';

// Create the navigator
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main navigator
export const RootNavigator = () => {
  return (
    <NavigationContainer>
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
          component={ProfileTestScreen}
          options={{
            title: 'Profile Test',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-cog" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};