import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GoalsStackParamList } from '../types/navigation';
import { GoalsScreen } from '../screens/GoalsScreen';

const Stack = createNativeStackNavigator<GoalsStackParamList>();

export const GoalsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GoalsList"
        component={GoalsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
