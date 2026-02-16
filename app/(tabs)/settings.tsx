// Vocap - Settings Screen
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useVoiceMemoStore } from '../../src/hooks/useVoiceMemo';
import { useTheme } from '../../src/contexts/ThemeContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../../src/ui/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark, themeMode, setThemeMode, toggleTheme } = useTheme();
  const { isPremium, setIsPremium, memos } = useVoiceMemoStore();

  const handleTogglePremium = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isPremium) {
      Alert.alert(
        'Downgrade Premium',
        'Are you sure you want to downgrade? You will lose premium features.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Downgrade', 
            style: 'destructive',
            onPress: () => setIsPremium(false),
          },
        ]
      );
    } else {
      router.push('/paywall');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Memos',
      'This will permanently delete all your voice memos. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleRateApp = () => {
    Linking.openURL('https://apps.apple.com');
  };

  const handleContact = () => {
    Linking.openURL('mailto:support@voicememo.ai');
  };

  const handlePrivacy = () => {
    Linking.openURL('https://vocap.app/privacy');
  };

  const handleTerms = () => {
    Linking.openURL('https://vocap.app/terms');
  };

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const themeModeLabel = themeMode === 'system' ? 'System' : themeMode === 'dark' ? 'Dark' : 'Light';

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      {/* Premium Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Subscription</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>
                {isPremium ? '🎉 Premium Active' : '⭐ Upgrade to Premium'}
              </Text>
              <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                {isPremium
                  ? 'Unlimited AI transcriptions & summaries'
                  : 'Unlock unlimited AI features'}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary }, isPremium && { backgroundColor: colors.surfaceSecondary }]}
              onPress={handleTogglePremium}
            >
              <Text style={[styles.buttonText, { color: colors.surface }, isPremium && { color: colors.primary }]}>
                {isPremium ? 'Manage' : 'Upgrade'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.row}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={handleThemeToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <View style={styles.row}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Theme</Text>
            <View style={styles.themeButtons}>
              {(['system', 'light', 'dark'] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.themeButton,
                    { borderColor: colors.border },
                    themeMode === mode && { borderColor: colors.primary, backgroundColor: colors.surfaceSecondary },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setThemeMode(mode);
                  }}
                >
                  <Text style={[
                    styles.themeButtonText,
                    { color: colors.textSecondary },
                    themeMode === mode && { color: colors.primary },
                  ]}>
                    {mode === 'system' ? '📱' : mode === 'light' ? '☀️' : '🌙'} {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Storage Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Storage</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.row}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Total Memos</Text>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{memos.length}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <TouchableOpacity style={styles.row} onPress={handleClearData}>
            <Text style={[styles.rowTitle, { color: colors.error }]}>Clear All Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>About</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity style={styles.row} onPress={handleRateApp}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Rate Vocap</Text>
            <Text style={[styles.rowArrow, { color: colors.textTertiary }]}>›</Text>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <TouchableOpacity style={styles.row} onPress={handleContact}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Contact Support</Text>
            <Text style={[styles.rowArrow, { color: colors.textTertiary }]}>›</Text>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <TouchableOpacity style={styles.row} onPress={handleTerms}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Terms of Service</Text>
            <Text style={[styles.rowArrow, { color: colors.textTertiary }]}>›</Text>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <TouchableOpacity style={styles.row} onPress={handlePrivacy}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Privacy Policy</Text>
            <Text style={[styles.rowArrow, { color: colors.textTertiary }]}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Version */}
      <View style={styles.footer}>
        <Text style={[styles.version, { color: colors.textTertiary }]}>Vocap v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: fontSize.body,
  },
  rowSubtitle: {
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  rowValue: {
    fontSize: fontSize.body,
  },
  rowArrow: {
    fontSize: 22,
  },
  divider: {
    height: 1,
    marginLeft: spacing.lg,
  },
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  themeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  themeButtonText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
  version: {
    fontSize: fontSize.caption,
  },
});
