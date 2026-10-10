import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import type { DocumentFilters } from '../hooks/useDocumentsPage';
import type {
  DocumentFilterOptions,
  FileStatus,
} from '../types/documents.types';
import styles from './documents.module.css';

interface FilterDialogProps {
  open: boolean;
  options?: DocumentFilterOptions;
  current: DocumentFilters;
  onApply: (filters: DocumentFilters) => void;
  onClose: () => void;
}

const STATUS_OPTIONS: Array<{ value: FileStatus; label: string }> = [
  { value: 'processing', label: 'Processing' },
  { value: 'success', label: 'Success' },
  { value: 'declined', label: 'Declined' },
];

function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.selectWrap}>
        <select
          className={styles.select}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className={styles.selectIcon} aria-hidden="true" />
      </span>
    </label>
  );
}

export function FilterDialog({
  open,
  options,
  current,
  onApply,
  onClose,
}: FilterDialogProps) {
  const [draft, setDraft] = useState<DocumentFilters>(current);

  const toOptions = (values?: string[]) =>
    (values ?? []).map((v) => ({ value: v, label: v }));

  return (
    <Modal open={open} onClose={onClose} title="Filter">
      <div className={styles.dialogBody}>
        <SelectField
          label="Status"
          value={draft.status ?? ''}
          placeholder="Select Status"
          options={STATUS_OPTIONS}
          onChange={(status) =>
            setDraft({ ...draft, status: (status || undefined) as FileStatus | undefined })
          }
        />
        <SelectField
          label="Department"
          value={draft.department ?? ''}
          placeholder="Select Department"
          options={toOptions(options?.departments)}
          onChange={(department) =>
            setDraft({ ...draft, department: department || undefined })
          }
        />
        <SelectField
          label="Type of Document"
          value={draft.documentType ?? ''}
          placeholder="Select Document Type"
          options={toOptions(options?.documentTypes)}
          onChange={(documentType) =>
            setDraft({ ...draft, documentType: documentType || undefined })
          }
        />
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => onApply(draft)}
          >
            Apply Filter
          </button>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={() => setDraft({})}
          >
            Reset Filter
          </button>
        </div>
      </div>
    </Modal>
  );
}
