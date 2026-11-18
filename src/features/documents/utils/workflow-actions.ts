import type { AppRole } from '../../../shared/auth/roles';
import { DEFAULT_ROLE } from '../../../shared/auth/roles';
import { can, type CapabilityUser } from '../../../shared/auth/permissions';
import type { DocumentAction } from '../types/documents.types';

/**
 * Role-aware labels and ordering for the document workflow menu. The
 * action ids stay stable; only their labels and availability change with
 * the signed-in role, per the ministry routing chain:
 *
 *   Secretariat -> Head of Department -> Head of Unit -> Officer
 *   -> back up -> Head of Department -> EVC -> onward department.
 */
export interface DocumentActionSpec {
  id: DocumentAction;
  label: string;
}

const VIEW_SPEC: DocumentActionSpec = { id: 'view', label: 'View File' };
const TRAIL_SPEC: DocumentActionSpec = {
  id: 'trail',
  label: 'Approval Trail',
};
const NOTE_SPEC: DocumentActionSpec = { id: 'note', label: 'Add Note' };

function assignLabel(role: AppRole): string {
  return role === 'unit-head' ? 'Assign to Officer' : 'Assign to Unit';
}

function forwardLabel(role: AppRole): string {
  switch (role) {
    case 'officer':
      return 'Return to Unit Head';
    case 'unit-head':
      return 'Return to Dept. Head';
    case 'department-secretariat':
      return 'Forward';
    default:
      return 'Forward to Dept.';
  }
}

function revisionLabel(role: AppRole): string {
  if (role === 'unit-head') return 'Return to Officer';
  if (role === 'evc') return 'Return for Revision';
  return 'Request Revision';
}

function approveLabel(role: AppRole, signatureRequired: boolean): string {
  // The EVC approves directly; only the Head of Department submits upward.
  const sign = signatureRequired ? 'Sign & ' : '';
  return role === 'evc'
    ? `${sign}Approve`
    : `${sign}Submit to EVC`;
}

/** All menu/viewer actions the role may perform, in display order. */
export function documentActionsFor(
  user: CapabilityUser | undefined,
  options?: { signatureRequired?: boolean },
): DocumentActionSpec[] {
  const role = user?.role ?? DEFAULT_ROLE;
  const specs: DocumentActionSpec[] = [VIEW_SPEC, TRAIL_SPEC, NOTE_SPEC];
  if (can(user, 'document.assign')) {
    specs.push({ id: 'assign', label: assignLabel(role) });
  }
  if (can(user, 'document.forward')) {
    specs.push({ id: 'forward', label: forwardLabel(role) });
  }
  if (can(user, 'document.revision')) {
    specs.push({ id: 'revision', label: revisionLabel(role) });
  }
  if (
    can(user, 'document.approve') ||
    can(user, 'document.final-approve')
  ) {
    specs.push({
      id: 'approve',
      label: approveLabel(role, options?.signatureRequired ?? false),
    });
  }
  if (can(user, 'document.archive')) {
    specs.push({ id: 'archive', label: 'Archive' });
  }
  return specs;
}

/** Title for the assign dialog, matching the role's actual target. */
export function assignDialogTitle(
  user: CapabilityUser | undefined,
): string {
  return (user?.role ?? DEFAULT_ROLE) === 'unit-head'
    ? 'Assign to Officer'
    : 'Assign to Unit';
}

/** Toast after the approve action, reflecting what it did for the role. */
export function approveSuccessMessage(
  user: CapabilityUser | undefined,
  fileNo: string,
): string {
  return (user?.role ?? DEFAULT_ROLE) === 'evc'
    ? `${fileNo} approved.`
    : `${fileNo} submitted to the EVC for approval.`;
}
