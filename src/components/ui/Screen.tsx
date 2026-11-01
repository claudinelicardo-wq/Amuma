import type { ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

type Props = { children: ReactNode; scroll?: boolean; contentStyle?: ViewStyle };

/** Themed screen container with safe-area handling and consistent gutters. */
export function Screen({ children, scroll = true, contentStyle }: Props) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const padding: ViewStyle = { padding: spacing.md, paddingTop: spacing.md + insets.top, gap: spacing.md };

  if (!scroll) {
    return <View style={[{ flex: 1, backgroundColor: colors.background }, padding, contentStyle]}>{children}</View>;
  }
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[padding, { paddingBottom: spacing.xl }, contentStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
