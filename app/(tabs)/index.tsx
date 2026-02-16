// Vocap - Home/Memos Screen
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useVoiceMemoStore } from '../../src/hooks/useVoiceMemo';
import { MemoCard } from '../../src/components/MemoCard';
import { EmptyState } from '../../src/components/EmptyState';
import { useThemeColors } from '../../src/contexts/ThemeContext';
import { spacing, fontSize, fontWeight } from '../../src/ui/theme';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { memos, loadMemos, isPremium } = useVoiceMemoStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMemos();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMemos();
    setRefreshing(false);
  };

  const handleMemoPress = (id: string) => {
    router.push(`/memo/${id}`);
  };

  if (memos.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          title="No Voice Memos Yet"
          subtitle="Tap the Record tab to create your first voice memo with AI transcription and summary."
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={memos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemoCard memo={item} onPress={() => handleMemoPress(item.id)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.count, { color: colors.textTertiary }]}>
              {memos.length} {memos.length === 1 ? 'memo' : 'memos'}
            </Text>
            {!isPremium && (
              <Text style={[styles.premiumHint, { color: colors.primary }]}>
                🔒 Premium: Unlimited AI transcription
              </Text>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  count: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
  },
  premiumHint: {
    fontSize: fontSize.caption,
    marginTop: spacing.xs,
  },
});
