import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { InfoScreen } from '../screens/InfoScreen';
import { ArticleDetailScreen } from '../screens/ArticleDetailScreen';
import { Article } from '../types/articles';

export type LearnStackParamList = {
  Info: undefined;
  ArticleDetail: { article: Article };
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
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={({ route }) => ({
          title: '',
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};
