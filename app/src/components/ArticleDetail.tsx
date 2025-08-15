import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Article } from '../types/articles';
import { colors, typography, spacing, layout, shadows } from '../constants/theme';

interface ArticleDetailProps {
  article: Article;
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

export const ArticleDetail = ({ article }: ArticleDetailProps) => {
  const { width } = useWindowDimensions();

  const handleSourcePress = async () => {
    if (article.sourceUrl) {
      try {
        const supported = await Linking.canOpenURL(article.sourceUrl);
        if (supported) {
          Alert.alert(
            'Open External Link',
            'This will open the full article in your web browser.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open', onPress: () => Linking.openURL(article.sourceUrl!) },
            ]
          );
        } else {
          Alert.alert('Error', 'Unable to open this link');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong opening the link');
      }
    }
  };

  const handleDoiPress = async () => {
    if (article.doi) {
      const doiUrl = `https://doi.org/${article.doi}`;
      try {
        const supported = await Linking.canOpenURL(doiUrl);
        if (supported) {
          Alert.alert(
            'Open DOI Link',
            'This will open the DOI link in your web browser.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open', onPress: () => Linking.openURL(doiUrl) },
            ]
          );
        } else {
          Alert.alert('Error', 'Unable to open DOI link');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong opening the DOI link');
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        {article.imageUrl ? (
          <Image
            source={{ uri: article.imageUrl }}
            style={[styles.heroImage, { width }]}
            accessibilityRole="image"
            accessibilityLabel={`Image for article: ${article.title}`}
          />
        ) : (
          <View style={[styles.heroPlaceholder, { width }]}>
            <MaterialCommunityIcons
              name={CATEGORY_ICONS[article.category]}
              size={48}
              color={colors.text.disabled}
            />
          </View>
        )}

        <View style={styles.heroOverlay}>
          <View style={styles.categoryBadge}>
            <MaterialCommunityIcons
              name={CATEGORY_ICONS[article.category]}
              size={16}
              color={colors.primary}
            />
            <Text style={styles.categoryText}>{CATEGORY_LABELS[article.category]}</Text>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{article.title}</Text>
          
          {article.authors && (
            <Text style={styles.authors}>
              By {article.authors.join(', ')}
            </Text>
          )}

          <View style={styles.metaRow}>
            <Text style={styles.meta}>
              {article.readTime}
            </Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.meta}>
              {new Date(article.publishedDate).toLocaleDateString()}
            </Text>
          </View>

          {(article.journal || article.institution) && (
            <View style={styles.sourceRow}>
              <MaterialCommunityIcons
                name="school"
                size={16}
                color={colors.text.secondary}
              />
              <Text style={styles.source}>
                {article.journal || article.institution}
                {article.publicationYear ? ` (${article.publicationYear})` : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Summary */}
        {article.summary && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Key Points</Text>
            <Text style={styles.summary}>{article.summary}</Text>
          </View>
        )}

        {/* Main Content */}
        <Text style={styles.content}>{article.content}</Text>

        {/* References Section */}
        {(article.sourceUrl || article.doi || article.citation) && (
          <View style={styles.sourceSection}>
            <Text style={styles.sourceSectionTitle}>References</Text>
            
            {article.citation && (
              <Text style={styles.citation}>{article.citation}</Text>
            )}

            {article.sourceUrl && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleSourcePress}
                accessibilityRole="link"
                accessibilityLabel="View source article"
              >
                <MaterialCommunityIcons
                  name="link-variant"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.linkText}>View Full Article</Text>
                <MaterialCommunityIcons
                  name="open-in-new"
                  size={16}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}

            {article.doi && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleDoiPress}
                accessibilityRole="link"
                accessibilityLabel="View DOI"
              >
                <MaterialCommunityIcons
                  name="identifier"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.linkText}>DOI: {article.doi}</Text>
                <MaterialCommunityIcons
                  name="open-in-new"
                  size={16}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Last Updated */}
        {article.lastUpdated && (
          <Text style={styles.lastUpdated}>
            Last updated: {new Date(article.lastUpdated).toLocaleDateString()}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  heroSection: {
    position: 'relative',
    backgroundColor: colors.background.secondary,
  },
  heroImage: {
    height: 240,
    backgroundColor: colors.background.secondary,
  },
  heroPlaceholder: {
    height: 240,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.xl,
    gap: spacing.xs,
    ...shadows.small,
  },
  categoryText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
  contentContainer: {
    padding: spacing.md,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.heading,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    lineHeight: typography.sizes.heading * 1.3,
  },
  authors: {
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  meta: {
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
  },
  metaDot: {
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  source: {
    flex: 1,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
  },
  summaryContainer: {
    backgroundColor: colors.background.highlight,
    padding: spacing.md,
    borderRadius: layout.borderRadius.md,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: typography.sizes.subtitle,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  summary: {
    fontSize: typography.sizes.bodyLarge,
    color: colors.text.primary,
    lineHeight: typography.sizes.bodyLarge * 1.5,
  },
  content: {
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    lineHeight: typography.sizes.body * 1.6,
    marginBottom: spacing.xl,
  },
  sourceSection: {
    backgroundColor: colors.background.secondary,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.md,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  sourceSectionTitle: {
    fontSize: typography.sizes.subtitle,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  citation: {
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    lineHeight: typography.sizes.body * 1.5,
    fontStyle: 'italic',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    borderRadius: layout.borderRadius.md,
    gap: spacing.sm,
    ...shadows.small,
  },
  linkText: {
    flex: 1,
    fontSize: typography.sizes.body,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  lastUpdated: {
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});