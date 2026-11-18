import type { AppRole } from '../../../shared/auth/roles';
import { DEFAULT_ROLE } from '../../../shared/auth/roles';

/**
 * Development-only user profiles. Sign in with one of these emails (any
 * password) to preview that role's experience:
 *   evc@gov.org          -> Executive Vice Chairman (all departments)
 *   secretariat@gov.org  -> dept secretariat (Corporate Services)
 *   hod@gov.org          -> Head of Department (Corporate Services)
 *   hou@gov.org          -> Head of Unit (Corporate Services > Facility Maintenance)
 *   officer@gov.org      -> Officer (Corporate Services > Facility Maintenance)
 *   proc-hod@gov.org     -> Head of Department (Procurement)
 *   proc-hou@gov.org     -> Head of Unit (Procurement > Planning, Research & Data Mgt.)
 *   proc-officer@gov.org -> Officer (Procurement > Planning, Research & Data Mgt.)
 * Any other email defaults to an officer user. Remove once the backend
 * returns role membership on the user object.
 */
export interface DevProfile {
  role: AppRole;
  displayName: string;
  /** Department the user belongs to, for scoped file access. */
  departmentId?: string;
  /** Sub-unit the user belongs to, for unit-level file access. */
  unitId?: string;
}

const DEV_USERS: Record<string, DevProfile> = {
  'evc@gov.org': {
    role: 'evc',
    displayName: 'Chief Nnamdi Kalu',
  },
  'secretariat@gov.org': {
    role: 'department-secretariat',
    displayName: 'Funke Alabi',
    departmentId: 'corporate-services',
  },
  'hod@gov.org': {
    role: 'department-head',
    displayName: 'Phoenix Baker',
    departmentId: 'corporate-services',
  },
  'hou@gov.org': {
    role: 'unit-head',
    displayName: 'Demi Wilkinson',
    departmentId: 'corporate-services',
    unitId: 'corporate-services-facility-maintenance',
  },
  'officer@gov.org': {
    role: 'officer',
    displayName: 'Olivia Rhye',
    departmentId: 'corporate-services',
    unitId: 'corporate-services-facility-maintenance',
  },
  'proc-hod@gov.org': {
    role: 'department-head',
    displayName: 'Dr. Emeka Obi',
    departmentId: 'procurement',
  },
  'proc-hou@gov.org': {
    role: 'unit-head',
    displayName: 'Ibrahim Sule',
    departmentId: 'procurement',
    unitId: 'procurement-planning-research-data-management',
  },
  'proc-officer@gov.org': {
    role: 'officer',
    displayName: 'Chidi Obi',
    departmentId: 'procurement',
    unitId: 'procurement-planning-research-data-management',
  },
  // Aliases for the pre-rename dev accounts.
  'permsec@gov.org': {
    role: 'evc',
    displayName: 'Chief Nnamdi Kalu',
  },
  'dg@gov.org': {
    role: 'evc',
    displayName: 'Chief Nnamdi Kalu',
  },
  'depthead@gov.org': {
    role: 'department-head',
    displayName: 'Phoenix Baker',
    departmentId: 'corporate-services',
  },
  'staff@gov.org': {
    role: 'officer',
    displayName: 'Olivia Rhye',
    departmentId: 'corporate-services',
    unitId: 'corporate-services-facility-maintenance',
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
