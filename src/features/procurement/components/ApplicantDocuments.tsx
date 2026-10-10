import { FileText } from 'lucide-react';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import { formatFileSize } from '../../../shared/lib/format-file-size';
import type { Bid } from '../types/procurement.types';
import styles from './procurement.module.css';

export function ApplicantDocuments({ bid }: { bid: Bid }) {
  if (bid.documents.length === 0) {
    return <p className={styles.status}>No documents were submitted.</p>;
  }
  return (
    <ul className={`${styles.docList} ${styles.docListPadded}`}>
      {bid.documents.map((doc) => (
        <li key={doc.id} className={styles.docRow}>
          <span className={styles.docIcon} aria-hidden="true">
            <FileText size={18} />
          </span>
          <span className={styles.docMeta}>
            <span className={styles.docTitle}>{doc.name}</span>
            <span className={styles.docSub}>
              {formatFileSize(doc.fileSizeBytes)} · Uploaded{' '}
              {formatListTimestamp(doc.uploadedAt)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
