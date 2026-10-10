import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Paperclip } from 'lucide-react';
import { InputField, SelectField } from '../../../shared/components/FormField';
import { Modal } from '../../../shared/components/Modal';
import { useToast } from '../../../shared/components/Toast';
import { useUploadContractDocument } from '../queries/procurement.mutations';
import {
  uploadDocumentSchema,
  type UploadDocumentFormValues,
} from '../schemas/procurement.schemas';
import type { ContractDocumentKind } from '../types/procurement.types';
import { documentKindLabel } from '../utils/procurement-formatters';
import fieldStyles from '../../../shared/components/FormField/fields.module.css';
import styles from './procurement.module.css';

const KIND_OPTIONS: ContractDocumentKind[] = [
  'tender-notice',
  'bill-of-quantities',
  'agreement',
  'addendum',
  'other',
];

interface UploadDocumentDialogProps {
  contractId: string;
  onClose: () => void;
}

export function UploadDocumentDialog({
  contractId,
  onClose,
}: UploadDocumentDialogProps) {
  const toast = useToast();
  const upload = useUploadContractDocument(contractId);
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileSize, setFileSize] = useState(0);
  const { register, control, handleSubmit, setValue, formState } =
    useForm<UploadDocumentFormValues>({
      resolver: zodResolver(uploadDocumentSchema),
      defaultValues: { title: '', fileName: '', kind: 'other' },
    });

  const submit = handleSubmit((values) => {
    upload.mutate(
      {
        title: values.title,
        fileName: values.fileName,
        fileSizeBytes: fileSize || 120_000,
        kind: values.kind,
      },
      {
        onSuccess: () => {
          toast.success(`${values.title} attached to the contract.`);
          onClose();
        },
        onError: () => toast.error('The document could not be uploaded.'),
      },
    );
  });

  return (
    <Modal open onClose={onClose} title="Upload Contract Document">
      <form className={styles.dialogBody} onSubmit={submit} noValidate>
        <InputField
          label="Document Title"
          placeholder="e.g. Signed Contract Agreement"
          registration={register('title')}
          error={formState.errors.title?.message}
        />
        <Controller
          name="kind"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Document Type"
              placeholder="Select type"
              value={field.value}
              onChange={field.onChange}
              options={KIND_OPTIONS.map((value) => ({
                value,
                label: documentKindLabel(value),
              }))}
              error={formState.errors.kind?.message}
            />
          )}
        />
        <div className={fieldStyles.field}>
          <span className={fieldStyles.label}>File</span>
          <input
            ref={fileInput}
            type="file"
            className={styles.visuallyHidden}
            aria-label="Choose file"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setValue('fileName', file?.name ?? '', {
                shouldValidate: true,
              });
              setFileSize(file?.size ?? 0);
            }}
          />
          <button
            type="button"
            className={styles.outlineButton}
            onClick={() => fileInput.current?.click()}
          >
            <Paperclip size={14} aria-hidden="true" />
            Attach File
          </button>
          {formState.errors.fileName ? (
            <p className={fieldStyles.error} role="alert">
              {formState.errors.fileName.message}
            </p>
          ) : null}
        </div>
        {upload.isError ? (
          <p className={styles.errorText} role="alert">
            The document could not be uploaded. Please try again.
          </p>
        ) : null}
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={upload.isPending}
          >
            {upload.isPending ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
