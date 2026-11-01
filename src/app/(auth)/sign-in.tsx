import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import { FormTextField } from '@/features/auth/AuthForm';
import { signIn } from '@/features/auth/api';
import { signInSchema, type SignInValues } from '@/features/auth/schemas';

export default function SignInScreen() {
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    const result = await signIn(values);
    if (!result.ok) setError(result.message);
    // On success the session listener updates the route gate automatically.
  });

  return (
    <Screen>
      <Text variant="display" accessibilityRole="header">amuma</Text>
      <Text tone="secondary">Welcome back. Managing PMOS, one step at a time.</Text>
      <FormTextField control={control} name="email" label="Email" email autoComplete="email" />
      <FormTextField control={control} name="password" label="Password" secure autoComplete="password" />
      {error ? <Text tone="danger" accessibilityLiveRegion="polite">{error}</Text> : null}
      <Button label="Sign in" onPress={() => void onSubmit()} loading={formState.isSubmitting} />
      <View style={{ alignItems: 'center' }}>
        <Link href="/sign-up"><Text tone="primary" variant="bodyStrong">New here? Create an account</Text></Link>
      </View>
    </Screen>
  );
}
