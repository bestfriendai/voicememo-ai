// Vocap - Tabs Layout
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { useThemeColors } from '../../src/contexts/ThemeContext';
import { fontSize } from '../../src/ui/theme';

export default function TabsLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 85,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          fontSize: fontSize.largeTitle,
          fontWeight: '700',
          color: colors.text,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Memos',
          headerTitle: 'Voice Memos',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="🎙️" color={color} activeColor={colors.tabActive} />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: 'Record',
          headerTitle: 'Record',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="🔴" color={color} activeColor={colors.tabActive} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: 'Settings',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="⚙️" color={color} activeColor={colors.tabActive} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, color, activeColor }: { icon: string; color: string; activeColor: string }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, { opacity: color === activeColor ? 1 : 0.5 }]}>
        {icon}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
});
