import { useRef } from 'react';
import { FileText, Forward, Tag, Upload } from 'lucide-react';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import type {
  OutgoingFileAction,
  OutgoingFileItem,
} from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { CollaboratorStack } from './CollaboratorStack';

interface OutgoingFileRowProps {
  file: OutgoingFileItem;
  disabled: boolean;
  onAction: (action: OutgoingFileAction, fileName?: string) => void;
}

export function OutgoingFileRow({
  file,
  disabled,
  onAction,
}: OutgoingFileRowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <tr>
      <td>
        <span className={styles.fileCell}>
          <span className={styles.docIcon}>
            <FileText size={16} aria-hidden="true" />
          </span>
          <span className={styles.docBody}>
            <span className={styles.docTitle}>{file.title}</span>
            <span className={styles.docMeta}>{file.reference}</span>
            <span className={styles.docMeta}>
              {formatListTimestamp(file.date)}
            </span>
          </span>
        </span>
      </td>
      <td className={styles.destCell}>{file.destination}</td>
      <td>
        <input
          ref={fileInputRef}
          type="file"
          className={styles.visuallyHidden}
          aria-label={`Choose file to upload for ${file.reference}`}
          onChange={(event) => {
            const chosen = event.target.files?.[0];
            if (chosen) onAction('upload', chosen.name);
            event.target.value = '';
          }}
        />
        <button
          type="button"
          className={styles.actionButton}
          disabled={disabled || file.uploaded}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={14} aria-hidden="true" />
          {file.uploaded ? 'Uploaded' : 'Upload'}
        </button>
      </td>
      <td>
        <button
          type="button"
          className={styles.actionButton}
          disabled={disabled || file.forwarded}
          onClick={() => onAction('forward')}
        >
          <Forward size={14} aria-hidden="true" />
          {file.forwarded ? 'Forwarded' : 'Forward File'}
        </button>
      </td>
      <td>
        {file.collaborators.length > 0 ? (
          <CollaboratorStack collaborators={file.collaborators} />
        ) : (
          <button
            type="button"
            className={styles.actionButton}
            disabled={disabled || file.tagged}
            onClick={() => onAction('tag')}
          >
            <Tag size={14} aria-hidden="true" />
            {file.tagged ? 'Tagged' : 'Tag'}
          </button>
        )}
      </td>
    </tr>
  );
}
