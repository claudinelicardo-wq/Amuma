import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/theme';

export function Card({ style, ...rest }: ViewProps) {
  const { colors, radius, spacing, shadow } = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radius.lg,
          padding: spacing.md,
          gap: spacing.sm,
        },
        shadow.card,
        style,
      ]}
    />
  );
}
