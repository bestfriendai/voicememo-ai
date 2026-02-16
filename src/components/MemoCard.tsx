// Vocap - Memo Card Component
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../ui/theme';
import { VoiceMemo } from '../hooks/useVoiceMemo';
import { formatDuration, formatDate } from '../services/ai';

interface MemoCardProps {
  memo: VoiceMemo;
  onPress: () => void;
  onDelete?: () => void;
}

export const MemoCard: React.FC<MemoCardProps> = ({ memo, onPress, onDelete }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel={`Voice memo: ${memo.title}`}
      accessibilityRole="button"
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {memo.title}
          </Text>
          {memo.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PRO</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.summary} numberOfLines={2}>
          {memo.summary}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.meta}>
            <Text style={styles.duration}>{formatDuration(memo.duration)}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.date}>{formatDate(memo.createdAt)}</Text>
          </View>
          
          <View style={styles.tags}>
            {memo.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
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
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.text,
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  summary: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
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
    color: colors.textTertiary,
    fontWeight: fontWeight.medium,
  },
  dot: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    marginHorizontal: spacing.xs,
  },
  date: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
});
