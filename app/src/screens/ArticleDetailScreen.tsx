import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { LearnStackParamList } from '../navigation/LearnNavigator';
import { ArticleDetail } from '../components/ArticleDetail';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = StackScreenProps<LearnStackParamList, 'ArticleDetail'>;

export const ArticleDetailScreen = ({ route }: Props) => {
  const { article } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <ArticleDetail article={article} />
    </SafeAreaView>
  );
};
