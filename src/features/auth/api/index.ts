import { isSupabaseConfigured } from '@/lib/env';
import { supabase } from '@/lib/supabase';

import { PRIVACY_POLICY_VERSION, type SignInValues, type SignUpValues } from '../schemas';

export type AuthResult = { ok: true; needsEmailConfirmation?: boolean } | { ok: false; message: string };

const NOT_CONFIGURED = 'AMUMA is not connected to a backend yet. Add your Supabase details to .env.';

/** Translate backend errors into calm, user-facing messages (no raw error leakage). */
export function friendlyAuthError(message: string | undefined): string {
  const m = (message ?? '').toLowerCase();
  if (m.includes('invalid login')) return 'That email and password do not match. Please try again.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'An account with this email already exists. Try signing in instead.';
  if (m.includes('email not confirmed')) return 'Please confirm your email first, then sign in.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Too many attempts. Please wait a moment and try again.';
  if (m.includes('network') || m.includes('fetch')) return 'We could not reach AMUMA. Check your connection and try again.';
  return 'Something went wrong. Please try again.';
}

export async function signIn(values: SignInValues): Promise<AuthResult> {
  if (!isSupabaseConfigured) return { ok: false, message: NOT_CONFIGURED };
  try {
    const { error } = await supabase.auth.signInWithPassword(values);
    return error ? { ok: false, message: friendlyAuthError(error.message) } : { ok: true };
  } catch (e) {
    return { ok: false, message: friendlyAuthError(e instanceof Error ? e.message : undefined) };
  }
}

export async function signUp(values: SignUpValues): Promise<AuthResult> {
  if (!isSupabaseConfigured) return { ok: false, message: NOT_CONFIGURED };
  try {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      // Consent travels in metadata; a DB trigger records it and rejects signup without it.
      options: { data: { display_name: values.displayName ?? '', privacy_policy_version: PRIVACY_POLICY_VERSION } },
    });
    if (error) return { ok: false, message: friendlyAuthError(error.message) };
    return { ok: true, needsEmailConfirmation: !data.session };
  } catch (e) {
    return { ok: false, message: friendlyAuthError(e instanceof Error ? e.message : undefined) };
  }
}

export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();
    return error ? { ok: false, message: friendlyAuthError(error.message) } : { ok: true };
  } catch (e) {
    return { ok: false, message: friendlyAuthError(e instanceof Error ? e.message : undefined) };
  }
}

/** Permanently deletes the account and all user data (server-side cascade), then clears the local session. */
export async function deleteAccount(): Promise<AuthResult> {
  try {
    const { error } = await supabase.rpc('delete_my_account');
    if (error) return { ok: false, message: 'We could not delete your account. Please try again.' };
    await supabase.auth.signOut({ scope: 'local' });
    return { ok: true };
  } catch {
    return { ok: false, message: 'We could not delete your account. Please try again.' };
  }
}
