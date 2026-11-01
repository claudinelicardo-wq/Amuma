/**
 * AMUMA design tokens — the single source of truth for color, spacing,
 * radius and typography. Components must read these via `useTheme()`;
 * never hardcode colors in components.
 */

export type ColorTokens = {
  background: string;
  surface: string;
  surfaceSecondary: string;
  primary: string;
  onPrimary: string;
  text: string;
  textSecondary: string;
  border: string;
  // Semantic states (muted, in keeping with the warm-minimal palette)
  success: string;
  warning: string;
  danger: string;
  onDanger: string;
};

export const lightColors: ColorTokens = {
  background: '#F6F3EC',
  surface: '#FFFFFF',
  surfaceSecondary: '#EEEAE1',
  primary: '#747D62',
  onPrimary: '#FFFFFF',
  text: '#343832',
  textSecondary: '#77786F',
  border: '#E8E4DA',
  success: '#5E7A4F',
  warning: '#A7782B',
  danger: '#A8493F',
  onDanger: '#FFFFFF',
};

export const darkColors: ColorTokens = {
  background: '#20241F',
  surface: '#2B3029',
  surfaceSecondary: '#343A31',
  primary: '#A9B394',
  onPrimary: '#20241F',
  text: '#F0EEE6',
  textSecondary: '#B6B7AC',
  border: '#41473E',
  success: '#9DB88A',
  warning: '#D6A95A',
  danger: '#E08A7F',
  onDanger: '#20241F',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 } as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 } as const;

/** Minimum accessible touch target (iOS HIG 44pt / Material 48dp). */
export const minTouchTarget = 44;

export const fontFamily = {
  heading: 'Manrope_700Bold',
  headingSemibold: 'Manrope_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
} as const;

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'label';

type TypeStyle = { fontFamily: string; fontSize: number; lineHeight: number; letterSpacing?: number };

export const typography: Record<TextVariant, TypeStyle> = {
  display: { fontFamily: fontFamily.heading, fontSize: 32, lineHeight: 40, letterSpacing: -0.5 },
  title: { fontFamily: fontFamily.heading, fontSize: 24, lineHeight: 32, letterSpacing: -0.3 },
  heading: { fontFamily: fontFamily.headingSemibold, fontSize: 20, lineHeight: 28 },
  subheading: { fontFamily: fontFamily.headingSemibold, fontSize: 16, lineHeight: 24 },
  body: { fontFamily: fontFamily.body, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fontFamily.bodySemibold, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: fontFamily.bodyMedium, fontSize: 14, lineHeight: 20 },
};

/** Restrained shadow — borders do most of the work in this design. */
export const shadow = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type AppearancePreference = 'system' | ColorScheme;

export type Theme = {
  scheme: ColorScheme;
  colors: ColorTokens;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadow: typeof shadow;
};

export const themes: Record<ColorScheme, Theme> = {
  light: { scheme: 'light', colors: lightColors, spacing, radius, typography, shadow },
  dark: { scheme: 'dark', colors: darkColors, spacing, radius, typography, shadow },
};
