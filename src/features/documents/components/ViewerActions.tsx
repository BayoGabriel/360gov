import type { ReactNode } from 'react';
import styles from './documents.module.css';

interface ViewerActionsProps {
  busy: boolean;
  onApprove: () => void;
  onRequestRevision: () => void;
  onForward: () => void;
  onAssign: () => void;
  onArchive: () => void;
  /** Optional leading affordance rendered before the workflow buttons. */
  leadingAction?: ReactNode;
}

export function ViewerActions({
  busy,
  onApprove,
  onRequestRevision,
  onForward,
  onAssign,
  onArchive,
  leadingAction,
}: ViewerActionsProps) {
  return (
    <div className={styles.viewerActions}>
      {leadingAction}
      <button
        type="button"
        className={styles.outlineButton}
        disabled={busy}
        onClick={onApprove}
      >
        Approve
      </button>
      <button
        type="button"
        className={styles.primaryButton}
        disabled={busy}
        onClick={onRequestRevision}
      >
        Request Revision
      </button>
      <button
        type="button"
        className={styles.outlineButton}
        disabled={busy}
        onClick={onForward}
      >
        Forward to.
      </button>
      <button
        type="button"
        className={styles.outlineButton}
        disabled={busy}
        onClick={onAssign}
      >
        Assign
      </button>
      <button
        type="button"
        className={styles.outlineButton}
        disabled={busy}
        onClick={onArchive}
      >
        Archive
      </button>
    </div>
  );
}
