# Design System

Warm minimalist: calm, neutral, approachable, intelligent, inclusive. Avoid heavy pink, floral/stereotypical imagery and clinical UI. Source of truth: `src/theme/tokens.ts`. Components use `useTheme()`; **no hardcoded colors**.

## Color
| Token | Light | Dark |
| --- | --- | --- |
| background | #F6F3EC | #20241F |
| surface | #FFFFFF | #2B3029 |
| surfaceSecondary | #EEEAE1 | #343A31 |
| primary | #747D62 | #A9B394 |
| onPrimary | #FFFFFF | #20241F |
| text | #343832 | #F0EEE6 |
| textSecondary | #77786F | #B6B7AC |
| border | #E8E4DA | #41473E |

Added semantic tokens (success/warning/danger/onDanger) are my additions for form errors and destructive actions; they are muted to fit the palette.

**Contrast audit (WCAG, computed):**

| Pair | Ratio | Verdict |
| --- | --- | --- |
| text on background (light) | 10.8:1 | Pass |
| onPrimary on primary (light) | 4.33:1 | Just under AA 4.5:1 for normal text; passes for large/bold text (3:1) |
| textSecondary on background (light) | 4.03:1 | Under AA for body text |
| textSecondary on surface (light) | 4.47:1 | Marginally under AA |
| primary as text on background (light) | 3.91:1 | Fails AA for body text; use only for large/bold labels |
| Dark theme pairs | 7.2-7.8:1 | Pass |

The specified light-theme brand hex values are kept as given. Recommendation (decision needed): darken light `primary` to about #6B7459 and `textSecondary` to about #6A6B63 to clear 4.5:1.

## Theme modes
Light, dark, follow system. Preference persisted on-device (`amuma.appearance`), settable in Settings → Appearance.

## Typography
Headings **Manrope** (600/700), body **Inter** (400/500/600). Variants: display 32, title 24, heading 20, subheading 16, body 16, label 14, caption 13. All text scales with the system font size; layouts must tolerate it. The wordmark is lowercase: `amuma`.

## Spacing / radius
Spacing 4, 8, 16, 24, 32, 40 (`xs…xxl`). Radius: sm 8, md 12, lg 16, xl 20, pill 999.

## Components (`src/components/ui`)
`Text`, `Screen` (safe-area + gutters), `Card` (subtle border, restrained shadow), `Button` (primary/secondary/ghost, pill, ≥48pt, loading state), `PlaceholderScreen` (for unbuilt routes; never shows fake data). Icons: Ionicons outline set.

## Rules
Minimum touch target 44pt · generous whitespace · every async view has loading/error/empty/success states · never shame in copy; encouraging tone.
