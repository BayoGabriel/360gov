/**
 * Application roles, matching the ministry's document workflow:
 *   EVC Registry -> Department Secretariat -> Head of Department ->
 *   Head of Unit -> Assigned Officer -> back up -> EVC -> onward dept.
 * The backend is the authority on role membership; until it sends roles,
 * the dev auth stub assigns one from a fixed email map
 * (see features/auth/services/dev-roles.ts).
 */
export const APP_ROLES = [
  'evc',
  'department-secretariat',
  'department-head',
  'unit-head',
  'officer',
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const DEFAULT_ROLE: AppRole = 'officer';

export const ROLE_LABELS: Record<AppRole, string> = {
  evc: 'Executive Vice Chairman',
  'department-secretariat': 'Department Secretariat',
  'department-head': 'Head of Department',
  'unit-head': 'Head of Unit',
  officer: 'Officer',
};

/** Roles that can see every department's files and dashboards. */
export function isTopLevelRole(role: AppRole): boolean {
  return role === 'evc';
}

/** Roles whose scope is a whole department rather than a single unit. */
export function isDepartmentScopedRole(role: AppRole): boolean {
  return role === 'department-secretariat' || role === 'department-head';
}
