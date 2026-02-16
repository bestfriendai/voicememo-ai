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
import { colors, spacing, fontSize, fontWeight } from '../../src/ui/theme';

export default function RecordScreen() {
  const router = useRouter();
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

  // Auto-stop for free users at max duration
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
      // Stop recording
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
      // Check if user can record
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

      // Start recording
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
      // Increment recording count for free users
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
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Recording Status */}
        <View style={styles.statusContainer}>
          <Animated.View
            style={[
              styles.pulseRing,
              isRecording && { transform: [{ scale: pulseAnim }] },
              isRecording && styles.pulseRingActive,
            ]}
          />
          <Text style={styles.statusText}>
            {isProcessing
              ? 'Processing...'
              : isRecording
              ? 'Recording'
              : 'Tap to Record'}
          </Text>
          
          {isRecording && (
            <Text style={styles.durationText}>
              {formatTime(recordingDuration)}
              {maxDuration && (
                <Text style={styles.durationLimit}> / {formatTime(maxDuration)}</Text>
              )}
            </Text>
          )}
          
          {isProcessing && (
            <Text style={styles.processingText}>
              AI is transcribing and summarizing...
            </Text>
          )}

          {!isRecording && !isProcessing && !isPremium && (
            <Text style={styles.limitText}>
              Free: {FREE_LIMITS.maxRecordingDurationSeconds}s max • {FREE_LIMITS.maxRecordingsPerMonth} recordings/month
            </Text>
          )}
        </View>
        
        {/* Tips */}
        {!isRecording && !isProcessing && (
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Tips for best results:</Text>
            <Text style={styles.tip}>• Speak clearly and at a normal pace</Text>
            <Text style={styles.tip}>• Minimize background noise</Text>
            <Text style={styles.tip}>• Hold phone 6-12 inches away</Text>
          </View>
        )}
      </View>
      
      {/* Record Button */}
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
    backgroundColor: colors.background,
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
    backgroundColor: colors.surfaceSecondary,
    position: 'absolute',
  },
  pulseRingActive: {
    backgroundColor: colors.error,
    opacity: 0.2,
  },
  statusText: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
    zIndex: 1,
  },
  durationText: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.error,
    fontVariant: ['tabular-nums'],
  },
  durationLimit: {
    fontSize: fontSize.body,
    color: colors.textTertiary,
    fontWeight: fontWeight.regular,
  },
  processingText: {
    fontSize: fontSize.body,
    color: colors.primary,
    marginTop: spacing.md,
  },
  limitText: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  tipsContainer: {
    marginTop: spacing.xxxl,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    width: '100%',
  },
  tipsTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  tip: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: spacing.xxxl,
  },
});
