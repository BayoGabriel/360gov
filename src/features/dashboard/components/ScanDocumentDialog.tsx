import { useRef, useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { useScanDocument } from '../queries/dashboard.mutations';
import styles from '../dashboard.module.css';

export function ScanDocumentDialog({ onClose }: { onClose: () => void }) {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scan = useScanDocument();

  return (
    <Modal open onClose={onClose} title="Scan Document">
      <div className={styles.dialogBody}>
        <input
          ref={fileInputRef}
          type="file"
          className={styles.visuallyHidden}
          aria-label="Choose document to scan"
          onChange={(event) =>
            setFileName(event.target.files?.[0]?.name ?? '')
          }
        />
        <button
          type="button"
          className={styles.outlineButton}
          onClick={() => fileInputRef.current?.click()}
        >
          {fileName || 'Choose file from scanner or disk…'}
        </button>
        {scan.isError ? (
          <p className={styles.errorText} role="alert">
            The document could not be scanned. Please try again.
          </p>
        ) : null}
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={!fileName || scan.isPending}
            onClick={() => scan.mutate(fileName, { onSuccess: onClose })}
          >
            Scan
          </button>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
