// VoiceMemo AI - Privacy Policy
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, fontWeight } from '../src/ui/theme';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.date}>Last updated: February 14, 2026</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.text}>
          VoiceMemo AI stores all voice recordings and transcriptions locally on your device. 
          We do not upload your voice memos to any external servers. All AI processing is performed 
          on-device or using secure, privacy-compliant APIs.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Audio Recording</Text>
        <Text style={styles.text}>
          When you use VoiceMemo AI to record voice memos, the app requires access to your device's 
          microphone. Audio recordings are stored locally on your device and are not shared with 
          any third parties.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Data Storage</Text>
        <Text style={styles.text}>
          All your voice memos, transcriptions, summaries, and tags are stored locally on your device. 
          You can delete all data at any time from the Settings screen.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Analytics</Text>
        <Text style={styles.text}>
          We do not collect any personal information or usage analytics. Your privacy is our priority.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Third-Party Services</Text>
        <Text style={styles.text}>
          VoiceMemo AI uses RevenueCat for subscription management. Please refer to RevenueCat's 
          privacy policy for information on how they handle payment data.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Children's Privacy</Text>
        <Text style={styles.text}>
          VoiceMemo AI is not intended for children under 13. We do not knowingly collect personal 
          information from children.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Changes to Privacy Policy</Text>
        <Text style={styles.text}>
          We may update this privacy policy from time to time. We will notify you of any changes 
          by posting the new policy on this page.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this Privacy Policy, please contact us at 
          support@voicememo.ai
        </Text>
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
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  backButton: {
    marginBottom: spacing.lg,
  },
  backText: {
    fontSize: fontSize.body,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  date: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.section,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
