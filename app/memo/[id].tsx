// Vocap - Memo Detail Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVoiceMemoStore } from '../../src/hooks/useVoiceMemo';
import { audioService } from '../../src/services/audio';
import { formatDuration, formatDate } from '../../src/services/ai';
import { useThemeColors } from '../../src/contexts/ThemeContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../../src/ui/theme';

export default function MemoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>Memo not found</Text>
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{memo.title}</Text>
        <View style={styles.meta}>
          <Text style={[styles.metaText, { color: colors.textTertiary }]}>{formatDuration(memo.duration)}</Text>
          <Text style={[styles.metaDot, { color: colors.textTertiary }]}>•</Text>
          <Text style={[styles.metaText, { color: colors.textTertiary }]}>{formatDate(memo.createdAt)}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.playButton, { backgroundColor: colors.primary }]} onPress={handlePlay}>
        <Text style={styles.playIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
        <Text style={styles.playText}>
          {isPlaying ? 'Playing...' : 'Play Recording'}
        </Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Summary</Text>
        {isPremium ? (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryText, { color: colors.text }]}>{memo.summary}</Text>
          </View>
        ) : (
          <TouchableOpacity style={[styles.lockedContent, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]} onPress={handleUnlockSummary} activeOpacity={0.7}>
            <Text style={styles.lockedEmoji}>🔒</Text>
            <Text style={[styles.lockedTitle, { color: colors.text }]}>Unlock AI Summaries</Text>
            <Text style={[styles.lockedText, { color: colors.textSecondary }]}>
              Get instant summaries of every recording with Premium
            </Text>
            <View style={[styles.lockedButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.lockedButtonText}>Upgrade to Premium</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Transcript</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.transcriptText, { color: colors.text }]}>{memo.transcript}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tags</Text>
        <View style={styles.tagsContainer}>
          {memo.tags.map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={[styles.exportButton, { backgroundColor: colors.surface, borderColor: colors.primary }]} onPress={handleExport}>
        <Text style={[styles.exportText, { color: colors.primary }]}>
          {isPremium ? '📤 Export Memo' : '🔒 Export (Premium)'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.deleteButton, { backgroundColor: colors.surface, borderColor: colors.error }]} onPress={handleDelete}>
        <Text style={[styles.deleteText, { color: colors.error }]}>Delete Memo</Text>
      </TouchableOpacity>
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
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: fontSize.body,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: fontSize.caption,
  },
  metaDot: {
    fontSize: fontSize.caption,
    marginHorizontal: spacing.xs,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  summaryText: {
    fontSize: fontSize.body,
    lineHeight: 24,
  },
  transcriptText: {
    fontSize: fontSize.body,
    lineHeight: 26,
  },
  lockedContent: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
  },
  lockedEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  lockedTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  lockedText: {
    fontSize: fontSize.caption,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  lockedButton: {
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
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
  },
  exportButton: {
    borderWidth: 1,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  exportText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  deleteButton: {
    borderWidth: 1,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  deleteText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
});
