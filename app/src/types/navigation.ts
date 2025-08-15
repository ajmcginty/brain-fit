import { NavigatorScreenParams } from '@react-navigation/native';
import { LearnStackParamList } from '../navigation/LearnNavigator';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Auth: undefined;
};

export type GoalsStackParamList = {
  GoalsList: undefined;
  GoalEdit: {
    date: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Goals: NavigatorScreenParams<GoalsStackParamList>;
  Learn: NavigatorScreenParams<LearnStackParamList>;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
