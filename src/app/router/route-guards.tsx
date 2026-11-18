import { Navigate, Outlet, useLocation } from 'react-router';
import {
  can,
  type Capability,
} from '../../shared/auth/permissions';
import { ROUTES } from '../../shared/constants/routes';
import { ForbiddenPage } from '../errors/ForbiddenPage';
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

/**
 * Denies a route subtree to users lacking the capability. Rendered inside
 * RequireAuth, so an unauthenticated session never reaches it; the status
 * checks below are only a fallback for direct composition.
 */
export function RequireCapability({
  capability,
}: {
  capability: Capability;
}) {
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
  if (!can(session.user, capability)) {
    return <ForbiddenPage />;
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
