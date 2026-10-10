import { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import type { TaskFilters } from '../hooks/useTasksPage';
import { TASK_PRIORITIES } from '../types/tasks.types';
import type {
  TaskFormOptions,
  TaskPriority,
  TaskStatus,
} from '../types/tasks.types';
import { SelectField } from '../../../shared/components/FormField';
import styles from './tasks.module.css';

const STATUS_OPTIONS: Array<{ value: TaskStatus; label: string }> = [
  { value: 'to-do', label: 'To-Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS = TASK_PRIORITIES.map((value) => ({
  value,
  label: value === 'in-progress' ? 'In progress' : value[0].toUpperCase() + value.slice(1),
}));

interface TaskFilterDialogProps {
  options?: TaskFormOptions;
  current: TaskFilters;
  onApply: (filters: TaskFilters) => void;
  onClose: () => void;
}

export function TaskFilterDialog({
  options,
  current,
  onApply,
  onClose,
}: TaskFilterDialogProps) {
  const [draft, setDraft] = useState<TaskFilters>(current);

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
              status: (status || undefined) as TaskStatus | undefined,
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
        <SelectField
          label="Priority"
          value={draft.priority ?? ''}
          placeholder="Select Priority"
          options={PRIORITY_OPTIONS}
          onChange={(priority) =>
            setDraft({
              ...draft,
              priority: (priority || undefined) as TaskPriority | undefined,
            })
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
