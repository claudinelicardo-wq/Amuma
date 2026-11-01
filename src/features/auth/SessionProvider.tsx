import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { isSupabaseConfigured } from '@/lib/env';
import { supabase } from '@/lib/supabase';

type SessionState = {
  session: Session | null;
  loading: boolean;
  /** True when no Supabase credentials are configured: the app runs locally with no account. */
  previewMode: boolean;
};

const SessionContext = createContext<SessionState>({ session: null, loading: true, previewMode: false });

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ session: null, loading: isSupabaseConfigured, previewMode: !isSupabaseConfigured });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => active && setState({ session: data.session, loading: false, previewMode: false }))
      .catch(() => active && setState({ session: null, loading: false, previewMode: false }));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ session, loading: false, previewMode: false });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => state, [state]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
