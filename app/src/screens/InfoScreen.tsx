import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArticleList } from '../components/ArticleList';
import { useArticleStore } from '../store/articleStore';
import { Article, ArticleCategory } from '../types/articles';
import { colors, typography, spacing, layout, shadows } from '../constants/theme';

const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  exercise: 'Physical Exercise',
  cognitive: 'Brain Training',
  social: 'Social Activity',
  sleep: 'Quality Sleep',
  diet: 'Healthy Diet',
  general: 'General Health',
};

type IconName = 'run' | 'brain' | 'account-group' | 'sleep' | 'food-apple' | 'book-open-page-variant';

const CATEGORY_ICONS: Record<ArticleCategory, IconName> = {
  exercise: 'run',
  cognitive: 'brain',
  social: 'account-group',
  sleep: 'sleep',
  diet: 'food-apple',
  general: 'book-open-page-variant',
};

export const InfoScreen = () => {
  const { articles, filters, loading, error, setFilters, clearFilters } = useArticleStore();

  const filteredArticles = React.useMemo(() => {
    return articles.filter(article => {
      if (filters.category && article.category !== filters.category) {
        return false;
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [articles, filters]);

  const handleArticlePress = async (article: Article) => {
    if (!article.url) {
      Alert.alert('Error', 'Article URL not found');
      console.error('Article missing URL:', article);
      return;
    }

    try {
      const supported = await Linking.canOpenURL(article.url);
      if (supported) {
        await Linking.openURL(article.url);
      } else {
        Alert.alert('Error', `Cannot open URL: ${article.url}`);
      }
    } catch (error) {
      console.error('Error opening article:', error);
      Alert.alert('Error', `Failed to open article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const renderCategoryChip = (category: ArticleCategory) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        filters.category === category && styles.categoryChipSelected,
      ]}
      onPress={() => {
        if (filters.category === category) {
          clearFilters();
        } else {
          setFilters({ ...filters, category });
        }
      }}
      accessibilityRole="button"
      accessibilityLabel={`Filter by ${CATEGORY_LABELS[category]}`}
      accessibilityState={{ selected: filters.category === category }}
    >
      <MaterialCommunityIcons
        name={CATEGORY_ICONS[category]}
        size={20}
        color={filters.category === category ? colors.background.primary : colors.primary}
      />
      <Text
        style={[
          styles.categoryChipText,
          filters.category === category && styles.categoryChipTextSelected,
        ]}
      >
        {CATEGORY_LABELS[category]}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert" size={48} color={colors.error} />
          <Text style={styles.errorText}>Error loading articles</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Learn & Discover</Text>
        <Text style={styles.subtitle}>
          Explore articles and research about brain health
        </Text>
      </View>

      <ArticleList
        articles={filteredArticles}
        onArticlePress={handleArticlePress}
        ListHeaderComponent={
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}
            contentContainerStyle={styles.categoryListContent}
            data={Object.keys(CATEGORY_LABELS) as ArticleCategory[]}
            renderItem={({ item }) => renderCategoryChip(item)}
            keyExtractor={(item) => item}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="text-search"
              size={48}
              color={colors.text.disabled}
            />
            <Text style={styles.emptyText}>
              {filters.category || filters.searchQuery
                ? 'No articles found for the selected filters'
                : 'No articles available'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background.primary,
    ...shadows.small,
  },
  title: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
  },
  categoryList: {
    maxHeight: 56,
    marginBottom: spacing.md,
  },
  categoryListContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.xl,
    backgroundColor: colors.background.secondary,
    gap: spacing.xs,
    ...shadows.small,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  categoryChipTextSelected: {
    color: colors.text.inverse,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.sizes.subtitle,
    fontWeight: typography.weights.semibold,
    color: colors.error,
    marginTop: spacing.md,
  },
  errorSubtext: {
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});