import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Flag,
  Folder,
  LayoutGrid,
  Layers,
  MessagesSquare,
  Settings,
  Sparkles,
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
  { to: '/ai', label: 'AI Assistant', icon: Sparkles },
  { to: '/documents', label: 'Documents', icon: Layers },
  { to: '/procurement', label: 'Procurement', icon: Briefcase },
  { to: '/tasks', label: 'Tasks', icon: SquareCheck },
  { to: '/memos', label: 'Conversations', icon: MessagesSquare },
  { to: '/department-files', label: 'Department Files', icon: Folder },
  { to: '/reports', label: 'Reporting/Analytics', icon: Flag },
  { to: '/users', label: 'User Management', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];
