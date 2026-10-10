import { useId } from 'react';
import { CloudUpload } from 'lucide-react';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import styles from './settings.module.css';

interface PhotoUploadFieldProps {
  photoUrl?: string;
  /** Display name used for the avatar initials fallback. */
  name: string;
  onSelect: (file: File) => void;
}

const ACCEPTED_TYPES = 'image/png,image/jpeg,image/gif,image/svg+xml';

export function PhotoUploadField({
  photoUrl,
  name,
  onSelect,
}: PhotoUploadFieldProps) {
  const inputId = useId();
  const pick = (file: File | undefined) => {
    if (file) onSelect(file);
  };

  return (
    <div className={styles.photoRow}>
      <Avatar name={name} src={photoUrl} size={56} />
      <label
        className={styles.dropZone}
        htmlFor={inputId}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          pick(event.dataTransfer.files?.[0]);
        }}
      >
        <span className={styles.dropIcon} aria-hidden="true">
          <CloudUpload size={20} />
        </span>
        <span className={styles.dropText}>
          <strong>Click to upload</strong> or drag and drop
        </span>
        <span className={styles.dropHint}>
          SVG, PNG, JPG or GIF (max. 800×400px)
        </span>
      </label>
      <input
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPES}
        className={styles.hiddenInput}
        aria-label="Upload profile photo"
        onChange={(event) => {
          pick(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
    </div>
  );
}
