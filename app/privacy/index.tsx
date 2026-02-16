// Vocap - Privacy Policy
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/src/contexts/ThemeContext';
import { spacing, fontSize, fontWeight } from '@/src/ui/theme';

export default function PrivacyScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={[styles.backText, { color: colors.primary }]}>← Back</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>Privacy Policy</Text>
      <Text style={[styles.date, { color: colors.textTertiary }]}>Last updated: February 14, 2026</Text>

      {[
        { title: '1. Information We Collect', text: 'Vocap stores all voice recordings and transcriptions locally on your device. We do not upload your voice memos to any external servers. All AI processing is performed on-device or using secure, privacy-compliant APIs.' },
        { title: '2. Audio Recording', text: 'When you use Vocap to record voice memos, the app requires access to your device\'s microphone. Audio recordings are stored locally on your device and are not shared with any third parties.' },
        { title: '3. Data Storage', text: 'All your voice memos, transcriptions, summaries, and tags are stored locally on your device. You can delete all data at any time from the Settings screen.' },
        { title: '4. Analytics', text: 'We do not collect any personal information or usage analytics. Your privacy is our priority.' },
        { title: '5. Third-Party Services', text: 'Vocap uses RevenueCat for subscription management. Please refer to RevenueCat\'s privacy policy for information on how they handle payment data.' },
        { title: '6. Children\'s Privacy', text: 'Vocap is not intended for children under 13. We do not knowingly collect personal information from children.' },
        { title: '7. Changes to Privacy Policy', text: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.' },
        { title: '8. Contact Us', text: 'If you have any questions about this Privacy Policy, please contact us at support@voicememo.ai' },
      ].map((section, i) => (
        <View key={i} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>{section.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  backButton: {
    marginBottom: spacing.lg,
  },
  backText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  date: {
    fontSize: fontSize.caption,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.section,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: fontSize.body,
    lineHeight: 24,
  },
});
