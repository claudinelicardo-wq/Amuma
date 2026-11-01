import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { StarterPlan } from '@/features/onboarding/logic/starterPlan';
import type { OnboardingAnswers } from '@/features/onboarding/schemas';
import { authStorage } from '@/lib/secureStorage';

type OnboardingState = {
  answers: OnboardingAnswers;
  plan: StarterPlan | null;
  customHabits: string[];
  completed: boolean;
  setAnswers: (patch: Partial<OnboardingAnswers>) => void;
  setPlan: (plan: StarterPlan) => void;
  addCustomHabit: (title: string) => void;
  removeCustomHabit: (title: string) => void;
  complete: () => void;
  reset: () => void;
};

const initial = (): Pick<OnboardingState, 'answers' | 'plan' | 'customHabits' | 'completed'> => ({
  answers: {},
  plan: null,
  customHabits: [],
  completed: false,
});

/**
 * INTERIM on-device storage (no backend yet). Onboarding answers include health context,
 * so they are kept in the encrypted keychain/keystore store, not plain AsyncStorage.
 * When Supabase is connected (Milestone 2 backend step), this store becomes a draft
 * cache and `complete()` syncs to health_profiles / user_consents.
 */
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initial(),
      setAnswers: (patch) => set((s) => ({ answers: { ...s.answers, ...patch } })),
      setPlan: (plan) => set({ plan }),
      addCustomHabit: (title) => set((s) => (s.customHabits.includes(title) ? s : { customHabits: [...s.customHabits, title] })),
      removeCustomHabit: (title) => set((s) => ({ customHabits: s.customHabits.filter((t) => t !== title) })),
      complete: () => set({ completed: true }),
      reset: () => set(initial()),
    }),
    { name: 'amuma.onboarding', storage: createJSONStorage(() => authStorage) },
  ),
);

/** True once the persisted state has been read from storage. */
export function useOnboardingHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useOnboardingStore.persist.onFinishHydration(onChange),
    () => useOnboardingStore.persist.hasHydrated(),
    () => false,
  );
}
