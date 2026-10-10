import { Check } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { useAddUserForm } from '../hooks/useAddUserForm';
import { useUserFormOptions } from '../queries/users.queries';
import { UserFormFields } from './UserFormFields';
import styles from './users.module.css';

export function AddUserDialog({ onClose }: { onClose: () => void }) {
  const { form, submit, isPending, isError } = useAddUserForm(onClose);
  const options = useUserFormOptions(true);

  return (
    <Modal open onClose={onClose} title="Add User">
      <form className={styles.dialogBody} onSubmit={submit} noValidate>
        <div className={styles.formHeader}>
          <span className={styles.createIcon} aria-hidden="true">
            <Check size={22} />
          </span>
          <p className={styles.formSubtitle}>
            All fields should be filled with importance
          </p>
        </div>
        <UserFormFields
          form={form}
          options={options.data}
          optionsPending={options.isPending}
        />
        {isError ? (
          <p className={styles.errorText} role="alert">
            The user could not be added. Please try again.
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
            Add User
          </button>
        </div>
      </form>
    </Modal>
  );
}
