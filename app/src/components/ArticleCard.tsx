import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Article } from '../types/articles';
import { colors, typography, layout, shadows, spacing } from '../constants/theme';

interface ArticleCardProps {
  article: Article;
  onPress: (article: Article) => void;
}

const CATEGORY_LABELS = {
  exercise: 'Physical Exercise',
  cognitive: 'Brain Training',
  social: 'Social Activity',
  sleep: 'Quality Sleep',
  diet: 'Healthy Diet',
  general: 'General Health',
} as const;

const CATEGORY_ICONS = {
  exercise: 'run',
  cognitive: 'brain',
  social: 'account-group',
  sleep: 'sleep',
  diet: 'food-apple',
  general: 'book-open-page-variant',
} as const;

export const ArticleCard = ({ article, onPress }: ArticleCardProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(article)}
      accessibilityRole="button"
      accessibilityLabel={`Read article: ${article.title}`}
    >
      <View style={styles.content}>
        <View style={styles.categoryRow}>
          <MaterialCommunityIcons 
            name={CATEGORY_ICONS[article.category]} 
            size={20} 
            color={colors.primary}
          />
          <Text style={styles.category}>{CATEGORY_LABELS[article.category]}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>

        {article.summary && (
          <Text style={styles.summary} numberOfLines={2}>
            {article.summary}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.meta}>
            {article.readTime}
          </Text>
          {article.sourceUrl && (
            <View style={styles.sourceIndicator}>
              <MaterialCommunityIcons 
                name="link-variant" 
                size={16} 
                color={colors.text.secondary}
              />
              <Text style={styles.sourceText}>External Source</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  category: {
    fontSize: typography.sizes.caption,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  title: {
    fontSize: typography.sizes.subtitle,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    lineHeight: typography.sizes.subtitle * 1.3,
  },
  summary: {
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    lineHeight: typography.sizes.body * 1.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  meta: {
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
  },
  sourceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sourceText: {
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
  },
});