import React from 'react';
import { Pressable, Text, StyleSheet, View, AccessibilityRole } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, layout, shadows } from '../constants/theme';

export type GoalIcon = 'run' | 'brain' | 'account-group' | 'sleep' | 'food-apple';

interface GoalCheckboxProps {
  label: string;
  isChecked: boolean;
  onToggle: () => void;
  icon: GoalIcon;
}

export const GoalCheckbox = ({ label, isChecked, onToggle, icon }: GoalCheckboxProps) => {
  return (
    <Pressable
      style={[styles.container, { minHeight: layout.touchableMinHeight }]}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked }}
      accessibilityLabel={`${label} goal, ${isChecked ? 'completed' : 'not completed'}`}
      accessibilityHint="Double tap to toggle goal completion"
    >
      <View style={[styles.checkbox, isChecked && styles.checked]}>
        {isChecked && (
          <MaterialCommunityIcons name="check" size={20} color={colors.text.inverse} />
        )}
      </View>
      <View style={styles.labelContainer}>
        <MaterialCommunityIcons 
          name={icon} 
          size={24} 
          color={colors.primary}
          accessibilityRole="image" as AccessibilityRole
          accessibilityLabel={`${label} icon`}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.containerPadding,
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.lg,
    marginVertical: layout.touchableGap,
    minHeight: layout.touchableMinHeight,
    ...shadows.small,
  },
  checkbox: {
    width: layout.touchableMinHeight * 0.6,
    height: layout.touchableMinHeight * 0.6,
    borderRadius: layout.borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: layout.touchableGap * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: colors.primary,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: typography.sizes.bodyLarge,
    marginLeft: layout.touchableGap,
    color: colors.text.primary,
  },
});
