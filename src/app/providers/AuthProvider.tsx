import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../../features/auth/types/auth.types';
import { AuthContext } from './auth-context';
import type { AuthContextValue, AuthSession } from './auth-context';

/**
 * In-memory session holder. Once a backend contract exists, the 'unknown'
 * state should drive a session-restore query on bootstrap.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>({
    status: 'unauthenticated',
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      setAuthenticated: (user: AuthUser) =>
        setSession({ status: 'authenticated', user }),
      clearSession: () => setSession({ status: 'unauthenticated' }),
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
