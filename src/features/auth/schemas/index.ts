import { z } from 'zod';

/** Bump when the privacy policy text changes; stored with the user's consent. */
export const PRIVACY_POLICY_VERSION = '2026-11-draft';

const email = z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address'));
const password = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(72, 'Use 72 characters or fewer');

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
});

export const signUpSchema = z
  .object({
    displayName: z.string().trim().max(60, 'Use 60 characters or fewer').optional(),
    email,
    password,
    confirmPassword: z.string(),
    acceptedPrivacy: z.boolean().refine((v) => v === true, 'Please accept the privacy policy to continue'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
