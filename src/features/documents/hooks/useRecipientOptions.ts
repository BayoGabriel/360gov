import { useAuth } from '../../../app/providers/auth-context';
import { DEFAULT_ROLE } from '../../../shared/auth/roles';
import type { CapabilityUser } from '../../../shared/auth/permissions';
import { useForwardRecipients } from '../queries/documents.queries';
import {
  recipientsFor,
  type RecipientPurpose,
} from '../utils/recipient-scope';

/**
 * Directory entries filtered to the holders the signed-in user's role may
 * actually send to for the given purpose — e.g. an officer only sees their
 * Head of Unit when forwarding, and the EVC never sees the EVC's office.
 */
export function useRecipientOptions(
  purpose: RecipientPurpose,
  enabled: boolean,
) {
  const { session } = useAuth();
  const user: CapabilityUser | undefined =
    session.status === 'authenticated'
      ? {
          role: session.user.role ?? DEFAULT_ROLE,
          departmentId: session.user.departmentId,
          unitId: session.user.unitId,
        }
      : undefined;
  const query = useForwardRecipients(enabled);
  const data = query.data
    ? recipientsFor(purpose, user ?? {}, query.data)
    : query.data;
  return { ...query, data };
}
