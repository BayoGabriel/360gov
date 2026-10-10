import { Pencil, Trash2 } from 'lucide-react';
import { formatLongDate } from '../../../shared/lib/format-date';
import type { TaskRecord, TaskStatus } from '../types/tasks.types';
import { TaskAttachmentRow } from './TaskAttachmentRow';
import styles from './tasks.module.css';

const STATUS_LABELS: Record<TaskStatus, string> = {
  'to-do': 'To-Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

interface TaskCardProps {
  task: TaskRecord;
  onEdit: (task: TaskRecord) => void;
  onDelete: (task: TaskRecord) => void;
  onCapture: (task: TaskRecord) => void;
  capturePending: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onCapture,
  capturePending,
}: TaskCardProps) {
  return (
    <article className={styles.card}>
      <header className={`${styles.band} ${styles[`band-${task.status}`]}`}>
        {STATUS_LABELS[task.status]}
      </header>
      <div className={styles.cardBody}>
        <div className={styles.field}>
          <span className={styles.cardLabel}>Task Title:</span>
          <p className={styles.titleBox}>{task.title}</p>
        </div>
        {task.attachment ? (
          <TaskAttachmentRow attachment={task.attachment} />
        ) : null}
        <dl className={styles.meta}>
          <div className={styles.metaItem}>
            <dt>Start Date:</dt>
            <dd>{formatLongDate(task.startDate)}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>End Date:</dt>
            <dd>{formatLongDate(task.endDate)}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>Created By:</dt>
            <dd>{task.createdBy}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>Created On:</dt>
            <dd>{formatLongDate(task.createdOn)}</dd>
          </div>
        </dl>
        <footer className={styles.cardFooter}>
          <span className={styles.iconActions}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label={`Delete task ${task.title}`}
              onClick={() => onDelete(task)}
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.iconButton}
              aria-label={`Edit task ${task.title}`}
              onClick={() => onEdit(task)}
            >
              <Pencil size={15} aria-hidden="true" />
            </button>
          </span>
          <button
            type="button"
            className={styles.captureButton}
            disabled={task.captured || capturePending}
            onClick={() => onCapture(task)}
          >
            {task.captured ? 'Request Captured' : 'Capture Request'}
          </button>
        </footer>
      </div>
    </article>
  );
}
