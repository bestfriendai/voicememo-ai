// Vocap - Paywall Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useVoiceMemoStore } from '@/src/hooks/useVoiceMemo';
import { OFFERINGS, purchaseSubscription, restorePurchases } from '@/src/services/purchases';
import { useThemeColors } from '@/src/contexts/ThemeContext';
import { spacing, borderRadius, fontSize, fontWeight } from '@/src/ui/theme';

export default function PaywallScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { setIsPremium } = useVoiceMemoStore();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      const success = await purchaseSubscription(
        selectedPlan === 'monthly' 
          ? OFFERINGS[0].productId 
          : OFFERINGS[1].productId
      );
      
      if (success) {
        setIsPremium(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Welcome to Premium! 🎉', 'Unlimited recordings, AI summaries, and more are now yours.', [
          { text: 'Let\'s Go!', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', 'Purchase failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      const success = await restorePurchases();
      if (success) {
        setIsPremium(true);
        Alert.alert('Restored!', 'Your premium subscription has been restored.');
      } else {
        Alert.alert('No Purchases', 'No previous purchases found to restore.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const selectedOffering = selectedPlan === 'monthly' ? OFFERINGS[0] : OFFERINGS[1];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.surfaceSecondary }]} onPress={handleClose}>
        <Text style={[styles.closeText, { color: colors.textSecondary }]}>✕</Text>
      </TouchableOpacity>

      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🎙️</Text>
        <Text style={[styles.badge, { color: colors.primary }]}>VOCAP PREMIUM</Text>
        <Text style={[styles.title, { color: colors.text }]}>Never Forget{'\n'}a Thought</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your voice, transcribed and summarized by AI.{'\n'}Capture every idea effortlessly.
        </Text>
      </View>

      <View style={[styles.socialProof, { backgroundColor: colors.surfaceSecondary }]}>
        <Text style={[styles.socialProofText, { color: colors.textSecondary }]}>
          ⭐⭐⭐⭐⭐  Join 10,000+ thinkers who never lose an idea
        </Text>
      </View>

      <View style={styles.features}>
        {[
          { icon: '🔊', title: 'Unlimited Recordings', text: 'No limits on length or number of recordings' },
          { icon: '✨', title: 'AI Summaries', text: 'Every memo auto-summarized with key points' },
          { icon: '📝', title: 'Full Transcripts', text: 'Accurate speech-to-text for every recording' },
          { icon: '🎧', title: 'Export Anywhere', text: 'Share transcripts and summaries to any app' },
        ].map((f, i) => (
          <View key={i} style={styles.feature}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>{f.title}</Text>
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>{f.text}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.plans}>
        {OFFERINGS.map((offering) => (
          <TouchableOpacity
            key={offering.id}
            style={[
              styles.planCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              selectedPlan === offering.id && { borderColor: colors.primary, backgroundColor: colors.surfaceSecondary },
            ]}
            onPress={() => setSelectedPlan(offering.id as 'monthly' | 'annual')}
          >
            {offering.isBestValue && (
              <View style={[styles.bestValueBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.bestValueText}>BEST VALUE</Text>
              </View>
            )}
            {offering.trialText && (
              <View style={[styles.trialBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.trialBadgeText}>{offering.trialText}</Text>
              </View>
            )}
            <View style={styles.planRow}>
              <View style={styles.planRadio}>
                <View style={[
                  styles.radioOuter,
                  { borderColor: colors.border },
                  selectedPlan === offering.id && { borderColor: colors.primary },
                ]}>
                  {selectedPlan === offering.id && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                </View>
              </View>
              <View style={styles.planInfo}>
                <Text style={[styles.planName, { color: colors.text }]}>
                  {offering.id === 'monthly' ? 'Monthly' : 'Annual'}
                </Text>
                <Text style={[styles.planPricePerMonth, { color: colors.textTertiary }]}>{offering.pricePerMonth}/month</Text>
              </View>
              <Text style={[styles.planPrice, { color: colors.text }]}>{offering.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.purchaseButton, { backgroundColor: colors.primary }, isLoading && styles.purchaseButtonDisabled]}
        onPress={handlePurchase}
        disabled={isLoading}
      >
        <Text style={styles.purchaseText}>
          {isLoading 
            ? 'Processing...' 
            : selectedPlan === 'annual' 
              ? 'Start Free Trial'
              : `Subscribe for ${selectedOffering.price}`
          }
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
        <Text style={[styles.restoreText, { color: colors.primary }]}>Restore Purchases</Text>
      </TouchableOpacity>

      <Text style={[styles.terms, { color: colors.textTertiary }]}>
        {selectedPlan === 'annual' 
          ? '3-day free trial, then $39.99/year. ' 
          : ''
        }
        Subscription automatically renews. Cancel anytime in Settings.
      </Text>
      <View style={styles.legalLinks}>
        <TouchableOpacity onPress={() => Linking.openURL('https://vocap.app/terms')}>
          <Text style={[styles.legalLink, { color: colors.primary }]}>Terms of Service</Text>
        </TouchableOpacity>
        <Text style={[styles.legalSeparator, { color: colors.textTertiary }]}>  •  </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://vocap.app/privacy')}>
          <Text style={[styles.legalLink, { color: colors.primary }]}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl + 20,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeText: {
    fontSize: 16,
  },
  hero: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  badge: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: fontSize.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  socialProof: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  socialProofText: {
    fontSize: fontSize.caption,
    textAlign: 'center',
    fontWeight: fontWeight.medium,
  },
  features: {
    marginBottom: spacing.xl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: spacing.md,
    width: 40,
    textAlign: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  featureText: {
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  plans: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  planCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    padding: spacing.lg,
    position: 'relative',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  bestValueText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  trialBadge: {
    position: 'absolute',
    top: -10,
    left: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  trialBadgeText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planRadio: {
    marginRight: spacing.md,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  planPricePerMonth: {
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  planPrice: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
  },
  purchaseButton: {
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  restoreButton: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  restoreText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
  },
  terms: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalLink: {
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 11,
  },
});
