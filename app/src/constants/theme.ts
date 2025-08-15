// Theme constants with accessibility-friendly defaults
// Following WCAG 2.1 guidelines for better readability and interaction

export const colors = {
  // Primary colors with good contrast ratios
  primary: '#2E7D32', // Darker green for better contrast
  primaryLight: '#4CAF50',
  primaryDark: '#1B5E20',

  // Text colors
  text: {
    primary: '#333333', // Dark gray for regular text
    secondary: '#666666', // Medium gray for secondary text
    disabled: '#999999', // Light gray for disabled text
    inverse: '#FFFFFF', // White text for dark backgrounds
  },

  // UI colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    highlight: '#E8F5E9', // Light green background
  },

  // Status colors with good contrast
  success: '#2E7D32', // Green
  error: '#D32F2F', // Red
  warning: '#F57C00', // Orange
  info: '#1976D2', // Blue

  // Interactive element colors
  button: {
    primary: '#2E7D32',
    disabled: '#CCCCCC',
    text: '#FFFFFF',
  },

  // Border colors
  border: '#E0E0E0',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  // Larger font sizes for better readability
  sizes: {
    caption: 14, // Minimum size for readable text
    body: 16,
    bodyLarge: 18,
    subtitle: 20,
    title: 24,
    heading: 28,
  },

  // Font weights
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const layout = {
  // Minimum touch target sizes (44x44 points per iOS guidelines)
  touchableMinHeight: 44,
  touchableMinWidth: 44,
  
  // Spacing between touchable elements
  touchableGap: 8,

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },

  // Container padding
  containerPadding: 16,
} as const;

// Shadows for depth and hierarchy
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 3.0,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 5.0,
    elevation: 5,
  },
} as const;

// Animation durations
export const animation = {
  short: 200,
  medium: 300,
  long: 500,
} as const;
