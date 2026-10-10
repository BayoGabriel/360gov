import { Navigate, Outlet, useLocation } from 'react-router';
import { ROUTES } from '../../shared/constants/routes';
import { useAuth } from '../providers/auth-context';

export function RequireAuth() {
  const { session } = useAuth();
  const location = useLocation();

  if (session.status === 'unknown') {
    return <p role="status">Restoring session…</p>;
  }
  if (session.status === 'unauthenticated') {
    return (
      <Navigate
        to={ROUTES.login}
        state={{ from: location.pathname }}
        replace
      />
    );
  }
  return <Outlet />;
}

export function GuestOnly() {
  const { session } = useAuth();

  if (session.status === 'authenticated') {
    return <Navigate to={ROUTES.dashboard} replace />;
  }
  return <Outlet />;
}
