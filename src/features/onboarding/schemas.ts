import { z } from 'zod';

export const GOALS = [
  { id: 'steady_energy', label: 'Steadier energy' },
  { id: 'balanced_eating', label: 'Balanced eating' },
  { id: 'movement', label: 'Move more' },
  { id: 'better_sleep', label: 'Better sleep' },
  { id: 'manage_stress', label: 'Manage stress' },
  { id: 'build_routine', label: 'Build a steady routine' },
  { id: 'understand_symptoms', label: 'Understand my symptoms' },
] as const;

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Mostly sitting' },
  { id: 'light', label: 'Lightly active' },
  { id: 'moderate', label: 'Moderately active' },
  { id: 'active', label: 'Very active' },
] as const;

export const MINUTES = [
  { id: '10', label: 'About 10 minutes' },
  { id: '20', label: 'About 20 minutes' },
  { id: '30', label: 'About 30 minutes' },
  { id: '45', label: '45 minutes or more' },
] as const;

export const BUDGETS = [
  { id: 'tight', label: 'Keep it very affordable' },
  { id: 'moderate', label: 'Some flexibility' },
  { id: 'flexible', label: 'Flexible' },
] as const;

export const DIETARY = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'no_pork', label: 'No pork' },
  { id: 'halal', label: 'Halal' },
  { id: 'lactose_free', label: 'Lactose-free' },
  { id: 'gluten_free', label: 'Gluten-free' },
] as const;

export const EXERCISE = [
  { id: 'walking', label: 'Walking' },
  { id: 'home_workout', label: 'Home workouts' },
  { id: 'dance', label: 'Dancing' },
  { id: 'yoga', label: 'Yoga or stretching' },
  { id: 'strength', label: 'Strength moves' },
] as const;

export const COACHING_MODES = [
  { id: 'guided', label: 'Guided: AMUMA suggests my daily habits' },
  { id: 'hybrid', label: 'Hybrid: suggestions, but I stay in control' },
  { id: 'self_directed', label: 'Self-directed: I make my own plan' },
] as const;

export const REMINDER_TIMES = [
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
  { id: 'none', label: 'No reminders for now' },
] as const;

/** Every field optional: users may skip any question, and nothing here is required to have an account. */
export const answersSchema = z.object({
  pmosContext: z.enum(['diagnosed', 'suspected', 'learning', 'prefer_not_to_say']).optional(),
  goals: z.array(z.string()).max(7).optional(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active']).optional(),
  minutesPerDay: z.enum(['10', '20', '30', '45']).optional(),
  dietary: z.array(z.string()).optional(),
  allergies: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
  budget: z.enum(['tight', 'moderate', 'flexible']).optional(),
  exercise: z.array(z.string()).optional(),
  coachingMode: z.enum(['guided', 'hybrid', 'self_directed']).optional(),
  reminderTime: z.enum(['morning', 'afternoon', 'evening', 'none']).optional(),
  healthDataConsent: z.boolean().optional(),
});

export type OnboardingAnswers = z.infer<typeof answersSchema>;

export const customHabitSchema = z.object({
  title: z.string().trim().min(2, 'Give your habit a short name').max(80, 'Use 80 characters or fewer'),
});
