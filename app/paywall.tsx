// Vocap - Paywall Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useVoiceMemoStore } from '@/src/hooks/useVoiceMemo';
import { OFFERINGS, purchaseSubscription, restorePurchases } from '@/src/services/purchases';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '@/src/ui/theme';

export default function PaywallScreen() {
  const router = useRouter();
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Close */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🎙️</Text>
        <Text style={styles.badge}>VOCAP PREMIUM</Text>
        <Text style={styles.title}>Never Forget{'\n'}a Thought</Text>
        <Text style={styles.subtitle}>
          Your voice, transcribed and summarized by AI.{'\n'}Capture every idea effortlessly.
        </Text>
      </View>

      {/* Social Proof */}
      <View style={styles.socialProof}>
        <Text style={styles.socialProofText}>
          ⭐⭐⭐⭐⭐  Join 10,000+ thinkers who never lose an idea
        </Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🔊</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Unlimited Recordings</Text>
            <Text style={styles.featureText}>No limits on length or number of recordings</Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>✨</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>AI Summaries</Text>
            <Text style={styles.featureText}>Every memo auto-summarized with key points</Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📝</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Full Transcripts</Text>
            <Text style={styles.featureText}>Accurate speech-to-text for every recording</Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🎧</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Export Anywhere</Text>
            <Text style={styles.featureText}>Share transcripts and summaries to any app</Text>
          </View>
        </View>
      </View>

      {/* Plans */}
      <View style={styles.plans}>
        {OFFERINGS.map((offering) => (
          <TouchableOpacity
            key={offering.id}
            style={[
              styles.planCard,
              selectedPlan === offering.id && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan(offering.id as 'monthly' | 'annual')}
          >
            {offering.isBestValue && (
              <View style={styles.bestValueBadge}>
                <Text style={styles.bestValueText}>BEST VALUE</Text>
              </View>
            )}
            {offering.trialText && (
              <View style={styles.trialBadge}>
                <Text style={styles.trialBadgeText}>{offering.trialText}</Text>
              </View>
            )}
            <View style={styles.planRow}>
              <View style={styles.planRadio}>
                <View style={[
                  styles.radioOuter,
                  selectedPlan === offering.id && styles.radioOuterSelected,
                ]}>
                  {selectedPlan === offering.id && <View style={styles.radioInner} />}
                </View>
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>
                  {offering.id === 'monthly' ? 'Monthly' : 'Annual'}
                </Text>
                <Text style={styles.planPricePerMonth}>{offering.pricePerMonth}/month</Text>
              </View>
              <Text style={styles.planPrice}>{offering.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Purchase Button */}
      <TouchableOpacity 
        style={[styles.purchaseButton, isLoading && styles.purchaseButtonDisabled]}
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

      {/* Restore */}
      <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
        <Text style={styles.restoreText}>Restore Purchases</Text>
      </TouchableOpacity>

      {/* Terms */}
      <Text style={styles.terms}>
        {selectedPlan === 'annual' 
          ? '3-day free trial, then $39.99/year. ' 
          : ''
        }
        Subscription automatically renews. Cancel anytime in Settings.
      </Text>
      <View style={styles.legalLinks}>
        <TouchableOpacity onPress={() => Linking.openURL('https://vocap.app/terms')}>
          <Text style={styles.legalLink}>Terms of Service</Text>
        </TouchableOpacity>
        <Text style={styles.legalSeparator}>  •  </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://vocap.app/privacy')}>
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </TouchableOpacity>
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
    paddingBottom: spacing.xxxl + 20,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeText: {
    fontSize: 16,
    color: colors.textSecondary,
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
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  socialProof: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  socialProofText: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
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
    color: colors.text,
  },
  featureText: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  plans: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.lg,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceSecondary,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  bestValueText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  trialBadge: {
    position: 'absolute',
    top: -10,
    left: spacing.md,
    backgroundColor: colors.success,
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
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  planPricePerMonth: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  planPrice: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  purchaseButton: {
    backgroundColor: colors.primary,
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
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  terms: {
    fontSize: 11,
    color: colors.textTertiary,
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
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 11,
    color: colors.textTertiary,
  },
});
