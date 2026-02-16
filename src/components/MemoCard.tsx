// Vocap - Memo Card Component
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../contexts/ThemeContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../ui/theme';
import { VoiceMemo } from '../hooks/useVoiceMemo';
import { formatDuration, formatDate } from '../services/ai';

interface MemoCardProps {
  memo: VoiceMemo;
  onPress: () => void;
  onDelete?: () => void;
}

export const MemoCard: React.FC<MemoCardProps> = ({ memo, onPress, onDelete }) => {
  const colors = useThemeColors();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel={`Voice memo: ${memo.title}`}
      accessibilityRole="button"
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {memo.title}
          </Text>
          {memo.isPremium && (
            <View style={[styles.premiumBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.premiumText, { color: colors.surface }]}>PRO</Text>
            </View>
          )}
        </View>
        
        <Text style={[styles.summary, { color: colors.textSecondary }]} numberOfLines={2}>
          {memo.summary}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.meta}>
            <Text style={[styles.duration, { color: colors.textTertiary }]}>{formatDuration(memo.duration)}</Text>
            <Text style={[styles.dot, { color: colors.textTertiary }]}>•</Text>
            <Text style={[styles.date, { color: colors.textTertiary }]}>{formatDate(memo.createdAt)}</Text>
          </View>
          
          <View style={styles.tags}>
            {memo.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors.surfaceSecondary }]}>
                <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    overflow: 'hidden',
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  premiumBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  summary: {
    fontSize: fontSize.body,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
  },
  dot: {
    fontSize: fontSize.caption,
    marginHorizontal: spacing.xs,
  },
  date: {
    fontSize: fontSize.caption,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    fontSize: 11,
    fontWeight: fontWeight.medium,
  },
});
