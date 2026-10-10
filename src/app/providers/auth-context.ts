import { createContext, useContext } from 'react';
import type { AuthUser } from '../../features/auth/types/auth.types';

export type AuthSession =
  | { status: 'unknown' }
  | { status: 'authenticated'; user: AuthUser }
  | { status: 'unauthenticated' };

export interface AuthContextValue {
  session: AuthSession;
  setAuthenticated: (user: AuthUser) => void;
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
