import { LogOut } from 'lucide-react';
import type { AuthUser } from '../../features/auth';
import { Avatar } from '../../shared/components/Avatar/Avatar';
import styles from './DashboardSidebar.module.css';

interface SidebarUserFooterProps {
  user: AuthUser;
  onLogout: () => void;
}

export function SidebarUserFooter({ user, onLogout }: SidebarUserFooterProps) {
  return (
    <div className={styles.userFooter}>
      <Avatar name={user.displayName} />
      <div className={styles.userInfo}>
        <p className={styles.userName}>{user.displayName}</p>
        <p className={styles.userEmail}>{user.email}</p>
      </div>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Log out"
        onClick={onLogout}
      >
        <LogOut size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
