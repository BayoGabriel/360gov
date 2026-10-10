import type { LucideIcon } from 'lucide-react';
import {
  Flag,
  Folder,
  LayoutGrid,
  Layers,
  Notebook,
  Settings,
  SquareCheck,
  Users,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/documents', label: 'Documents', icon: Layers },
  { to: '/tasks', label: 'Tasks', icon: SquareCheck },
  { to: '/memos', label: 'Memos/Notes', icon: Notebook },
  { to: '/department-files', label: 'Department Files', icon: Folder },
  { to: '/reports', label: 'Reporting/Analytics', icon: Flag },
  { to: '/users', label: 'User Management', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];
