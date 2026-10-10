import { ChevronDown, X } from 'lucide-react';
import { TASK_PRIORITIES } from '../types/tasks.types';
import type { TaskPriority } from '../types/tasks.types';
import styles from './tasks.module.css';

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  top: 'Top',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  'in-progress': 'In progress',
};

interface TaskPriorityPickerProps {
  value: TaskPriority[];
  onChange: (value: TaskPriority[]) => void;
  error?: string;
}

export function TaskPriorityPicker({
  value,
  onChange,
  error,
}: TaskPriorityPickerProps) {
  const add = (raw: string) => {
    const next = raw as TaskPriority;
    if (TASK_PRIORITIES.includes(next) && !value.includes(next)) {
      onChange([...value, next]);
    }
  };

  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel} id="task-priority-label">
        Priority
      </span>
      <span className={styles.selectWrap}>
        <select
          className={`${styles.select} ${error ? styles.invalid : ''}`}
          value=""
          aria-labelledby="task-priority-label"
          aria-invalid={error ? true : undefined}
          onChange={(event) => {
            add(event.target.value);
            event.target.value = '';
          }}
        >
          <option value="" disabled>
            Select priority
          </option>
          {TASK_PRIORITIES.filter((p) => !value.includes(p)).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className={styles.selectIcon}
          aria-hidden="true"
        />
      </span>
      {value.length > 0 ? (
        <ul className={styles.chips}>
          {value.map((priority) => (
            <li
              key={priority}
              className={`${styles.chip} ${styles[`chip-${priority}`]}`}
            >
              {PRIORITY_LABELS[priority]}
              <button
                type="button"
                className={styles.chipRemove}
                aria-label={`Remove ${PRIORITY_LABELS[priority]} priority`}
                onClick={() =>
                  onChange(value.filter((item) => item !== priority))
                }
              >
                <X size={13} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <p className={styles.errorText} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
