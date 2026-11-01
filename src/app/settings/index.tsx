import { Ionicons } from '@expo/vector-icons';
import { Link, type Href } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import { signOut } from '@/features/auth/api';
import { useSession } from '@/features/auth/SessionProvider';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { minTouchTarget, useTheme } from '@/theme';

const ITEMS: { href: Href; label: string }[] = [
  { href: '/settings/profile', label: 'Profile' },
  { href: '/settings/health-preferences', label: 'Health preferences' },
  { href: '/settings/coaching-mode', label: 'Coaching mode' },
  { href: '/settings/appearance', label: 'Appearance' },
  { href: '/settings/notifications', label: 'Notification preferences' },
  { href: '/settings/subscription', label: 'Subscription' },
  { href: '/settings/privacy', label: 'Privacy and consent' },
  { href: '/settings/delete-account', label: 'Account deletion' },
];

export default function SettingsScreen() {
  const { colors, radius } = useTheme();
  const { previewMode } = useSession();
  const resetOnboarding = useOnboardingStore((st) => st.reset);
  return (
    <Screen contentStyle={{ paddingTop: 0 }}>
      <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
        {ITEMS.map((item, i) => (
          <Link key={item.label} href={item.href} asChild>
            <Pressable
              accessibilityRole="link"
              style={{
                minHeight: minTouchTarget + 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                borderTopWidth: i === 0 ? 0 : 1,
                borderTopColor: colors.border,
              }}
            >
              <Text>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </Pressable>
          </Link>
        ))}
      </View>
      {previewMode ? (
        <Button label="Restart onboarding (preview mode)" variant="secondary" onPress={resetOnboarding} />
      ) : (
        <Button label="Sign out" variant="secondary" onPress={() => void signOut()} />
      )}
    </Screen>
  );
}
