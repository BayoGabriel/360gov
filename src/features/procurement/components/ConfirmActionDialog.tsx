import { Modal } from '../../../shared/components/Modal';
import type { ContractAction } from '../types/procurement.types';
import styles from './procurement.module.css';

const CONFIRM_COPY: Record<
  ContractAction,
  { title: string; body: string; confirm: string; danger?: boolean }
> = {
  publish: {
    title: 'Publish Tender',
    body: 'This tender will become visible to the public and vendors will be able to submit bids until the deadline.',
    confirm: 'Publish Tender',
  },
  'close-submissions': {
    title: 'Close Submissions',
    body: 'Vendors will no longer be able to submit bids. The bids received will move into evaluation.',
    confirm: 'Close Submissions',
  },
  complete: {
    title: 'Mark Contract Completed',
    body: 'The contract will be closed out and marked as fully executed. This action is recorded in the activity trail.',
    confirm: 'Mark Completed',
  },
  cancel: {
    title: 'Cancel Tender',
    body: 'The tender will be cancelled and vendors will be notified. This action cannot be undone.',
    confirm: 'Cancel Tender',
    danger: true,
  },
};

interface ConfirmActionDialogProps {
  action: ContractAction;
  pending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmActionDialog({
  action,
  pending,
  onConfirm,
  onClose,
}: ConfirmActionDialogProps) {
  const copy = CONFIRM_COPY[action];
  return (
    <Modal open onClose={onClose} title={copy.title}>
      <div className={styles.dialogBody}>
        <p className={styles.dialogNote}>{copy.body}</p>
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={onClose}
          >
            Go Back
          </button>
          <button
            type="button"
            className={copy.danger ? styles.dangerButton : styles.primaryButton}
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? 'Working…' : copy.confirm}
          </button>
        </div>
      </div>
    </Modal>
  );
}
