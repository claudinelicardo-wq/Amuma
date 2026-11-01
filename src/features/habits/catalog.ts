/**
 * Built-in habit suggestions (static app content, not user data).
 * Content status: DRAFT, pending review by a qualified nutrition/health professional.
 * Rules for every entry: gentle, small, no fasting, no calorie targets, no medical claims.
 */
export type HabitCategory = 'nutrition' | 'activity' | 'hydration' | 'sleep' | 'stress' | 'general';
export type CostTier = 'free' | 'low' | 'moderate';
export type Intensity = 'gentle' | 'moderate';

export type HabitSuggestion = {
  id: string;
  title: string;
  category: HabitCategory;
  minutes: number;
  cost: CostTier;
  intensity: Intensity;
  /** Goal ids this habit supports; used for ranking. */
  goals: string[];
  /** Exercise preference ids this habit matches (activity habits only). */
  exercise?: string[];
  /** Plain-language "why", shown to the user. Education, not medical advice. */
  why: string;
  /** A smaller version offered when the habit feels like too much. */
  easier: string;
};

export const HABIT_CATALOG: HabitSuggestion[] = [
  { id: 'water-glass-morning', title: 'Drink a glass of water after waking up', category: 'hydration', minutes: 1, cost: 'free', intensity: 'gentle', goals: ['steady_energy', 'build_routine'], why: 'A small, easy anchor to start the day with.', easier: 'Keep a glass of water by your bed tonight.' },
  { id: 'water-through-day', title: 'Sip water through the day', category: 'hydration', minutes: 2, cost: 'free', intensity: 'gentle', goals: ['steady_energy'], why: 'Steady sipping is easier to keep up than catching up later.', easier: 'Have one extra glass today.' },
  { id: 'veg-first-bite', title: 'Start one meal with your vegetables', category: 'nutrition', minutes: 5, cost: 'low', intensity: 'gentle', goals: ['balanced_eating', 'steady_energy'], why: 'Fiber-first eating is a simple way to build a balanced plate with the food you already enjoy.', easier: 'Add one spoonful of vegetables to a meal.' },
  { id: 'protein-pairing', title: 'Pair your carbs with a protein you like', category: 'nutrition', minutes: 5, cost: 'low', intensity: 'gentle', goals: ['balanced_eating', 'steady_energy'], why: 'Eggs, fish, tofu, beans or chicken alongside rice or pandesal make a more balanced meal.', easier: 'Add a protein to just one meal today.' },
  { id: 'plate-check', title: 'Build a balanced plate at your main meal', category: 'nutrition', minutes: 10, cost: 'low', intensity: 'moderate', goals: ['balanced_eating'], why: 'A mix of vegetables, protein and your usual rice or noodles, in portions that feel right for you.', easier: 'Just notice what is on your plate, no changes needed.' },
  { id: 'walk-after-meal', title: 'Take a short walk after a meal', category: 'activity', minutes: 10, cost: 'free', intensity: 'gentle', goals: ['movement', 'steady_energy'], exercise: ['walking'], why: 'Gentle movement after eating is an easy way to fit activity into the day.', easier: 'Stand up and stretch for 2 minutes after eating.' },
  { id: 'home-move-15', title: '15 minutes of movement at home', category: 'activity', minutes: 15, cost: 'free', intensity: 'moderate', goals: ['movement'], exercise: ['home_workout', 'dance'], why: 'Short sessions at home count, and need no equipment or gym.', easier: 'Move for just 5 minutes to a song you like.' },
  { id: 'dance-song', title: 'Dance to one or two of your favorite songs', category: 'activity', minutes: 8, cost: 'free', intensity: 'gentle', goals: ['movement', 'manage_stress'], exercise: ['dance'], why: 'Movement works best when it is something you enjoy.', easier: 'Dance to just one song.' },
  { id: 'yoga-stretch', title: 'Gentle stretching or yoga', category: 'activity', minutes: 10, cost: 'free', intensity: 'gentle', goals: ['movement', 'manage_stress'], exercise: ['yoga'], why: 'Slow movement can help you unwind and stay consistent.', easier: 'Stretch your neck and shoulders for 2 minutes.' },
  { id: 'strength-basics', title: 'Simple strength moves (squats, wall push-ups)', category: 'activity', minutes: 15, cost: 'free', intensity: 'moderate', goals: ['movement'], exercise: ['strength'], why: 'Bodyweight moves are a manageable way to build strength at your own pace.', easier: 'Do 5 squats while waiting for the kettle.' },
  { id: 'sleep-wind-down', title: 'Wind down 15 minutes before bed', category: 'sleep', minutes: 15, cost: 'free', intensity: 'gentle', goals: ['better_sleep', 'manage_stress'], why: 'A calm routine helps signal that the day is ending.', easier: 'Put your phone down 5 minutes earlier than usual.' },
  { id: 'sleep-consistent', title: 'Go to bed around the same time', category: 'sleep', minutes: 2, cost: 'free', intensity: 'gentle', goals: ['better_sleep', 'build_routine'], why: 'A steady sleep schedule makes the rest of the day easier to plan.', easier: 'Pick one night this week to go to bed 15 minutes earlier.' },
  { id: 'breathing-3min', title: 'Three minutes of slow breathing', category: 'stress', minutes: 3, cost: 'free', intensity: 'gentle', goals: ['manage_stress'], why: 'A short pause can help you reset during a busy day.', easier: 'Take three slow breaths.' },
  { id: 'gratitude-note', title: 'Write one good thing from today', category: 'stress', minutes: 3, cost: 'free', intensity: 'gentle', goals: ['manage_stress', 'build_routine'], why: 'Noticing small wins supports staying kind to yourself.', easier: 'Think of one good thing, no writing needed.' },
  { id: 'checkin-evening', title: 'Do a quick evening check-in', category: 'general', minutes: 2, cost: 'free', intensity: 'gentle', goals: ['understand_symptoms', 'build_routine'], why: 'Noting how you feel helps you see your own patterns over time.', easier: 'Tap one mood for the day.' },
  { id: 'prep-simple-meal', title: 'Plan tomorrow’s meals in a few minutes', category: 'general', minutes: 5, cost: 'free', intensity: 'gentle', goals: ['balanced_eating', 'build_routine'], why: 'A little planning makes balanced choices easier on busy days.', easier: 'Decide just tomorrow’s breakfast.' },
];
