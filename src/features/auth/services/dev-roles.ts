import type { AppRole } from '../../../shared/auth/roles';
import { DEFAULT_ROLE } from '../../../shared/auth/roles';

/**
 * Dev-only role assignment. Sign in with one of these emails (any
 * password) to preview that role's dashboard:
 *   permsec@gov.org   -> permanent secretary / director general view
 *   depthead@gov.org  -> department head view
 *   staff@gov.org     -> staff view
 * Any other email defaults to 'staff'. Remove once the backend
 * returns role membership on the user object.
 */
const DEV_EMAIL_ROLES: Record<string, AppRole> = {
  'permsec@gov.org': 'permanent-secretary',
  'depthead@gov.org': 'department-head',
  'staff@gov.org': 'staff',
};

export function roleForDevEmail(identifier: string): AppRole {
  return DEV_EMAIL_ROLES[identifier.trim().toLowerCase()] ?? DEFAULT_ROLE;
}
