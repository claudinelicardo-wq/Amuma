import { HABIT_CATALOG } from '@/features/habits/catalog';

import { generateStarterPlan } from '../logic/starterPlan';
import { answersSchema, type OnboardingAnswers } from '../schemas';

const base: OnboardingAnswers = {
  goals: ['balanced_eating', 'movement'], activityLevel: 'light', minutesPerDay: '20',
  budget: 'moderate', exercise: ['walking'], coachingMode: 'guided',
};
const byId = (id: string) => HABIT_CATALOG.find((h) => h.id === id)!;

describe('generateStarterPlan', () => {
  it('produces 7 days, deterministically', () => {
    const p = generateStarterPlan(base);
    expect(p.days).toHaveLength(7);
    expect(generateStarterPlan(base)).toEqual(p);
  });
  it('never exceeds the daily time budget or 4 habits/day', () => {
    for (const m of ['10', '20', '30', '45'] as const) {
      for (const d of generateStarterPlan({ ...base, minutesPerDay: m }).days) {
        expect(d.items.reduce((s, i) => s + i.minutes, 0)).toBeLessThanOrEqual(Number(m));
        expect(d.items.length).toBeLessThanOrEqual(4);
      }
    }
  });
  it('ramps gently: day 1 is lighter than day 6', () => {
    const p = generateStarterPlan({ ...base, minutesPerDay: '45' });
    expect(p.days[0].items.length).toBeLessThan(p.days[5].items.length);
  });
  it('respects budget tiers', () => {
    const p = generateStarterPlan({ ...base, budget: 'tight' });
    for (const d of p.days) for (const i of d.items) expect(byId(i.habitId).cost).toBe('free');
  });
  it('does not give moderate-intensity habits to sedentary users or when activity is unknown', () => {
    for (const level of ['sedentary', undefined] as const) {
      const p = generateStarterPlan({ ...base, activityLevel: level });
      for (const d of p.days) for (const i of d.items) expect(byId(i.habitId).intensity).toBe('gentle');
    }
  });
  it('only suggests activity types the user picked', () => {
    const p = generateStarterPlan({ ...base, exercise: ['yoga'], activityLevel: 'active' });
    for (const d of p.days) for (const i of d.items) {
      const h = byId(i.habitId);
      if (h.category === 'activity') expect(h.exercise).toContain('yoga');
    }
  });
  it('anchors the top-ranked habit on every day', () => {
    const p = generateStarterPlan(base);
    const first = p.days[0].items[0].habitId;
    expect(p.days.every((d) => d.items[0]?.habitId === first)).toBe(true);
  });
  it('does not repeat a habit within a day', () => {
    for (const d of generateStarterPlan({ ...base, minutesPerDay: '45' }).days) {
      const ids = d.items.map((i) => i.habitId);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
  it('gives self-directed users an empty plan', () => {
    const p = generateStarterPlan({ ...base, coachingMode: 'self_directed' });
    expect(p.days.every((d) => d.items.length === 0)).toBe(true);
  });
  it('works with every question skipped', () => {
    const p = generateStarterPlan({});
    expect(p.days).toHaveLength(7);
    expect(p.days[0].items.length).toBeGreaterThan(0);
  });
  it('catalog contains no fasting, calorie-target or medical-claim language', () => {
    const text = HABIT_CATALOG.map((h) => `${h.title} ${h.why} ${h.easier}`).join(' ').toLowerCase();
    for (const bad of ['fast ', 'fasting', 'calorie', 'detox', 'cure', 'reverse', 'treat', 'lose weight', 'insulin', 'supplement', 'medication']) {
      expect(text).not.toContain(bad);
    }
  });
});

describe('answersSchema', () => {
  it('accepts an empty object (everything skippable)', () => {
    expect(answersSchema.safeParse({}).success).toBe(true);
  });
  it('rejects unknown enum values', () => {
    expect(answersSchema.safeParse({ budget: 'unlimited' }).success).toBe(false);
  });
});
