import { CheckCheck, Eye, Pencil, Play, Trash2 } from 'lucide-react';
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
  isAdmin: boolean;
  canWork: boolean;
  onView: (task: TaskRecord) => void;
  onEdit: (task: TaskRecord) => void;
  onDelete: (task: TaskRecord) => void;
  onCapture: (task: TaskRecord) => void;
  onStart: (task: TaskRecord) => void;
  onConclude: (task: TaskRecord) => void;
  actionPending: boolean;
}

export function TaskCard({
  task,
  isAdmin,
  canWork,
  onView,
  onEdit,
  onDelete,
  onCapture,
  onStart,
  onConclude,
  actionPending,
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
              aria-label={`View task ${task.title}`}
              title="View details"
              onClick={() => onView(task)}
            >
              <Eye size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.iconButton}
              aria-label={`Edit task ${task.title}`}
              title="Edit task"
              onClick={() => onEdit(task)}
            >
              <Pencil size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${styles.iconButton} ${styles.iconButtonDanger}`}
              aria-label={`Delete task ${task.title}`}
              title="Delete task"
              onClick={() => onDelete(task)}
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
          </span>
          {isAdmin ? (
            <button
              type="button"
              className={styles.captureButton}
              disabled={task.captured || actionPending}
              onClick={() => onCapture(task)}
            >
              {task.captured ? 'Request Captured' : 'Capture Request'}
            </button>
          ) : task.status === 'to-do' ? (
            <button
              type="button"
              className={styles.captureButton}
              disabled={!canWork || actionPending}
              title={canWork ? undefined : 'Only the assignee can start this task'}
              onClick={() => onStart(task)}
            >
              <Play size={14} aria-hidden="true" />
              Start Task
            </button>
          ) : task.status === 'in-progress' ? (
            <button
              type="button"
              className={`${styles.captureButton} ${styles.concludeButton}`}
              disabled={!canWork || actionPending}
              title={
                canWork ? undefined : 'Only the assignee can conclude this task'
              }
              onClick={() => onConclude(task)}
            >
              <CheckCheck size={14} aria-hidden="true" />
              Conclude Task
            </button>
          ) : (
            <span className={styles.doneTag}>
              <CheckCheck size={14} aria-hidden="true" />
              Concluded
            </span>
          )}
        </footer>
      </div>
    </article>
  );
}
