import { useState } from 'react';
import { SelectField } from '../../../shared/components/FormField';
import { Modal } from '../../../shared/components/Modal';
import type { UserFilters } from '../hooks/useUsersPage';
import { USER_ROLES } from '../types/users.types';
import type {
  UserFormOptions,
  UserRole,
  UserStatus,
} from '../types/users.types';
import styles from './users.module.css';

const STATUS_OPTIONS: Array<{ value: UserStatus; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'in-active', label: 'In-Active' },
];

interface UserFilterDialogProps {
  options?: UserFormOptions;
  current: UserFilters;
  onApply: (filters: UserFilters) => void;
  onClose: () => void;
}

export function UserFilterDialog({
  options,
  current,
  onApply,
  onClose,
}: UserFilterDialogProps) {
  const [draft, setDraft] = useState<UserFilters>(current);

  return (
    <Modal open onClose={onClose} title="Filter">
      <div className={styles.dialogBody}>
        <SelectField
          label="Status"
          value={draft.status ?? ''}
          placeholder="Select Status"
          options={STATUS_OPTIONS}
          onChange={(status) =>
            setDraft({
              ...draft,
              status: (status || undefined) as UserStatus | undefined,
            })
          }
        />
        <SelectField
          label="Role"
          value={draft.role ?? ''}
          placeholder="Select Role"
          options={USER_ROLES.map(({ value, label }) => ({ value, label }))}
          onChange={(role) =>
            setDraft({
              ...draft,
              role: (role || undefined) as UserRole | undefined,
            })
          }
        />
        <SelectField
          label="Department"
          value={draft.department ?? ''}
          placeholder="Select Department"
          options={(options?.departments ?? []).map((d) => ({
            value: d,
            label: d,
          }))}
          onChange={(department) =>
            setDraft({ ...draft, department: department || undefined })
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
