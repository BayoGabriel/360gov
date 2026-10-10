import { Modal } from '../../../shared/components/Modal';
import { useDeleteTask } from '../queries/tasks.mutations';
import type { TaskRecord } from '../types/tasks.types';
import styles from './tasks.module.css';

interface DeleteTaskDialogProps {
  task: TaskRecord;
  onClose: () => void;
}

export function DeleteTaskDialog({ task, onClose }: DeleteTaskDialogProps) {
  const deleteTask = useDeleteTask();

  return (
    <Modal open onClose={onClose} title="Delete Task">
      <div className={styles.dialogBody}>
        <p className={styles.formSubtitle}>
          Delete &ldquo;{task.title}&rdquo;? This cannot be undone.
        </p>
        {deleteTask.isError ? (
          <p className={styles.errorText} role="alert">
            The task could not be deleted. Please try again.
          </p>
        ) : null}
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={deleteTask.isPending}
            onClick={() => deleteTask.mutate(task.id, { onSuccess: onClose })}
          >
            Delete Task
          </button>
        </div>
      </div>
    </Modal>
  );
}
