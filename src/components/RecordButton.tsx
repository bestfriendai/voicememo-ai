// Vocap - Record Button Component
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../contexts/ThemeContext';
import { borderRadius } from '../ui/theme';

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  onPress,
  disabled = false,
}) => {
  const colors = useThemeColors();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.outerRing,
          {
            backgroundColor: colors.surface,
            borderColor: isRecording ? colors.error : disabled ? colors.border : colors.primary,
          },
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View
          style={[
            styles.innerButton,
            {
              backgroundColor: isRecording ? colors.error : disabled ? colors.border : colors.primary,
            },
          ]}
        >
          {isRecording && <View style={[styles.stopIcon, { backgroundColor: colors.surface }]} />}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  innerButton: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
});
