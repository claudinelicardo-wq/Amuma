import { useOnboardingStore } from '../onboardingStore';

jest.mock('@/lib/secureStorage', () => {
  const mockData = new Map<string, string>();
  return {
    authStorage: {
      getItem: async (k: string) => mockData.get(k) ?? null,
      setItem: async (k: string, v: string) => { mockData.set(k, v); },
      removeItem: async (k: string) => { mockData.delete(k); },
    },
  };
});

beforeEach(() => useOnboardingStore.getState().reset());

describe('onboardingStore', () => {
  it('starts incomplete with no answers', () => {
    const s = useOnboardingStore.getState();
    expect(s.completed).toBe(false);
    expect(s.answers).toEqual({});
  });
  it('merges answers without losing earlier ones', () => {
    const { setAnswers } = useOnboardingStore.getState();
    setAnswers({ budget: 'tight' });
    setAnswers({ goals: ['movement'] });
    expect(useOnboardingStore.getState().answers).toEqual({ budget: 'tight', goals: ['movement'] });
  });
  it('de-duplicates custom habits and supports removal', () => {
    const s = useOnboardingStore.getState();
    s.addCustomHabit('Evening walk');
    s.addCustomHabit('Evening walk');
    expect(useOnboardingStore.getState().customHabits).toEqual(['Evening walk']);
    s.removeCustomHabit('Evening walk');
    expect(useOnboardingStore.getState().customHabits).toEqual([]);
  });
  it('reset clears everything including completion, with fresh arrays', () => {
    const s = useOnboardingStore.getState();
    s.addCustomHabit('x');
    s.complete();
    s.reset();
    const after = useOnboardingStore.getState();
    expect(after.completed).toBe(false);
    expect(after.customHabits).toEqual([]);
  });
});
