// VoiceMemo AI - Theme
// Warm amber brand, clean and functional

export const colors = {
  // Brand colors
  primary: '#D97706',      // Warm amber
  primaryLight: '#FCD34D',  // Light amber
  primaryDark: '#B45309',  // Dark amber
  
  // Backgrounds
  background: '#FFFDF9',   // Warm white
  surface: '#FFFFFF',       // Pure white
  surfaceSecondary: '#FFF8F0', // Warm light
  
  // Text
  text: '#1C1C1E',         // Rich dark
  textSecondary: '#6B7280', // Gray
  textTertiary: '#9CA3AF', // Light gray
  
  // Accents
  accent: '#F59E0B',       // Amber accent
  success: '#10B981',      // Green for success
  error: '#EF4444',        // Red for errors
  warning: '#F59E0B',      // Amber for warnings
  
  // UI Elements
  border: '#E5E7EB',       // Light gray border
  divider: '#F3F4F6',      // Very light divider
  
  // Tab bar
  tabActive: '#D97706',
  tabInactive: '#9CA3AF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

export const fontSize = {
  caption: 13,
  body: 17,
  section: 20,
  title: 28,
  largeTitle: 34,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
