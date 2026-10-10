import { useState } from 'react';
import { SelectField } from '../../../shared/components/FormField';
import { Modal } from '../../../shared/components/Modal';
import { useAssignRole } from '../queries/users.mutations';
import { USER_ROLES } from '../types/users.types';
import type { UserRecord, UserRole } from '../types/users.types';
import styles from './users.module.css';

interface AssignRoleDialogProps {
  user: UserRecord;
  onClose: () => void;
}

export function AssignRoleDialog({ user, onClose }: AssignRoleDialogProps) {
  const [role, setRole] = useState<UserRole>(user.role);
  const assignRole = useAssignRole();

  return (
    <Modal open onClose={onClose} title="Assign Role">
      <div className={styles.dialogBody}>
        <p className={styles.formSubtitle}>
          Choose a new role for {user.name}.
        </p>
        <SelectField
          label="Role"
          value={role}
          placeholder="Role"
          options={USER_ROLES.map(({ value, label }) => ({ value, label }))}
          onChange={(value) => setRole(value as UserRole)}
        />
        {assignRole.isError ? (
          <p className={styles.errorText} role="alert">
            The role could not be assigned. Please try again.
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
            disabled={role === user.role || assignRole.isPending}
            onClick={() =>
              assignRole.mutate({ userId: user.id, role }, { onSuccess: onClose })
            }
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
