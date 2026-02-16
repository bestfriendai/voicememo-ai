// Vocap - Memo Detail Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
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

  const handleExport = async () => {
    if (!isPremium) {
      Alert.alert(
        'Premium Feature',
        'Export is available with Vocap Premium. Unlock unlimited exports, AI summaries, and more.',
        [
          { text: 'Upgrade', onPress: () => router.push('/paywall') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    try {
      await Share.share({
        message: `${memo.title}\n\nSummary:\n${memo.summary}\n\nTranscript:\n${memo.transcript}\n\nTags: ${memo.tags.join(', ')}\n\n— Exported from Vocap`,
      });
    } catch {
      // user cancelled
    }
  };

  const handleUnlockSummary = () => {
    router.push('/paywall');
  };

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
      </View>

      {/* Play Button */}
      <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
        <Text style={styles.playIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
        <Text style={styles.playText}>
          {isPlaying ? 'Playing...' : 'Play Recording'}
        </Text>
      </TouchableOpacity>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        {isPremium ? (
          <View style={styles.card}>
            <Text style={styles.summaryText}>{memo.summary}</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.lockedContent} onPress={handleUnlockSummary} activeOpacity={0.7}>
            <Text style={styles.lockedEmoji}>🔒</Text>
            <Text style={styles.lockedTitle}>Unlock AI Summaries</Text>
            <Text style={styles.lockedText}>
              Get instant summaries of every recording with Premium
            </Text>
            <View style={styles.lockedButton}>
              <Text style={styles.lockedButtonText}>Upgrade to Premium</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Transcript */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transcript</Text>
        <View style={styles.card}>
          <Text style={styles.transcriptText}>{memo.transcript}</Text>
        </View>
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

      {/* Export Button */}
      <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
        <Text style={styles.exportText}>
          {isPremium ? '📤 Export Memo' : '🔒 Export (Premium)'}
        </Text>
      </TouchableOpacity>

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
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  playIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  playText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: '#FFFFFF',
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
    borderWidth: 1,
    borderColor: colors.border,
  },
  lockedEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  lockedTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  lockedText: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  lockedButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  lockedButtonText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
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
  exportButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  exportText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  deleteText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.error,
  },
});
