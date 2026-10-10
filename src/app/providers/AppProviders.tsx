import type { ReactNode } from 'react';
import { ToastProvider } from '../../shared/components/Toast';
import { AuthProvider } from './AuthProvider';
import { QueryProvider } from './QueryProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
