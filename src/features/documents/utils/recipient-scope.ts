import type { AppRole } from '../../../shared/auth/roles';
import { DEFAULT_ROLE } from '../../../shared/auth/roles';
import type { CapabilityUser } from '../../../shared/auth/permissions';

/**
 * Who a file may be sent to next, by purpose and the sender's role. The
 * chain is strict: officers return to their Head of Unit, unit heads to
 * their Head of Department, heads of department submit to the EVC and
 * dispatch to peer departments via the secretariat — and the EVC routes
 * onward to departments. Nobody targets themselves or their own role.
 */
export type RecipientPurpose = 'forward' | 'assign' | 'revision';

/** Directory entries the routing rules evaluate against. */
export interface DirectoryParty {
  role: AppRole;
  departmentId?: string;
  unitId?: string;
}

function isSameDepartment(
  user: CapabilityUser,
  candidate: DirectoryParty,
): boolean {
  return (
    Boolean(user.departmentId) &&
    candidate.departmentId === user.departmentId
  );
}

function isOtherDepartment(
  user: CapabilityUser,
  candidate: DirectoryParty,
): boolean {
  return (
    Boolean(user.departmentId) &&
    Boolean(candidate.departmentId) &&
    candidate.departmentId !== user.departmentId
  );
}

function isSameUnit(
  user: CapabilityUser,
  candidate: DirectoryParty,
): boolean {
  return Boolean(user.unitId) && candidate.unitId === user.unitId;
}

function canForward(
  role: AppRole,
  user: CapabilityUser,
  candidate: DirectoryParty,
): boolean {
  switch (role) {
    case 'officer':
      // Officers hand the reviewed file back to their Head of Unit.
      return candidate.role === 'unit-head' && isSameUnit(user, candidate);
    case 'unit-head':
      // Unit heads return the memo to their Head of Department.
      return (
        candidate.role === 'department-head' &&
        isSameDepartment(user, candidate)
      );
    case 'department-secretariat':
      // The secretariat logs incoming mail to its Head of Department, and
      // dispatches approved files to peer departments' secretariats (e.g.
      // Finance for payment, Procurement for awards).
      return (
        (candidate.role === 'department-head' &&
          isSameDepartment(user, candidate)) ||
        (candidate.role === 'department-secretariat' &&
          isOtherDepartment(user, candidate))
      );
    case 'department-head':
      // The Head of Department submits to the EVC, sends approved files
      // to peer department heads, or routes payment paperwork through the
      // department secretariat.
      return (
        candidate.role === 'evc' ||
        (candidate.role === 'department-head' &&
          isOtherDepartment(user, candidate)) ||
        (candidate.role === 'department-secretariat' &&
          isSameDepartment(user, candidate))
      );
    case 'evc':
      // The EVC routes approved files onward to departments — never to
      // the EVC's own office.
      return (
        candidate.role === 'department-head' ||
        candidate.role === 'department-secretariat'
      );
  }
}

function canAssign(
  role: AppRole,
  user: CapabilityUser,
  candidate: DirectoryParty,
): boolean {
  switch (role) {
    case 'department-head':
      return candidate.role === 'unit-head' && isSameDepartment(user, candidate);
    case 'unit-head':
      return candidate.role === 'officer' && isSameUnit(user, candidate);
    default:
      return false;
  }
}

function canRevise(
  role: AppRole,
  user: CapabilityUser,
  candidate: DirectoryParty,
): boolean {
  switch (role) {
    case 'evc':
      return candidate.role === 'department-head';
    case 'department-head':
      return candidate.role === 'unit-head' && isSameDepartment(user, candidate);
    case 'unit-head':
      return candidate.role === 'officer' && isSameUnit(user, candidate);
    default:
      return false;
  }
}

/** True when `candidate` is a valid next holder for the given purpose. */
export function canTarget(
  purpose: RecipientPurpose,
  user: CapabilityUser,
  candidate: DirectoryParty,
): boolean {
  const role = user.role ?? DEFAULT_ROLE;
  switch (purpose) {
    case 'forward':
      return canForward(role, user, candidate);
    case 'assign':
      return canAssign(role, user, candidate);
    case 'revision':
      return canRevise(role, user, candidate);
  }
}

/** Filter a directory down to the valid recipients for the sender. */
export function recipientsFor<T extends DirectoryParty>(
  purpose: RecipientPurpose,
  user: CapabilityUser,
  candidates: T[],
): T[] {
  return candidates.filter((candidate) =>
    canTarget(purpose, user, candidate),
  );
}
