/**
 * Sleep Catcher Theme - Colors designed for sleep wellness and relaxation
 */

import { Platform } from 'react-native';

// Primary colors inspired by sleep and wellness
const primaryBlue = '#4A90E2'; // Calming blue
const primaryDark = '#2C5282'; // Deeper blue for contrast
const accentPurple = '#8B5CF6'; // Relaxing purple
const nightBlue = '#1A202C'; // Deep night color

export const Colors = {
  light: {
    // Text colors
    text: '#2D3748',
    textSecondary: '#718096',
    textMuted: '#A0AEC0',
    
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F7FAFC',
    backgroundTertiary: '#EDF2F7',
    
    // Primary colors
    primary: primaryBlue,
    primaryDark: primaryDark,
    accent: accentPurple,
    
    // Status colors
    success: '#48BB78',
    warning: '#ED8936',
    error: '#F56565',
    info: primaryBlue,
    
    // Sleep score colors
    scoreVeryPoor: '#F56565', // Red - score 1
    scorePoor: '#ED8936',     // Orange - score 2
    scoreOkay: '#ECC94B',     // Yellow - score 3
    scoreGood: '#48BB78',     // Green - score 4
    scoreExcellent: '#38B2AC', // Teal - score 5
    
    // UI elements
    tint: primaryBlue,
    icon: '#718096',
    tabIconDefault: '#A0AEC0',
    tabIconSelected: primaryBlue,
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    
    // Card and surface colors
    card: '#FFFFFF',
    surface: '#F7FAFC',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    // Input colors
    inputBackground: '#FFFFFF',
    inputBorder: '#E2E8F0',
    inputBorderFocus: primaryBlue,
    placeholder: '#A0AEC0',
  },
  dark: {
    // Text colors
    text: '#F7FAFC',
    textSecondary: '#CBD5E0',
    textMuted: '#A0AEC0',
    
    // Background colors
    background: '#1A202C',
    backgroundSecondary: '#2D3748',
    backgroundTertiary: '#4A5568',
    
    // Primary colors
    primary: '#63B3ED',
    primaryDark: '#3182CE',
    accent: '#B794F6',
    
    // Status colors
    success: '#68D391',
    warning: '#F6AD55',
    error: '#FC8181',
    info: '#63B3ED',
    
    // Sleep score colors
    scoreVeryPoor: '#FC8181', // Light red - score 1
    scorePoor: '#F6AD55',     // Light orange - score 2
    scoreOkay: '#F6E05E',     // Light yellow - score 3
    scoreGood: '#68D391',     // Light green - score 4
    scoreExcellent: '#4FD1C7', // Light teal - score 5
    
    // UI elements
    tint: '#63B3ED',
    icon: '#CBD5E0',
    tabIconDefault: '#A0AEC0',
    tabIconSelected: '#63B3ED',
    border: '#4A5568',
    borderLight: '#2D3748',
    
    // Card and surface colors
    card: '#2D3748',
    surface: '#4A5568',
    overlay: 'rgba(0, 0, 0, 0.7)',
    
    // Input colors
    inputBackground: '#2D3748',
    inputBorder: '#4A5568',
    inputBorderFocus: '#63B3ED',
    placeholder: '#A0AEC0',
  },
};

// Sleep score color mapping
export const getSleepScoreColor = (score: number, isDark: boolean = false) => {
  const colors = isDark ? Colors.dark : Colors.light;
  
  switch (score) {
    case 1:
      return colors.scoreVeryPoor;
    case 2:
      return colors.scorePoor;
    case 3:
      return colors.scoreOkay;
    case 4:
      return colors.scoreGood;
    case 5:
      return colors.scoreExcellent;
    default:
      return colors.textMuted;
  }
};

// Typography scale
export const Typography = {
  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  
  // Line heights
  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Font weights
  weights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};

// Spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 96,
};

// Border radius scale
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Shadow presets
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Animation durations
export const Animation = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Component style presets
export const ComponentStyles = {
  button: {
    primary: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      ...Shadows.small,
    },
    secondary: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
    },
  },
  
  card: {
    default: {
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      ...Shadows.medium,
    },
    compact: {
      padding: Spacing.sm,
      borderRadius: BorderRadius.md,
      ...Shadows.small,
    },
  },
  
  input: {
    default: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
    },
  },
};
