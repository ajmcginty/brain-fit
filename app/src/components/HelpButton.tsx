import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, layout, shadows } from '../constants/theme';

interface HelpButtonProps {
  helpText: string;
  style?: object;
}

export const HelpButton = ({ helpText, style }: HelpButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsExpanded(!isExpanded)}
        accessibilityRole="button"
        accessibilityLabel={isExpanded ? "Hide help information" : "Show help information"}
        accessibilityHint="Double tap to toggle help information"
      >
        <MaterialCommunityIcons 
          name={isExpanded ? "help-circle" : "help-circle-outline"} 
          size={28} 
          color={colors.primary}
        />
        <Text style={styles.buttonText}>
          {isExpanded ? "Hide Help" : "Need Help?"}
        </Text>
        <MaterialCommunityIcons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color={colors.primary}
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.helpContent}>
          <Text style={styles.helpText}>{helpText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background.highlight,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: spacing.sm,
    ...shadows.small,
  },
  buttonText: {
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  helpContent: {
    marginTop: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  helpText: {
    fontSize: typography.sizes.bodyLarge,
    lineHeight: 26,
    color: colors.text.primary,
  },
});

