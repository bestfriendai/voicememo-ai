// VoiceMemo AI - Memo Detail Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVoiceMemoStore } from '../../src/hooks/useVoiceMemo';
import { audioService } from '../../src/services/audio';
import { formatDuration, formatDate } from '../../src/services/ai';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../src/ui/theme';

export default function MemoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { memos, deleteMemo, isPremium } = useVoiceMemoStore();
  
  const memo = memos.find((m) => m.id === id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<any>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  if (!memo) {
    return (
      <View style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Memo not found</Text>
        </View>
      </View>
    );
  }

  const handlePlay = async () => {
    if (isPlaying) {
      await sound?.stopAsync();
      setIsPlaying(false);
    } else {
      const newSound = await audioService.playRecording(memo.audioUri);
      if (newSound) {
        setSound(newSound);
        setIsPlaying(true);
        newSound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      }
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Memo',
      'Are you sure you want to delete this voice memo? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await audioService.deleteRecordingFile(memo.audioUri);
            deleteMemo(memo.id);
            router.back();
          },
        },
      ]
    );
  };

  const isLocked = memo.isPremium && !isPremium;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{memo.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{formatDuration(memo.duration)}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{formatDate(memo.createdAt)}</Text>
        </View>
        
        {/* Premium Badge */}
        {memo.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>
              {isLocked ? '🔒 Premium' : '🎉 Premium Memo'}
            </Text>
          </View>
        )}
      </View>

      {/* Play Button */}
      <TouchableOpacity 
        style={[styles.playButton, isLocked && styles.playButtonLocked]}
        onPress={handlePlay}
        disabled={isLocked}
      >
        <Text style={styles.playIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
        <Text style={[styles.playText, isLocked && styles.playTextLocked]}>
          {isLocked ? 'Unlock to Play' : isPlaying ? 'Playing...' : 'Play Recording'}
        </Text>
      </TouchableOpacity>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        {isLocked ? (
          <View style={styles.lockedContent}>
            <Text style={styles.lockedText}>
              🔒 Upgrade to Premium to unlock AI-generated summary
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.summaryText}>{memo.summary}</Text>
          </View>
        )}
      </View>

      {/* Transcript */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transcript</Text>
        {isLocked ? (
          <View style={styles.lockedContent}>
            <Text style={styles.lockedText}>
              🔒 Upgrade to Premium to unlock full transcript
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.transcriptText}>{memo.transcript}</Text>
          </View>
        )}
      </View>

      {/* Tags */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagsContainer}>
          {memo.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Memo</Text>
      </TouchableOpacity>
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
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
  },
  metaDot: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    marginHorizontal: spacing.xs,
  },
  premiumBadge: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.md,
  },
  premiumText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  playButtonLocked: {
    backgroundColor: colors.border,
  },
  playIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  playText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  playTextLocked: {
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.section,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  summaryText: {
    fontSize: fontSize.body,
    color: colors.text,
    lineHeight: 24,
  },
  transcriptText: {
    fontSize: fontSize.body,
    color: colors.text,
    lineHeight: 26,
  },
  lockedContent: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  lockedText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: fontSize.caption,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  deleteButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  deleteText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.error,
  },
});
