import { SquareCheck } from 'lucide-react';
import { useAuth } from '../../../app/providers/auth-context';
import { can } from '../../../shared/auth/permissions';
import { useApproveAllPending } from '../../documents/queries/documents.mutations';
import styles from '../reporting.module.css';

/** Mass approval is the EVC's prerogative; other roles never see it. */
export function ApproveAllButton() {
  const { session } = useAuth();
  const approveAll = useApproveAllPending();
  const user =
    session.status === 'authenticated' ? session.user : undefined;
  if (!can(user, 'document.final-approve')) return null;
  return (
    <button
      type="button"
      className={styles.primaryButton}
      disabled={approveAll.isPending}
      onClick={() => approveAll.mutate()}
    >
      <SquareCheck size={16} aria-hidden="true" />
      {approveAll.isPending ? 'Approving…' : 'Approve all Pending Files'}
    </button>
  );
}
