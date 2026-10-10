import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import type { MemoFilters } from '../hooks/useMemosPage';
import type { MemoStatus } from '../types/memos.types';
import styles from './memos.module.css';

interface MemoFilterDialogProps {
  current: MemoFilters;
  onApply: (filters: MemoFilters) => void;
  onClose: () => void;
}

const STATUS_OPTIONS: Array<{ value: MemoStatus; label: string }> = [
  { value: 'processing', label: 'Processing' },
  { value: 'success', label: 'Success' },
  { value: 'declined', label: 'Declined' },
];

export function MemoFilterDialog({
  current,
  onApply,
  onClose,
}: MemoFilterDialogProps) {
  const [status, setStatus] = useState(current.status ?? '');

  return (
    <Modal open onClose={onClose} title="Filter">
      <div className={styles.dialogBody}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Status</span>
          <span className={styles.selectWrap}>
            <select
              className={styles.select}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Select Status</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className={styles.selectIcon}
              aria-hidden="true"
            />
          </span>
        </label>
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() =>
              onApply({
                status: (status || undefined) as MemoStatus | undefined,
              })
            }
          >
            Apply Filter
          </button>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={() => setStatus('')}
          >
            Reset Filter
          </button>
        </div>
      </div>
    </Modal>
  );
}
