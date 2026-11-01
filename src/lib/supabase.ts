import { createClient } from '@supabase/supabase-js';

import { env } from './env';
import { authStorage } from './secureStorage';

/**
 * Supabase client (anon key only; all access is governed by RLS).
 * Session tokens are stored in the device keychain/keystore via expo-secure-store.
 */
export const supabase = createClient(env.supabaseUrl || 'http://localhost:54321', env.supabaseAnonKey || 'missing-anon-key', {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
