import { Card } from './Card';
import { Screen } from './Screen';
import { Text } from './Text';

type Props = { title: string; description: string; milestone: string };

/**
 * Marks a route whose real implementation lands in a later milestone.
 * Contains NO fake data — only a label — so prototype UI can never be
 * mistaken for a real backend-driven feature.
 */
export function PlaceholderScreen({ title, description, milestone }: Props) {
  return (
    <Screen>
      <Text variant="title" accessibilityRole="header">{title}</Text>
      <Card>
        <Text variant="label" tone="primary">Not built yet · {milestone}</Text>
        <Text tone="secondary">{description}</Text>
      </Card>
    </Screen>
  );
}
