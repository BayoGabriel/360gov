import { Check } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { formatLongDate } from '../../../shared/lib/format-date';
import type { TaskRecord, TaskStatus } from '../types/tasks.types';
import { TaskAttachmentRow } from './TaskAttachmentRow';
import styles from './tasks.module.css';

const STATUS_LABELS: Record<TaskStatus, string> = {
  'to-do': 'To-Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

interface TaskViewDialogProps {
  task: TaskRecord;
  onClose: () => void;
}

export function TaskViewDialog({ task, onClose }: TaskViewDialogProps) {
  return (
    <Modal open onClose={onClose} title="Task Details">
      <div className={styles.dialogBody}>
        <div className={styles.formHeader}>
          <span
            className={`${styles.createIcon} ${
              styles[`viewIcon-${task.status}`]
            }`}
            aria-hidden="true"
          >
            <Check size={22} />
          </span>
          <p className={styles.formSubtitle}>
            {STATUS_LABELS[task.status]} · created by {task.createdBy} on{' '}
            {formatLongDate(task.createdOn)}
          </p>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Task Title</span>
          <p className={styles.titleBox}>{task.title}</p>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Description</span>
          <p className={styles.viewText}>{task.description}</p>
        </div>
        {task.attachment ? (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Attachment</span>
            <TaskAttachmentRow attachment={task.attachment} />
          </div>
        ) : null}
        <dl className={styles.meta}>
          <div className={styles.metaItem}>
            <dt>Department:</dt>
            <dd>{task.department}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>Assignee:</dt>
            <dd>{task.assignee}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>Start Date:</dt>
            <dd>{formatLongDate(task.startDate)}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>End Date:</dt>
            <dd>{formatLongDate(task.endDate)}</dd>
          </div>
        </dl>
        {task.priorities.length > 0 ? (
          <ul className={styles.chips}>
            {task.priorities.map((priority) => (
              <li
                key={priority}
                className={`${styles.chip} ${styles[`chip-${priority}`]}`}
              >
                {priority}
              </li>
            ))}
          </ul>
        ) : null}
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
