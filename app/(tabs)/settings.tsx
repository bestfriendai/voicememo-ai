// Vocap - Settings Screen
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useVoiceMemoStore } from '../../src/hooks/useVoiceMemo';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../src/ui/theme';

export default function SettingsScreen() {
  const router = useRouter();
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Premium Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>
                {isPremium ? '🎉 Premium Active' : '⭐ Upgrade to Premium'}
              </Text>
              <Text style={styles.rowSubtitle}>
                {isPremium
                  ? 'Unlimited AI transcriptions & summaries'
                  : 'Unlock unlimited AI features'}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.button, isPremium && styles.buttonSecondary]}
              onPress={handleTogglePremium}
            >
              <Text style={[styles.buttonText, isPremium && styles.buttonTextSecondary]}>
                {isPremium ? 'Manage' : 'Upgrade'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Storage Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>Total Memos</Text>
            <Text style={styles.rowValue}>{memos.length}</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={handleClearData}>
            <Text style={[styles.rowTitle, styles.destructiveText]}>Clear All Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={handleRateApp}>
            <Text style={styles.rowTitle}>Rate Vocap</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={handleContact}>
            <Text style={styles.rowTitle}>Contact Support</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={handleTerms}>
            <Text style={styles.rowTitle}>Terms of Service</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={handlePrivacy}>
            <Text style={styles.rowTitle}>Privacy Policy</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Version */}
      <View style={styles.footer}>
        <Text style={styles.version}>Vocap v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.text,
  },
  rowSubtitle: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rowValue: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  rowArrow: {
    fontSize: 22,
    color: colors.textTertiary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  buttonSecondary: {
    backgroundColor: colors.surfaceSecondary,
  },
  buttonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  buttonTextSecondary: {
    color: colors.primary,
  },
  destructiveText: {
    color: colors.error,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
  version: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
  },
});
