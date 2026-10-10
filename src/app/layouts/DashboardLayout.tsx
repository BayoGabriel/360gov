import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useLogoutMutation } from '../../features/auth';
import { ROUTES } from '../../shared/constants/routes';
import { useAuth } from '../providers/auth-context';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopbar } from './DashboardTopbar';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, clearSession } = useAuth();
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();

  // RequireAuth guarantees an authenticated session before rendering here.
  if (session.status !== 'authenticated') return null;
  const user = session.user;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        clearSession();
        navigate(ROUTES.login, { replace: true });
      },
    });
  };

  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>
      <DashboardSidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <div className={styles.main}>
        <DashboardTopbar
          user={user}
          sidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main id="main-content" className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
