import React from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { Article } from '../types/articles';
import { ArticleCard } from './ArticleCard';
import { colors, typography, spacing } from '../constants/theme';

interface ArticleListProps {
  articles: Article[];
  onArticlePress: (article: Article) => void;
  ListEmptyComponent?: React.ReactElement;
  ListHeaderComponent?: React.ReactElement;
}

export const ArticleList = ({
  articles,
  onArticlePress,
  ListEmptyComponent,
  ListHeaderComponent,
}: ArticleListProps) => {
  return (
    <FlatList
      data={articles}
      renderItem={({ item }) => (
        <ArticleCard article={item} onPress={onArticlePress} />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        ListEmptyComponent || (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No articles available</Text>
          </View>
        )
      }
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: typography.sizes.body,
  },
  separator: {
    height: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginHorizontal: spacing.sm,
  },
});