import { FileText } from 'lucide-react';
import { formatDaysAgo } from '../../../shared/lib/format-date';
import { formatFileSize } from '../../../shared/lib/format-file-size';
import type { FileRecord } from '../types/documents.types';
import styles from './documents.module.css';

export function FileSummaryCard({ document }: { document: FileRecord }) {
  return (
    <div className={styles.fileCard}>
      <span className={styles.pdfBadge} aria-hidden="true">
        <FileText size={20} />
      </span>
      <span className={styles.fileCardBody}>
        <span className={styles.fileCardTitle}>{document.subject}</span>
        <span className={styles.fileCardMeta}>{document.fileName}</span>
        <span className={styles.fileCardMeta}>
          by {document.initiatedBy.name}, {formatDaysAgo(document.uploadedAt)} -{' '}
          {formatFileSize(document.fileSizeBytes)}
        </span>
      </span>
    </div>
  );
}
