import { ChevronDown } from 'lucide-react';
import type { DocStatus } from '../types/dashboard.types';
import styles from '../dashboard.module.css';

const STATUS_OPTIONS: { value: DocStatus; label: string }[] = [
  { value: 'processing', label: 'Processing' },
  { value: 'success', label: 'Success' },
  { value: 'declined', label: 'Declined' },
];

interface StatusFilterProps {
  value: DocStatus | undefined;
  onChange: (status: DocStatus | undefined) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <span className={styles.selectPill}>
      <select
        className={styles.selectPillSelect}
        aria-label="Filter by status"
        value={value ?? ''}
        onChange={(event) =>
          onChange((event.target.value || undefined) as DocStatus | undefined)
        }
      >
        <option value="">Status</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} aria-hidden="true" />
    </span>
  );
}
