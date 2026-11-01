import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { TextField } from '@/components/ui';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  secure?: boolean;
  email?: boolean;
  autoComplete?: 'email' | 'password' | 'new-password' | 'name';
};

/** Binds a TextField to react-hook-form with Zod errors surfaced inline. */
export function FormTextField<T extends FieldValues>({ control, name, label, secure, email, autoComplete }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          label={label}
          value={(field.value as string | undefined) ?? ''}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
          secureTextEntry={secure}
          keyboardType={email ? 'email-address' : 'default'}
          autoCapitalize={email || secure ? 'none' : 'words'}
          autoCorrect={false}
          autoComplete={autoComplete}
        />
      )}
    />
  );
}
