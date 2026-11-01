import { useState } from 'react';

import { Button, Card, Screen, Text } from '@/components/ui';
import { deleteAccount } from '@/features/auth/api';

export default function DeleteAccountSettings() {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    setBusy(true);
    setError(null);
    const result = await deleteAccount();
    setBusy(false);
    if (!result.ok) setError(result.message);
    // On success the session is cleared and the route gate returns to sign-in.
  };

  return (
    <Screen contentStyle={{ paddingTop: 0 }}>
      <Card>
        <Text variant="subheading">Delete your account</Text>
        <Text tone="secondary">
          This permanently removes your account and all of your data, including habits, check-ins and posts. It cannot be undone.
        </Text>
      </Card>
      {error ? <Text tone="danger" accessibilityLiveRegion="polite">{error}</Text> : null}
      {confirming ? (
        <>
          <Text>Are you sure? This is permanent.</Text>
          <Button label="Yes, delete everything" onPress={onDelete} loading={busy} />
          <Button label="Keep my account" variant="secondary" onPress={() => setConfirming(false)} disabled={busy} />
        </>
      ) : (
        <Button label="Delete my account" variant="secondary" onPress={() => setConfirming(true)} />
      )}
    </Screen>
  );
}
