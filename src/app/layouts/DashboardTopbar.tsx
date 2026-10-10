import { Bell, Menu } from 'lucide-react';
import type { AuthUser } from '../../features/auth';
import { Avatar } from '../../shared/components/Avatar/Avatar';
import { formatDashboardTimestamp } from '../../shared/lib/format-date';
import styles from './DashboardTopbar.module.css';

interface DashboardTopbarProps {
  user: AuthUser;
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

export function DashboardTopbar({
  user,
  sidebarOpen,
  onMenuClick,
}: DashboardTopbarProps) {
  const firstName = user.displayName.split(' ')[0] ?? user.displayName;
  const now = new Date();

  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={styles.menuButton}
        aria-label="Open navigation"
        aria-expanded={sidebarOpen}
        aria-controls="app-sidebar"
        onClick={onMenuClick}
      >
        <Menu size={22} aria-hidden="true" />
      </button>
      <div className={styles.greeting}>
        <p className={styles.hello}>
          <span aria-hidden="true"></span>Hi, {firstName}
        </p>
        <p className={styles.date}>{formatDashboardTimestamp(now)}</p>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Notifications"
        >
          <Bell size={20} aria-hidden="true" />
        </button>
        <Avatar name={user.displayName} />
      </div>
    </header>
  );
}
