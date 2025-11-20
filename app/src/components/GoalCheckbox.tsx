import React from 'react';
import { Pressable, Text, StyleSheet, View, AccessibilityRole } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, layout, shadows } from '../constants/theme';

export type GoalIcon = 'run' | 'brain' | 'account-group' | 'sleep' | 'food-apple';

interface GoalCheckboxProps {
  label: string;
  description?: string;
  isChecked: boolean;
  onToggle: () => void;
  icon: GoalIcon;
}

export const GoalCheckbox = ({ label, description, isChecked, onToggle, icon }: GoalCheckboxProps) => {
  return (
    <Pressable
      style={[
        styles.container,
        { minHeight: layout.touchableMinHeight },
        isChecked && styles.containerCompleted,
      ]}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked }}
      accessibilityLabel={`${label} goal, ${isChecked ? 'completed' : 'not completed'}`}
      accessibilityHint="Double tap to toggle goal completion"
    >
      <View style={[styles.checkbox, isChecked && styles.checked]}>
        {isChecked && (
          <MaterialCommunityIcons name="check" size={24} color={colors.text.inverse} />
        )}
      </View>
      <View style={styles.labelContainer}>
        <MaterialCommunityIcons 
          name={icon} 
          size={32} 
          color={isChecked ? colors.text.disabled : colors.primary}
          accessibilityRole="image" as AccessibilityRole
          accessibilityLabel={`${label} icon`}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.label, isChecked && styles.labelCompleted]}>{label}</Text>
          {description && (
            <Text style={[styles.description, isChecked && styles.descriptionCompleted]}>
              {description}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.lg,
    marginVertical: layout.touchableGap,
    minHeight: layout.touchableMinHeight,
    ...shadows.small,
  },
  containerCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: layout.borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: colors.primary,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  icon: {
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: typography.sizes.subtitle,
    color: colors.text.primary,
    fontWeight: '600',
  },
  labelCompleted: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  description: {
    fontSize: typography.sizes.subtitle,
    color: '#555555',
    marginTop: 8,
    lineHeight: 28,
  },
  descriptionCompleted: {
    color: colors.text.disabled,
  },
});
