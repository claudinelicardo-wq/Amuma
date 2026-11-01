import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme, type TextVariant } from '@/theme';

type Props = RNTextProps & {
  variant?: TextVariant;
  tone?: 'default' | 'secondary' | 'primary' | 'danger';
};

export function Text({ variant = 'body', tone = 'default', style, ...rest }: Props) {
  const { colors, typography } = useTheme();
  const color =
    tone === 'secondary' ? colors.textSecondary : tone === 'primary' ? colors.primary : tone === 'danger' ? colors.danger : colors.text;
  return <RNText {...rest} style={[typography[variant], { color }, style]} />;
}
