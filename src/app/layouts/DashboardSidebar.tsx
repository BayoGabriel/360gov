import { Search } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import type { AuthUser } from '../../features/auth';
import { branding } from '../../shared/config/branding';
import { NAV_ITEMS } from './nav-items';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarUserFooter } from './SidebarUserFooter';
import { StorageCard } from './StorageCard';
import styles from './DashboardSidebar.module.css';

interface DashboardSidebarProps {
  user: AuthUser;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function DashboardSidebar({
  user,
  open,
  onClose,
  onLogout,
}: DashboardSidebarProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <button
          className={styles.backdrop}
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        id="app-sidebar"
        className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}
      >
        <Link to="/dashboard" className={styles.brand} onClick={onClose}>
          <span className={styles.logoMark} aria-hidden="true" />
          <span>{branding.appName}</span>
        </Link>
        <form
          role="search"
          className={styles.search}
          onSubmit={(event) => event.preventDefault()}
        >
          <Search size={20} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search"
            aria-label="Search"
          />
        </form>
        <nav aria-label="Primary">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <SidebarNavItem item={item} onNavigate={onClose} />
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.footer}>
          <StorageCard
            usedPercent={80}
            onUpgrade={() => navigate('/settings')}
          />
          <SidebarUserFooter user={user} onLogout={onLogout} />
        </div>
      </aside>
    </>
  );
}
