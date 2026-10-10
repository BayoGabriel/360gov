import { useId } from 'react';
import { Upload } from 'lucide-react';
import { useWorkflowUploadsSection } from '../hooks/useWorkflowUploadsSection';
import { FormRow } from './FormRow';
import { UploadRow } from './UploadRow';
import styles from './settings.module.css';

export function WorkflowUploadsSection() {
  const { uploads, isPending, isError, addFile, removeFile } =
    useWorkflowUploadsSection();
  const inputId = useId();

  return (
    <FormRow
      label="Workflow Automation"
      hint="Share a few snippets of your work."
    >
      <div className={styles.uploadList}>
        {isPending ? (
          <p className={styles.rowHint} role="status">
            Loading uploads…
          </p>
        ) : null}
        {isError ? (
          <p className={styles.errorText} role="alert">
            Uploads could not be loaded.
          </p>
        ) : null}
        {uploads.map((upload) => (
          <UploadRow
            key={upload.id}
            upload={upload}
            onDelete={() => removeFile(upload.id)}
          />
        ))}
        <label className={styles.uploadAdd} htmlFor={inputId}>
          <Upload size={16} aria-hidden="true" />
          Upload file
        </label>
        <input
          id={inputId}
          type="file"
          className={styles.hiddenInput}
          aria-label="Upload workflow file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) addFile(file);
            event.target.value = '';
          }}
        />
      </div>
    </FormRow>
  );
}
