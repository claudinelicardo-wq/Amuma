import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { fontFamily, useTheme } from '@/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Home', icon: 'home-outline' },
  { name: 'habits', title: 'Habits', icon: 'checkmark-circle-outline' },
  { name: 'coach', title: 'Coach', icon: 'chatbubble-ellipses-outline' },
  { name: 'community', title: 'Community', icon: 'people-outline' },
  { name: 'progress', title: 'Progress', icon: 'stats-chart-outline' },
];

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fontFamily.bodyMedium, fontSize: 11 },
      }}
    >
      {TABS.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarAccessibilityLabel: title,
            tabBarIcon: ({ size, focused }) => (
              <Ionicons name={icon} size={size} color={focused ? colors.primary : colors.textSecondary} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
