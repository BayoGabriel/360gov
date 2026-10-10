import { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { SelectField } from '../../../shared/components/FormField';
import type { ContractFilters } from '../hooks/useProcurementPage';
import type {
  ContractCategory,
  ContractFilterOptions,
  ContractStatus,
  ContractView,
  ProcurementMethod,
} from '../types/procurement.types';
import {
  categoryLabel,
  contractStatusLabel,
  methodLabel,
} from '../utils/procurement-formatters';
import styles from './procurement.module.css';

interface ContractFilterDialogProps {
  view: ContractView;
  options?: ContractFilterOptions;
  current: ContractFilters;
  onApply: (filters: ContractFilters) => void;
  onClose: () => void;
}

const ALL_STATUSES: ContractStatus[] = [
  'draft',
  'open',
  'evaluation',
  'awarded',
  'completed',
  'cancelled',
];

const ALL_CATEGORIES: ContractCategory[] = [
  'goods',
  'works',
  'services',
  'consultancy',
];

const ALL_METHODS: ProcurementMethod[] = [
  'open-tender',
  'selective-tender',
  'direct-procurement',
  'request-for-quotation',
];

export function ContractFilterDialog({
  view,
  options,
  current,
  onApply,
  onClose,
}: ContractFilterDialogProps) {
  const [draft, setDraft] = useState<ContractFilters>(current);
  const set = (patch: Partial<ContractFilters>) =>
    setDraft((prev) => ({ ...prev, ...patch }));
  const enumOptions = <T extends string>(
    values: T[],
    label: (value: T) => string,
  ) => values.map((value) => ({ value, label: label(value) }));

  return (
    <Modal open onClose={onClose} title="Filter Contracts">
      <div className={styles.dialogBody}>
        {view === 'all' ? (
          <SelectField
            label="Status"
            value={draft.status ?? ''}
            placeholder="All statuses"
            options={enumOptions(ALL_STATUSES, contractStatusLabel)}
            onChange={(status) =>
              set({ status: (status || undefined) as ContractStatus | undefined })
            }
          />
        ) : null}
        <SelectField
          label="Category"
          value={draft.category ?? ''}
          placeholder="All categories"
          options={enumOptions(
            options?.categories ?? ALL_CATEGORIES,
            categoryLabel,
          )}
          onChange={(category) =>
            set({
              category: (category || undefined) as ContractCategory | undefined,
            })
          }
        />
        <SelectField
          label="Procurement Method"
          value={draft.method ?? ''}
          placeholder="All methods"
          options={enumOptions(options?.methods ?? ALL_METHODS, methodLabel)}
          onChange={(method) =>
            set({
              method: (method || undefined) as ProcurementMethod | undefined,
            })
          }
        />
        <SelectField
          label="Department"
          value={draft.department ?? ''}
          placeholder="All departments"
          options={(options?.departments ?? []).map((value) => ({
            value,
            label: value,
          }))}
          onChange={(department) => set({ department: department || undefined })}
        />
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={() => setDraft({})}
          >
            Reset
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => onApply(draft)}
          >
            Apply Filter
          </button>
        </div>
      </div>
    </Modal>
  );
}
