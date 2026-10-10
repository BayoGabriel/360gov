import { SquareCheck } from 'lucide-react';
import { useApproveAllPending } from '../../documents/queries/documents.mutations';
import styles from '../reporting.module.css';

export function ApproveAllButton() {
  const approveAll = useApproveAllPending();
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
