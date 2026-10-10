import { useId } from 'react';
import { Upload } from 'lucide-react';
import styles from './tasks.module.css';

interface TaskAttachmentFieldProps {
  fileName: string;
  onChange: (fileName: string) => void;
}

export function TaskAttachmentField({
  fileName,
  onChange,
}: TaskAttachmentFieldProps) {
  const inputId = useId();

  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel} id={`${inputId}-label`}>
        Attachment
      </span>
      <label className={styles.attachBox} htmlFor={inputId}>
        <span className={styles.attachName}>{fileName || 'Attach File'}</span>
        <Upload size={16} aria-hidden="true" />
      </label>
      <input
        id={inputId}
        type="file"
        className={styles.attachInput}
        aria-labelledby={`${inputId}-label`}
        onChange={(event) =>
          onChange(event.target.files?.[0]?.name ?? '')
        }
      />
    </div>
  );
}
