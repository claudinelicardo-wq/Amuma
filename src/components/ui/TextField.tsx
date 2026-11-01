import { TextInput, View, type TextInputProps } from 'react-native';

import { fontFamily, minTouchTarget, useTheme } from '@/theme';

import { Text } from './Text';

type Props = TextInputProps & { label: string; error?: string };

export function TextField({ label, error, style, ...rest }: Props) {
  const { colors, radius, spacing } = useTheme();
  return (
    <View style={{ gap: spacing.xs }}>
      <Text variant="label">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textSecondary}
        style={[
          {
            minHeight: minTouchTarget + 4,
            borderWidth: 1,
            borderColor: error ? colors.danger : colors.border,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            backgroundColor: colors.surface,
            color: colors.text,
            fontFamily: fontFamily.body,
            fontSize: 16,
          },
          style,
        ]}
        {...rest}
      />
      {error ? <Text variant="caption" tone="danger" accessibilityLiveRegion="polite">{error}</Text> : null}
    </View>
  );
}
