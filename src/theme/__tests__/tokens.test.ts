import { darkColors, lightColors, radius, spacing, themes } from '../tokens';

describe('design tokens', () => {
  it('matches the brand light palette', () => {
    expect(lightColors).toMatchObject({
      background: '#F6F3EC', surface: '#FFFFFF', surfaceSecondary: '#EEEAE1',
      primary: '#747D62', onPrimary: '#FFFFFF', text: '#343832', textSecondary: '#77786F', border: '#E8E4DA',
    });
  });
  it('matches the brand dark palette', () => {
    expect(darkColors).toMatchObject({
      background: '#20241F', surface: '#2B3029', surfaceSecondary: '#343A31',
      primary: '#A9B394', onPrimary: '#20241F', text: '#F0EEE6', textSecondary: '#B6B7AC', border: '#41473E',
    });
  });
  it('defines the spacing and radius scale', () => {
    expect(Object.values(spacing)).toEqual([4, 8, 16, 24, 32, 40]);
    expect(radius).toEqual({ sm: 8, md: 12, lg: 16, xl: 20, pill: 999 });
  });
  it('light and dark themes expose identical token keys', () => {
    expect(Object.keys(themes.light.colors).sort()).toEqual(Object.keys(themes.dark.colors).sort());
  });
});
