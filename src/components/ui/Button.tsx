import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { minTouchTarget, useTheme } from '@/theme';

import { Text } from './Text';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
};

export function Button({ label, variant = 'primary', loading, disabled, style, ...rest }: Props) {
  const { colors, radius, spacing } = useTheme();
  const isPrimary = variant === 'primary';
  const bg = isPrimary ? colors.primary : variant === 'secondary' ? colors.surfaceSecondary : 'transparent';
  const fg = isPrimary ? colors.onPrimary : colors.text;
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      style={(state) => [
        {
          minHeight: minTouchTarget + 4,
          paddingHorizontal: spacing.lg,
          borderRadius: radius.pill,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: inactive ? 0.5 : state.pressed ? 0.85 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      {loading ? <ActivityIndicator color={fg} /> : <Text variant="bodyStrong" style={{ color: fg }}>{label}</Text>}
    </Pressable>
  );
}
