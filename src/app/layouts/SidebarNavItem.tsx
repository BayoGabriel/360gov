import { NavLink } from 'react-router';
import type { NavItem } from './nav-items';
import styles from './DashboardSidebar.module.css';

interface SidebarNavItemProps {
  item: NavItem;
  onNavigate?: () => void;
}

export function SidebarNavItem({ item, onNavigate }: SidebarNavItemProps) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
      }
    >
      <Icon size={20} className={styles.navIcon} aria-hidden="true" />
      {item.label}
    </NavLink>
  );
}
