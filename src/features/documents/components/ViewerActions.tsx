import styles from './documents.module.css';

interface ViewerActionsProps {
  busy: boolean;
  onApprove: () => void;
  onRequestRevision: () => void;
  onForward: () => void;
  onArchive: () => void;
}

export function ViewerActions({
  busy,
  onApprove,
  onRequestRevision,
  onForward,
  onArchive,
}: ViewerActionsProps) {
  return (
    <div className={styles.viewerActions}>
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
        onClick={onArchive}
      >
        Archive
      </button>
    </div>
  );
}
