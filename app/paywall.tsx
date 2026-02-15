// VoiceMemo AI - Paywall Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useVoiceMemoStore } from '../../src/hooks/useVoiceMemo';
import { OFFERINGS, purchaseSubscription, restorePurchases } from '../../src/services/purchases';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../src/ui/theme';

export default function PaywallScreen() {
  const router = useRouter();
  const { isPremium, setIsPremium } = useVoiceMemoStore();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // Mock purchase - in production, use RevenueCat SDK
      const success = await purchaseSubscription(
        selectedPlan === 'monthly' 
          ? OFFERINGS[0].productId 
          : OFFERINGS[1].productId
      );
      
      if (success) {
        setIsPremium(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success!', 'Welcome to VoiceMemo AI Premium!', [
          { text: 'Awesome!', onPress: () => router.back() }
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.badge}>⭐ PREMIUM</Text>
        <Text style={styles.title}>Unlock Unlimited Voice Memos</Text>
        <Text style={styles.subtitle}>
          Get unlimited AI transcriptions, summaries, and smart tagging
        </Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>✨</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Unlimited Transcriptions</Text>
            <Text style={styles.featureText}>No limits on AI-powered speech-to-text</Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📝</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>AI Summaries</Text>
            <Text style={styles.featureText}>Auto-generated summaries for every memo</Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🏷️</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Smart Tags</Text>
            <Text style={styles.featureText}>AI suggests relevant tags automatically</Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🔒</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Priority Support</Text>
            <Text style={styles.featureText}>Get help faster with premium support</Text>
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
              offering.isBestValue && styles.planCardBest,
            ]}
            onPress={() => setSelectedPlan(offering.id as 'monthly' | 'annual')}
          >
            {offering.isBestValue && (
              <View style={styles.bestValueBadge}>
                <Text style={styles.bestValueText}>BEST VALUE</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <Text style={styles.planName}>
                {offering.id === 'monthly' ? 'Monthly' : 'Annual'}
              </Text>
              <Text style={styles.planPrice}>{offering.price}</Text>
            </View>
            <Text style={styles.planPricePerMonth}>{offering.pricePerMonth}/month</Text>
            <Text style={styles.planDescription}>{offering.description}</Text>
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
          {isLoading ? 'Processing...' : `Subscribe for ${selectedPlan === 'monthly' ? OFFERINGS[0].price : OFFERINGS[1].price}`}
        </Text>
      </TouchableOpacity>

      {/* Restore */}
      <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
        <Text style={styles.restoreText}>Restore Purchases</Text>
      </TouchableOpacity>

      {/* Terms */}
      <Text style={styles.terms}>
        Subscription automatically renews. Cancel anytime in Settings.
        By subscribing, you agree to our Terms of Service and Privacy Policy.
      </Text>
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  badge: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
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
    fontSize: 24,
    marginRight: spacing.md,
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
  planCardBest: {
    borderColor: colors.primary,
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
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  planName: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  planPrice: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  planPricePerMonth: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  planDescription: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
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
    color: colors.surface,
  },
  restoreButton: {
    alignItems: 'center',
    marginBottom: spacing.xl,
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
  },
});
