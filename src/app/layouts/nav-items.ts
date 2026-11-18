import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Flag,
  Folder,
  HardDrive,
  LayoutGrid,
  Layers,
  MessagesSquare,
  Settings,
  Sparkles,
  SquareCheck,
  Users,
} from 'lucide-react';
import {
  can,
  type Capability,
  type CapabilityUser,
} from '../../shared/auth/permissions';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  /** When set, only users with the capability see this entry. */
  capability?: Capability;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/ai', label: 'AI Assistant', icon: Sparkles },
  { to: '/workspace', label: 'Workspace', icon: HardDrive },
  { to: '/documents', label: 'Documents', icon: Layers },
  {
    to: '/procurement',
    label: 'Procurement',
    icon: Briefcase,
    capability: 'screen.procurement',
  },
  { to: '/tasks', label: 'Tasks', icon: SquareCheck },
  { to: '/memos', label: 'Conversations', icon: MessagesSquare },
  { to: '/department-files', label: 'Department Files', icon: Folder },
  {
    to: '/reports',
    label: 'Reporting/Analytics',
    icon: Flag,
    capability: 'screen.reports',
  },
  {
    to: '/users',
    label: 'User Management',
    icon: Users,
    capability: 'screen.users',
  },
  { to: '/settings', label: 'Settings', icon: Settings },
];

/** Navigation entries the signed-in user is allowed to reach. */
export function navItemsFor(user: CapabilityUser | undefined): NavItem[] {
  return NAV_ITEMS.filter(
    (item) => !item.capability || can(user, item.capability),
  );
}
