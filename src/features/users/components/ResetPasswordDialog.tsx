import { Modal } from '../../../shared/components/Modal';
import { useResetPassword } from '../queries/users.mutations';
import type { UserRecord } from '../types/users.types';
import styles from './users.module.css';

interface ResetPasswordDialogProps {
  user: UserRecord;
  onClose: () => void;
}

export function ResetPasswordDialog({
  user,
  onClose,
}: ResetPasswordDialogProps) {
  const resetPassword = useResetPassword();

  return (
    <Modal open onClose={onClose} title="Reset Password">
      <div className={styles.dialogBody}>
        <p className={styles.formSubtitle}>
          Send a password reset link to {user.email}?
        </p>
        {resetPassword.isError ? (
          <p className={styles.errorText} role="alert">
            The reset link could not be sent. Please try again.
          </p>
        ) : null}
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={resetPassword.isPending}
            onClick={() =>
              resetPassword.mutate(user.id, { onSuccess: onClose })
            }
          >
            Send
          </button>
        </div>
      </div>
    </Modal>
  );
}
