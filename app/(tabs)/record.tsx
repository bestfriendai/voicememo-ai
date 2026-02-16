// Vocap - Record Screen
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useVoiceMemoStore, VoiceMemo } from '../../src/hooks/useVoiceMemo';
import { RecordButton } from '../../src/components/RecordButton';
import { audioService } from '../../src/services/audio';
import { transcribeAndSummarize, generateTitle } from '../../src/services/ai';
import { canRecord, incrementMonthlyRecordingCount, FREE_LIMITS } from '../../src/services/purchases';
import { useThemeColors } from '../../src/contexts/ThemeContext';
import { spacing, fontSize, fontWeight } from '../../src/ui/theme';

export default function RecordScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { addMemo, isRecording, setIsRecording, isPremium, refreshRecordingCount } = useVoiceMemoStore();
  
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    checkPermissions();
    refreshRecordingCount();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && !isPremium && recordingDuration >= FREE_LIMITS.maxRecordingDurationSeconds) {
      handleAutoStop();
    }
  }, [recordingDuration, isRecording, isPremium]);

  const handleAutoStop = async () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const result = await audioService.stopRecording();
    if (result) {
      Alert.alert(
        'Recording Limit Reached',
        `Free recordings are limited to ${FREE_LIMITS.maxRecordingDurationSeconds} seconds. Upgrade to Premium for unlimited length.`,
        [
          { text: 'Upgrade', onPress: () => router.push('/paywall') },
          { text: 'Keep This Memo', onPress: () => processRecording(result.uri, result.duration) },
        ]
      );
    }
  };

  const checkPermissions = async () => {
    const granted = await audioService.requestPermissions();
    setHasPermission(granted);
    if (!granted) {
      Alert.alert(
        'Microphone Permission Required',
        'Vocap needs microphone access to record voice notes. Please enable it in Settings.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRecordToggle = async () => {
    if (isProcessing) return;
    
    if (!hasPermission) {
      checkPermissions();
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      const result = await audioService.stopRecording();
      if (result) {
        await processRecording(result.uri, result.duration);
      }
    } else {
      const recordCheck = await canRecord();
      if (!recordCheck.allowed) {
        Alert.alert(
          'Recording Limit Reached',
          recordCheck.reason || 'Upgrade to Premium for unlimited recordings.',
          [
            { text: 'Upgrade', onPress: () => router.push('/paywall') },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        return;
      }

      const started = await audioService.startRecording();
      if (started) {
        setIsRecording(true);
        setRecordingDuration(0);
        
        timerRef.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
      }
    }
  };

  const processRecording = async (uri: string, duration: number) => {
    setIsProcessing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    try {
      await incrementMonthlyRecordingCount();
      await refreshRecordingCount();

      const result = await transcribeAndSummarize(uri);
      const title = generateTitle(result.transcript);
      
      const newMemo: VoiceMemo = {
        id: Date.now().toString(),
        title,
        transcript: result.transcript,
        summary: result.summary,
        tags: result.tags,
        audioUri: uri,
        duration,
        createdAt: Date.now(),
        isPremium: false,
      };
      
      addMemo(newMemo);
      router.push(`/memo/${newMemo.id}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to process voice memo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maxDuration = isPremium ? null : FREE_LIMITS.maxRecordingDurationSeconds;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <Animated.View
            style={[
              styles.pulseRing,
              { backgroundColor: colors.surfaceSecondary },
              isRecording && { transform: [{ scale: pulseAnim }] },
              isRecording && { backgroundColor: colors.error, opacity: 0.2 },
            ]}
          />
          <Text style={[styles.statusText, { color: colors.text }]}>
            {isProcessing
              ? 'Processing...'
              : isRecording
              ? 'Recording'
              : 'Tap to Record'}
          </Text>
          
          {isRecording && (
            <Text style={[styles.durationText, { color: colors.error }]}>
              {formatTime(recordingDuration)}
              {maxDuration && (
                <Text style={[styles.durationLimit, { color: colors.textTertiary }]}> / {formatTime(maxDuration)}</Text>
              )}
            </Text>
          )}
          
          {isProcessing && (
            <Text style={[styles.processingText, { color: colors.primary }]}>
              AI is transcribing and summarizing...
            </Text>
          )}

          {!isRecording && !isProcessing && !isPremium && (
            <Text style={[styles.limitText, { color: colors.textTertiary }]}>
              Free: {FREE_LIMITS.maxRecordingDurationSeconds}s max • {FREE_LIMITS.maxRecordingsPerMonth} recordings/month
            </Text>
          )}
        </View>
        
        {!isRecording && !isProcessing && (
          <View style={[styles.tipsContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.tipsTitle, { color: colors.text }]}>Tips for best results:</Text>
            <Text style={[styles.tip, { color: colors.textSecondary }]}>• Speak clearly and at a normal pace</Text>
            <Text style={[styles.tip, { color: colors.textSecondary }]}>• Minimize background noise</Text>
            <Text style={[styles.tip, { color: colors.textSecondary }]}>• Hold phone 6-12 inches away</Text>
          </View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <RecordButton
          isRecording={isRecording}
          onPress={handleRecordToggle}
          disabled={isProcessing}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  statusContainer: {
    alignItems: 'center',
  },
  pulseRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'absolute',
  },
  statusText: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
    zIndex: 1,
  },
  durationText: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    fontVariant: ['tabular-nums'],
  },
  durationLimit: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.regular,
  },
  processingText: {
    fontSize: fontSize.body,
    marginTop: spacing.md,
  },
  limitText: {
    fontSize: fontSize.caption,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  tipsContainer: {
    marginTop: spacing.xxxl,
    borderRadius: 12,
    padding: spacing.lg,
    width: '100%',
  },
  tipsTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  tip: {
    fontSize: fontSize.caption,
    lineHeight: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: spacing.xxxl,
  },
});
