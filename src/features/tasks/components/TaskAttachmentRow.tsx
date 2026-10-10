import { FileText } from 'lucide-react';
import { formatFileSize } from '../../../shared/lib/format-file-size';
import type { TaskAttachment } from '../types/tasks.types';
import styles from './tasks.module.css';

export function TaskAttachmentRow({
  attachment,
}: {
  attachment: TaskAttachment;
}) {
  return (
    <div className={styles.attachment}>
      <span className={styles.pdfBadge} aria-hidden="true">
        <FileText size={18} />
      </span>
      <span className={styles.attachmentBody}>
        <span className={styles.attachmentTitle}>{attachment.title}</span>
        <span className={styles.attachmentMeta}>
          {attachment.fileName} - {formatFileSize(attachment.sizeBytes)}
        </span>
      </span>
    </div>
  );
}
