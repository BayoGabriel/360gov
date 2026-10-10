import {
  CheckCircle2,
  FileImage,
  FileText,
  Film,
  Paperclip,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { formatFileSize } from '../../../shared/lib/format-file-size';
import type { WorkflowUpload } from '../types/settings.types';
import styles from './settings.module.css';

interface UploadRowProps {
  upload: WorkflowUpload;
  onDelete: () => void;
}

function fileVisual(fileName: string): {
  icon: LucideIcon;
  badgeClass: string;
} {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
    return { icon: FileText, badgeClass: styles.fileDoc };
  }
  if (['mp4', 'mov', 'webm', 'avi'].includes(extension)) {
    return { icon: Film, badgeClass: styles.fileMedia };
  }
  if (['fig', 'sketch', 'png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension)) {
    return { icon: FileImage, badgeClass: styles.fileMedia };
  }
  return { icon: Paperclip, badgeClass: styles.fileOther };
}

export function UploadRow({ upload, onDelete }: UploadRowProps) {
  const { icon: Icon, badgeClass } = fileVisual(upload.fileName);
  const complete = upload.progress >= 100;

  return (
    <div className={styles.uploadItem}>
      <span className={`${styles.fileBadge} ${badgeClass}`} aria-hidden="true">
        <Icon size={18} />
      </span>
      <div className={styles.uploadBody}>
        <p className={styles.uploadName}>{upload.fileName}</p>
        <p className={styles.uploadSize}>{formatFileSize(upload.sizeBytes)}</p>
        <div className={styles.progressRow}>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuenow={upload.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${upload.fileName} upload progress`}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${upload.progress}%` }}
            />
          </div>
          <span className={styles.progressText}>{upload.progress}%</span>
        </div>
      </div>
      {complete ? (
        <CheckCircle2
          size={20}
          className={styles.uploadDone}
          aria-label="Upload complete"
          role="img"
        />
      ) : (
        <button
          type="button"
          className={styles.uploadDelete}
          aria-label={`Remove ${upload.fileName}`}
          onClick={onDelete}
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
