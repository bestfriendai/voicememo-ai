// Vocap - Theme Context
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'vocap_theme_mode';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  card: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  divider: string;
  accent: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  success: string;
  error: string;
  warning: string;
  tabActive: string;
  tabInactive: string;
}

const lightColors: ThemeColors = {
  background: '#FFFDF9',
  surface: '#FFFFFF',
  surfaceSecondary: '#FFF8F0',
  card: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  divider: '#F3F4F6',
  accent: '#F59E0B',
  primary: '#D97706',
  primaryLight: '#FCD34D',
  primaryDark: '#B45309',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  tabActive: '#D97706',
  tabInactive: '#9CA3AF',
};

const darkColors: ThemeColors = {
  background: '#111113',
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  card: '#1C1C1E',
  text: '#F5F5F7',
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',
  border: '#3A3A3C',
  divider: '#2C2C2E',
  accent: '#FBBF24',
  primary: '#F59E0B',
  primaryLight: '#FCD34D',
  primaryDark: '#D97706',
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  tabActive: '#F59E0B',
  tabInactive: '#71717A',
};

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: lightColors,
  isDark: false,
  themeMode: 'system',
  setThemeMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((value) => {
      if (value === 'light' || value === 'dark' || value === 'system') {
        setThemeModeState(value);
      }
      setLoaded(true);
    });
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_KEY, mode);
  }, []);

  const toggleTheme = useCallback(() => {
    const isDarkNow = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');
    setThemeMode(isDarkNow ? 'light' : 'dark');
  }, [themeMode, systemScheme, setThemeMode]);

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ colors, isDark, themeMode, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeColors = () => {
  const { colors } = useContext(ThemeContext);
  return colors;
};

export const useTheme = () => useContext(ThemeContext);
