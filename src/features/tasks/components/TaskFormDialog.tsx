import { Check } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { useTaskForm } from '../hooks/useTaskForm';
import { useTaskFormOptions } from '../queries/tasks.queries';
import type { TaskRecord } from '../types/tasks.types';
import { TaskFormFields } from './TaskFormFields';
import styles from './tasks.module.css';

interface TaskFormDialogProps {
  task: TaskRecord | null;
  onClose: () => void;
}

export function TaskFormDialog({ task, onClose }: TaskFormDialogProps) {
  const { form, submit, isPending, isError } = useTaskForm(task, onClose);
  const options = useTaskFormOptions(true);

  return (
    <Modal open onClose={onClose} title={task ? 'Edit Task' : 'Create Task'}>
      <form className={styles.dialogBody} onSubmit={submit} noValidate>
        <div className={styles.formHeader}>
          <span className={styles.createIcon} aria-hidden="true">
            <Check size={22} />
          </span>
          <p className={styles.formSubtitle}>
            All fields should be filled with importance
          </p>
        </div>
        <TaskFormFields
          form={form}
          options={options.data}
          optionsPending={options.isPending}
        />
        {isError ? (
          <p className={styles.errorText} role="alert">
            The task could not be saved. Please try again.
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
            type="submit"
            className={styles.primaryButton}
            disabled={isPending}
          >
            {task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
