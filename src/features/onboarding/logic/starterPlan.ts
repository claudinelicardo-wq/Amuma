import { HABIT_CATALOG, type HabitSuggestion } from '@/features/habits/catalog';

import type { OnboardingAnswers } from '../schemas';

export type PlanItem = { habitId: string; title: string; minutes: number; why: string; easier: string };
export type PlanDay = { day: number; items: PlanItem[] };
export type StarterPlan = { days: PlanDay[] };

/** Hard caps keep the plan gentle; the plan ramps up instead of starting full. */
const MAX_PER_DAY = 4;
const RAMP = [2, 2, 3, 3, 3, 4, 3]; // habits per day, days 1-7

const BUDGET_ALLOWED: Record<string, string[]> = {
  tight: ['free'],
  moderate: ['free', 'low'],
  flexible: ['free', 'low', 'moderate'],
};

function score(h: HabitSuggestion, a: OnboardingAnswers): number {
  let s = 0;
  for (const g of a.goals ?? []) if (h.goals.includes(g)) s += 3;
  if (h.exercise && a.exercise?.some((e) => h.exercise!.includes(e))) s += 3;
  if (h.category === 'hydration') s += 1; // low-effort foundations rank up slightly
  return s;
}

function eligible(h: HabitSuggestion, a: OnboardingAnswers): boolean {
  if (!BUDGET_ALLOWED[a.budget ?? 'tight'].includes(h.cost)) return false;
  // Never start someone who is mostly sitting on moderate-intensity habits.
  if ((a.activityLevel === undefined || a.activityLevel === 'sedentary') && h.intensity === 'moderate') return false;
  // If the user named exercise preferences, skip activity habits they did not pick.
  if (h.category === 'activity' && a.exercise?.length && !(h.exercise ?? []).some((e) => a.exercise!.includes(e))) {
    return false;
  }
  return true;
}

/**
 * Deterministic, rules-based 7-day starter plan. No AI involved.
 * Guarantees: respects time budget, budget tier, activity level and exercise preferences;
 * ramps gently; never produces fasting or calorie-target habits (none exist in the catalog).
 * Self-directed users get an empty plan (they build their own).
 */
export function generateStarterPlan(a: OnboardingAnswers): StarterPlan {
  if (a.coachingMode === 'self_directed') {
    return { days: Array.from({ length: 7 }, (_, i) => ({ day: i + 1, items: [] })) };
  }
  const minutesCap = Number(a.minutesPerDay ?? '10');
  const ranked = HABIT_CATALOG.filter((h) => eligible(h, a))
    .map((h, i) => ({ h, s: score(h, a), i }))
    .sort((x, y) => y.s - x.s || x.i - y.i) // stable, deterministic tie-break
    .map((x) => x.h);

  // The top-ranked habit is an anchor: it appears every day so consistency builds around
  // what the user cares most about. The remaining slots rotate for variety.
  const [anchor, ...rest] = ranked;
  const days: PlanDay[] = RAMP.map((count, idx) => {
    const items: PlanItem[] = [];
    let used = 0;
    const add = (h: (typeof ranked)[number]) => {
      if (items.length >= Math.min(count, MAX_PER_DAY)) return;
      if (used + h.minutes > minutesCap) return;
      items.push({ habitId: h.id, title: h.title, minutes: h.minutes, why: h.why, easier: h.easier });
      used += h.minutes;
    };
    if (anchor) add(anchor);
    rest.map((_, k) => rest[(k + idx) % rest.length]).forEach(add);
    return { day: idx + 1, items };
  });
  return { days };
}
