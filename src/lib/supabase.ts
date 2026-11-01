import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { env } from './env';

/**
 * Supabase client (anon key only; all access is governed by RLS).
 * Session persistence uses AsyncStorage for the foundation milestone;
 * Milestone 1 moves tokens to an encrypted expo-secure-store adapter.
 */
export const supabase = createClient(env.supabaseUrl || 'http://localhost:54321', env.supabaseAnonKey || 'missing-anon-key', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
