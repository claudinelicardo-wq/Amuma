import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';

import { Button, Card, Screen, Text } from '@/components/ui';
import { FormTextField } from '@/features/auth/AuthForm';
import { signUp } from '@/features/auth/api';
import { signUpSchema, type SignUpValues } from '@/features/auth/schemas';
import { minTouchTarget, useTheme } from '@/theme';

export default function SignUpScreen() {
  const { colors, radius } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const { control, handleSubmit, formState } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '', acceptedPrivacy: false },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    const result = await signUp(values);
    if (!result.ok) return setError(result.message);
    if (result.needsEmailConfirmation) setConfirmEmail(true);
  });

  if (confirmEmail) {
    return (
      <Screen>
        <Text variant="title" accessibilityRole="header">Check your email</Text>
        <Card>
          <Text>We sent you a confirmation link. Open it, then come back to sign in.</Text>
        </Card>
        <Link href="/sign-in"><Text tone="primary" variant="bodyStrong">Go to sign in</Text></Link>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text variant="title" accessibilityRole="header">Create your account</Text>
      <Text tone="secondary">No health details needed to get started. You can share those later, only if you want to.</Text>
      <FormTextField control={control} name="displayName" label="Name (optional)" autoComplete="name" />
      <FormTextField control={control} name="email" label="Email" email autoComplete="email" />
      <FormTextField control={control} name="password" label="Password" secure autoComplete="new-password" />
      <FormTextField control={control} name="confirmPassword" label="Confirm password" secure autoComplete="new-password" />
      <Controller
        control={control}
        name="acceptedPrivacy"
        render={({ field, fieldState }) => (
          <View style={{ gap: 4 }}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: field.value }}
              onPress={() => field.onChange(!field.value)}
              style={{ flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: minTouchTarget }}
            >
              <View
                style={{
                  width: 24, height: 24, borderRadius: radius.sm, borderWidth: 1.5,
                  borderColor: colors.primary, backgroundColor: field.value ? colors.primary : 'transparent',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                {field.value ? <Text variant="caption" style={{ color: colors.onPrimary }}>✓</Text> : null}
              </View>
              <Text style={{ flex: 1 }}>I agree to the AMUMA privacy policy.</Text>
            </Pressable>
            {fieldState.error ? <Text variant="caption" tone="danger">{fieldState.error.message}</Text> : null}
          </View>
        )}
      />
      {error ? <Text tone="danger" accessibilityLiveRegion="polite">{error}</Text> : null}
      <Button label="Create account" onPress={() => void onSubmit()} loading={formState.isSubmitting} />
      <View style={{ alignItems: 'center' }}>
        <Link href="/sign-in"><Text tone="primary" variant="bodyStrong">Already have an account? Sign in</Text></Link>
      </View>
    </Screen>
  );
}
