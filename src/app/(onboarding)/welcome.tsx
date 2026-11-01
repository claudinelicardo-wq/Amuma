import { router } from 'expo-router';

import { Button, Card, Screen, Text } from '@/components/ui';
import { STEPS } from '@/features/onboarding/steps';

export default function WelcomeScreen() {
  return (
    <Screen>
      <Text variant="display" accessibilityRole="header">amuma</Text>
      <Text variant="heading">Let&apos;s set up your starting point</Text>
      <Text tone="secondary">
        A few quick questions help us suggest a gentle seven-day plan. Every question is optional, and you can skip any of them.
      </Text>
      <Card>
        <Text variant="label" tone="primary">Good to know</Text>
        <Text tone="secondary">
          AMUMA offers lifestyle support and education. It does not diagnose, treat or cure any condition, and it is not a substitute for care from a health professional.
        </Text>
      </Card>
      <Button label="Begin" onPress={() => router.push(`/step/${STEPS[0].id}`)} />
    </Screen>
  );
}
