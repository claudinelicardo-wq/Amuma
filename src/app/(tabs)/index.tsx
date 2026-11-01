import { Link } from 'expo-router';

import { Card, Screen, Text } from '@/components/ui';

/** Foundation shell for Home. Dashboard content arrives in Milestone 3. */
export default function HomeScreen() {
  return (
    <Screen>
      <Text variant="display" accessibilityRole="header">amuma</Text>
      <Text tone="secondary">Managing PMOS, one step at a time.</Text>
      <Card>
        <Text variant="label" tone="primary">Not built yet · Milestone 3</Text>
        <Text tone="secondary">
          Greeting, daily check-in, today&apos;s habits, Glucose Smart tip and coach message will live here.
        </Text>
      </Card>
      <Link href="/glucose-smart" asChild>
        <Card accessibilityRole="link"><Text variant="subheading">Glucose Smart</Text></Card>
      </Link>
      <Link href="/settings" asChild>
        <Card accessibilityRole="link"><Text variant="subheading">Settings</Text></Card>
      </Link>
    </Screen>
  );
}
