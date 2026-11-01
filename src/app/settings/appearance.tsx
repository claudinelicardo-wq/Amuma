import { Pressable } from 'react-native';

import { Card, Screen, Text } from '@/components/ui';
import { minTouchTarget, useTheme, type AppearancePreference } from '@/theme';

const OPTIONS: { value: AppearancePreference; label: string }[] = [
  { value: 'system', label: 'Follow system' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

/** Fully functional: preference is persisted on-device by the appearance store. */
export default function AppearanceScreen() {
  const { colors, radius, preference, setPreference } = useTheme();
  return (
    <Screen contentStyle={{ paddingTop: 0 }}>
      <Card>
        {OPTIONS.map(({ value, label }) => {
          const selected = preference === value;
          return (
            <Pressable
              key={value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setPreference(value)}
              style={{
                minHeight: minTouchTarget,
                justifyContent: 'center',
                paddingHorizontal: 12,
                borderRadius: radius.md,
                backgroundColor: selected ? colors.surfaceSecondary : 'transparent',
              }}
            >
              <Text variant={selected ? 'bodyStrong' : 'body'}>{label}</Text>
            </Pressable>
          );
        })}
      </Card>
    </Screen>
  );
}
