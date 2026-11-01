import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button, Card, Screen, Text, TextField } from '@/components/ui';
import { generateStarterPlan } from '@/features/onboarding/logic/starterPlan';
import { customHabitSchema } from '@/features/onboarding/schemas';
import { useOnboardingStore } from '@/stores/onboardingStore';

export default function PlanScreen() {
  const { answers, plan, customHabits, setPlan, addCustomHabit, removeCustomHabit, complete } = useOnboardingStore();
  const { control, handleSubmit, reset } = useForm<{ title: string }>({
    resolver: zodResolver(customHabitSchema),
    defaultValues: { title: '' },
  });

  useEffect(() => {
    if (!plan) setPlan(generateStarterPlan(answers));
  }, [plan, answers, setPlan]);

  const reject = (habitId: string) => {
    if (!plan) return;
    setPlan({ days: plan.days.map((d) => ({ ...d, items: d.items.filter((i) => i.habitId !== habitId) })) });
  };
  const regenerate = () => setPlan(generateStarterPlan(answers));
  const onAdd = handleSubmit(({ title }) => {
    addCustomHabit(title.trim());
    reset();
  });

  const selfDirected = answers.coachingMode === 'self_directed';
  const hasAnything = (plan?.days.some((d) => d.items.length > 0) ?? false) || customHabits.length > 0;

  return (
    <Screen>
      <Text variant="title" accessibilityRole="header">{selfDirected ? 'Build your own plan' : 'Your 7-day starter plan'}</Text>
      <Text tone="secondary">
        {selfDirected
          ? 'You chose to make your own plan. Add the habits you want below.'
          : 'Start small. You are in control: remove anything that does not feel right, or add your own.'}
      </Text>

      {plan?.days.map((d) => d.items.length > 0 && (
        <Card key={d.day}>
          <Text variant="subheading">Day {d.day}</Text>
          {d.items.map((item) => (
            <View key={item.habitId} style={{ gap: 4, paddingVertical: 8 }}>
              <Text variant="bodyStrong">{item.title}</Text>
              <Text variant="caption" tone="secondary">About {item.minutes} min · {item.why}</Text>
              <Text variant="caption" tone="secondary">Easier option: {item.easier}</Text>
              <Button label="Not for me" variant="ghost" onPress={() => reject(item.habitId)} accessibilityHint="Removes this habit from the whole week" />
            </View>
          ))}
        </Card>
      ))}

      <Card>
        <Text variant="subheading">Add your own habit</Text>
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <TextField label="Habit name" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} placeholder="e.g. Evening walk with Nanay" />
          )}
        />
        <Button label="Add habit" variant="secondary" onPress={() => void onAdd()} />
        {customHabits.map((t) => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ flex: 1 }}>{t}</Text>
            <Button label="Remove" variant="ghost" onPress={() => removeCustomHabit(t)} />
          </View>
        ))}
      </Card>

      <Text variant="caption" tone="secondary">
        These are lifestyle suggestions, not medical advice. Talk with a health professional about your care.
      </Text>

      {!selfDirected ? <Button label="Reset suggestions" variant="ghost" onPress={regenerate} /> : null}
      <Button label={hasAnything ? 'Start my plan' : 'Continue without a plan'} onPress={complete} />
    </Screen>
  );
}
