import type { AppRole } from './roles';
import { DEFAULT_ROLE, isTopLevelRole } from './roles';

/**
 * Centralized capability checks for the document workflow:
 *
 *   EVC Registry -> Department Secretariat -> Head of Department ->
 *   Head of Unit -> Assigned Officer -> back up -> EVC -> onward dept.
 *
 * Screens and actions are gated through `can(user, capability)` instead of
 * scattering role comparisons through the UI. UI checks are a usability
 * aid only; the backend remains the security boundary.
 */

/** Minimal session shape needed for capability checks. */
export interface CapabilityUser {
  role?: AppRole;
  departmentId?: string;
  unitId?: string;
}

export type Capability =
  // Screens beyond the common set every signed-in user gets.
  | 'screen.procurement'
  | 'screen.reports'
  | 'screen.users'
  // Document workflow actions. Viewing, trails and notes are universal
  // and therefore not gated.
  | 'document.assign'
  | 'document.forward'
  | 'document.revision'
  /** Submitting a file upward for approval (Head of Department -> EVC). */
  | 'document.approve'
  /** The EVC's own approval, including approve-all. */
  | 'document.final-approve'
  | 'document.archive';

const ROLE_CAPABILITIES: Record<AppRole, ReadonlySet<Capability>> = {
  // The EVC is the final approver and sees every department; they never
  // "submit to the EVC" or assign into units.
  evc: new Set<Capability>([
    'screen.procurement',
    'screen.reports',
    'screen.users',
    'document.forward',
    'document.revision',
    'document.final-approve',
    'document.archive',
  ]),
  // The secretariat registers incoming mail, routes it to the Head of
  // Department, dispatches approved files to other departments, and keeps
  // the department's records (archive).
  'department-secretariat': new Set<Capability>([
    'screen.reports',
    'document.forward',
    'document.archive',
  ]),
  // The Head of Department reviews content, assigns to unit heads, returns
  // files for revision, submits to the EVC, and forwards approved files
  // onward to other departments.
  'department-head': new Set<Capability>([
    'screen.reports',
    'document.assign',
    'document.forward',
    'document.revision',
    'document.approve',
  ]),
  // The Head of Unit assigns to officers, returns their memos upward, and
  // sends work back to an officer for revision.
  'unit-head': new Set<Capability>([
    'document.assign',
    'document.forward',
    'document.revision',
  ]),
  // The assigned officer reviews the file, raises a memo, and returns it
  // to their Head of Unit.
  officer: new Set<Capability>(['document.forward']),
};

const PROCUREMENT_DEPARTMENT_ID = 'procurement';

export function can(
  user: CapabilityUser | undefined,
  capability: Capability,
): boolean {
  const role = user?.role ?? DEFAULT_ROLE;
  if (capability === 'screen.procurement') {
    return (
      isTopLevelRole(role) ||
      user?.departmentId === PROCUREMENT_DEPARTMENT_ID
    );
  }
  return ROLE_CAPABILITIES[role].has(capability);
}
