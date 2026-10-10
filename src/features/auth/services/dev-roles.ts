import type { AppRole } from '../../../shared/auth/roles';
import { DEFAULT_ROLE } from '../../../shared/auth/roles';

/**
 * Development-only user profiles. Sign in with one of these emails (any
 * password) to preview that role's experience:
 *   permsec@gov.org   -> permanent secretary (all departments)
 *   dg@gov.org        -> director general (all departments)
 *   depthead@gov.org  -> department head (Legal Department only)
 *   staff@gov.org     -> staff (Registry > Records unit only)
 * Any other email defaults to a staff user. Remove once the backend
 * returns role membership on the user object.
 */
export interface DevProfile {
  role: AppRole;
  displayName: string;
  /** Department the user belongs to, for scoped file access. */
  departmentId?: string;
  /** Sub-unit the user belongs to, for staff-level file access. */
  unitId?: string;
}

const DEV_USERS: Record<string, DevProfile> = {
  'permsec@gov.org': {
    role: 'permanent-secretary',
    displayName: 'Hon. Adebayo Olawale',
  },
  'dg@gov.org': {
    role: 'director-general',
    displayName: 'Dr. Emeka Obi',
  },
  'depthead@gov.org': {
    role: 'department-head',
    displayName: 'Phoenix Baker',
    departmentId: 'legal',
  },
  'staff@gov.org': {
    role: 'staff',
    displayName: 'Olivia Rhye',
    departmentId: 'registry',
    unitId: 'registry-records',
  },
};

export function devProfileFor(identifier: string): DevProfile {
  return (
    DEV_USERS[identifier.trim().toLowerCase()] ?? {
      role: DEFAULT_ROLE,
      displayName: 'Dev User',
    }
  );
}
