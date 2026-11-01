import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button, Screen, Text, TextField } from '@/components/ui';
import { stepIndex, STEPS, type StepConfig } from '@/features/onboarding/steps';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { minTouchTarget, useTheme } from '@/theme';

function Chip({ label, selected, onPress, multi }: { label: string; selected: boolean; onPress: () => void; multi: boolean }) {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected, selected }}
      style={{
        minHeight: minTouchTarget + 4, paddingHorizontal: 16, paddingVertical: 10, justifyContent: 'center',
        borderRadius: radius.lg, borderWidth: 1.5,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.surfaceSecondary : colors.surface,
      }}
    >
      <Text variant={selected ? 'bodyStrong' : 'body'}>{label}</Text>
    </Pressable>
  );
}

export default function StepScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const idx = stepIndex(String(id));
  const step: StepConfig | undefined = STEPS[idx];
  const answers = useOnboardingStore((s) => s.answers);
  const setAnswers = useOnboardingStore((s) => s.setAnswers);
  const [draft, setDraft] = useState('');

  if (!step) return <Screen><Text>This step could not be found.</Text><Button label="Start over" onPress={() => router.replace('/welcome')} /></Screen>;

  const goNext = () => {
    const next = STEPS[idx + 1];
    router.push(next ? `/step/${next.id}` : '/plan');
  };

  const current = answers[step.key];
  const toggle = (optId: string) => {
    const list = (Array.isArray(current) ? current : []) as string[];
    setAnswers({ [step.key]: list.includes(optId) ? list.filter((x) => x !== optId) : [...list, optId] });
  };
  const addListItem = () => {
    const v = draft.trim().slice(0, 40);
    const list = (Array.isArray(current) ? current : []) as string[];
    if (v && list.length < 10 && !list.includes(v)) setAnswers({ [step.key]: [...list, v] });
    setDraft('');
  };
  const selectedSingle = step.key === 'healthDataConsent' ? (current === true ? 'yes' : current === false ? 'no' : undefined) : current;
  const pickSingle = (optId: string) =>
    setAnswers({ [step.key]: step.key === 'healthDataConsent' ? optId === 'yes' : optId } as never);
  const hasAnswer = Array.isArray(current) ? current.length > 0 : current !== undefined;

  return (
    <Screen>
      <Text variant="caption" tone="secondary">Step {idx + 1} of {STEPS.length}</Text>
      <Text variant="title" accessibilityRole="header">{step.title}</Text>
      {step.subtitle ? <Text tone="secondary">{step.subtitle}</Text> : null}

      <View style={{ gap: 8 }}>
        {step.kind === 'single' && step.options.map((o) => (
          <Chip key={o.id} label={o.label} multi={false} selected={selectedSingle === o.id} onPress={() => pickSingle(o.id)} />
        ))}
        {step.kind === 'multi' && step.options.map((o) => (
          <Chip key={o.id} label={o.label} multi selected={Array.isArray(current) && (current as string[]).includes(o.id)} onPress={() => toggle(o.id)} />
        ))}
        {step.kind === 'list' && (
          <>
            <TextField label="Add an item" value={draft} onChangeText={setDraft} placeholder={step.placeholder} onSubmitEditing={addListItem} returnKeyType="done" />
            <Button label="Add" variant="secondary" onPress={addListItem} disabled={!draft.trim()} />
            {(Array.isArray(current) ? (current as string[]) : []).map((item) => (
              <Chip key={item} label={`${item}  ✕`} multi selected onPress={() => toggle(item)} />
            ))}
          </>
        )}
      </View>

      <Button label={hasAnswer ? 'Next' : 'Skip'} variant={hasAnswer ? 'primary' : 'secondary'} onPress={goNext} />
      {idx > 0 ? <Button label="Back" variant="ghost" onPress={() => router.back()} /> : null}
    </Screen>
  );
}
