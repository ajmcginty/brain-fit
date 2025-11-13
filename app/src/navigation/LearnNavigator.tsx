import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { InfoScreen } from '../screens/InfoScreen';

export type LearnStackParamList = {
  Info: undefined;
};

const Stack = createStackNavigator<LearnStackParamList>();

export const LearnNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Info"
        component={InfoScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
