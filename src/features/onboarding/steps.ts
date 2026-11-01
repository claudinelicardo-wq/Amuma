import {
  ACTIVITY_LEVELS, BUDGETS, COACHING_MODES, DIETARY, EXERCISE, GOALS, MINUTES, REMINDER_TIMES,
  type OnboardingAnswers,
} from './schemas';

type Option = { id: string; label: string };

export type StepConfig = {
  id: string;
  title: string;
  subtitle?: string;
  key: keyof OnboardingAnswers;
} & (
  | { kind: 'single'; options: readonly Option[] }
  | { kind: 'multi'; options: readonly Option[] }
  | { kind: 'list'; placeholder: string }
);

/** Ordered onboarding questions. Every step is skippable; none are required to use AMUMA. */
export const STEPS: StepConfig[] = [
  { id: 'pmos', key: 'pmosContext', kind: 'single', title: 'Where are you with PMOS?', subtitle: 'Only if you want to share. This helps us choose a kind starting point.',
    options: [
      { id: 'diagnosed', label: 'I have a diagnosis from a health professional' },
      { id: 'suspected', label: 'I think I may have PMOS' },
      { id: 'learning', label: 'I am still learning about it' },
      { id: 'prefer_not_to_say', label: 'I would rather not say' },
    ] },
  { id: 'goals', key: 'goals', kind: 'multi', title: 'What would you like help with?', subtitle: 'Pick as many as you like.', options: GOALS },
  { id: 'activity', key: 'activityLevel', kind: 'single', title: 'How active are your days right now?', subtitle: 'No judgement. We start where you are.', options: ACTIVITY_LEVELS },
  { id: 'time', key: 'minutesPerDay', kind: 'single', title: 'How much time can you give each day?', subtitle: 'Small is fine. Consistency beats intensity.', options: MINUTES },
  { id: 'dietary', key: 'dietary', kind: 'multi', title: 'Any eating preferences or restrictions?', subtitle: 'Skip if none.', options: DIETARY },
  { id: 'allergies', key: 'allergies', kind: 'list', title: 'Any food allergies?', subtitle: 'Add them one at a time. Skip if none.', placeholder: 'e.g. shrimp, peanuts' },
  { id: 'budget', key: 'budget', kind: 'single', title: 'What feels comfortable for your food budget?', options: BUDGETS },
  { id: 'exercise', key: 'exercise', kind: 'multi', title: 'What kind of movement do you enjoy?', subtitle: 'We will only suggest what you pick.', options: EXERCISE },
  { id: 'coaching', key: 'coachingMode', kind: 'single', title: 'How would you like AMUMA to help?', subtitle: 'You can change this anytime without losing your progress.', options: COACHING_MODES },
  { id: 'reminders', key: 'reminderTime', kind: 'single', title: 'When would you like gentle reminders?', options: REMINDER_TIMES },
  { id: 'consent', key: 'healthDataConsent', kind: 'single', title: 'Use your answers to personalize?', subtitle: 'Optional. Your answers stay private to you, and you can change this later in Settings.',
    options: [
      { id: 'yes', label: 'Yes, personalize AMUMA for me' },
      { id: 'no', label: 'Not now' },
    ] },
];

export const stepIndex = (id: string) => STEPS.findIndex((s) => s.id === id);
