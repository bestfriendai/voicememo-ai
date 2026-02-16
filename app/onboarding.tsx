// Vocap - Onboarding Screen
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/src/contexts/ThemeContext';
import { spacing, borderRadius, fontSize, fontWeight } from '@/src/ui/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ONBOARDING_KEY = 'onboarding_complete';

interface OnboardingPage {
  emoji: string;
  title: string;
  subtitle: string;
}

const pages: OnboardingPage[] = [
  {
    emoji: '🎙️',
    title: 'Capture Your Voice',
    subtitle: 'Record any thought, idea, or meeting instantly. Just tap and talk.',
  },
  {
    emoji: '✨',
    title: 'AI Does the Work',
    subtitle: 'Automatic transcription and smart summaries powered by AI. No typing needed.',
  },
  {
    emoji: '🧠',
    title: 'Never Forget',
    subtitle: 'Search, organize, and export your ideas. Your second brain, always listening.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const scrollRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentPage < pages.length - 1) {
      scrollRef.current?.scrollTo({ x: SCREEN_WIDTH * (currentPage + 1), animated: true });
    }
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)');
  };

  const handleStartTrial = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/paywall');
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const isLastPage = currentPage === pages.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!isLastPage && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {pages.map((page, index) => (
          <View key={index} style={styles.page}>
            <Text style={styles.emoji}>{page.emoji}</Text>
            <Text style={[styles.pageTitle, { color: colors.text }]}>{page.title}</Text>
            <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>{page.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: colors.border },
                currentPage === index && { backgroundColor: colors.primary, width: 24 },
              ]}
            />
          ))}
        </View>

        {isLastPage ? (
          <View style={styles.ctaContainer}>
            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleStartTrial}>
              <Text style={styles.primaryButtonText}>Start Your Free Trial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
              <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleNext}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.xxl,
  },
  pageTitle: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  pageSubtitle: {
    fontSize: fontSize.body,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  bottom: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl + 20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ctaContainer: {
    gap: spacing.md,
  },
  primaryButton: {
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
  },
});
