import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AiAssist } from '../../../shared/components/AiAssist';
import { InputField } from '../../../shared/components/FormField';
import { Modal } from '../../../shared/components/Modal';
import { useDeactivateUser } from '../queries/users.mutations';
import { deactivateSchema } from '../schemas/users.schemas';
import type { DeactivateFormValues } from '../schemas/users.schemas';
import type { UserRecord } from '../types/users.types';
import styles from './users.module.css';

interface DeactivateUserDialogProps {
  user: UserRecord;
  onClose: () => void;
}

export function DeactivateUserDialog({
  user,
  onClose,
}: DeactivateUserDialogProps) {
  const { register, handleSubmit, setValue, formState } =
    useForm<DeactivateFormValues>({
      resolver: zodResolver(deactivateSchema),
      defaultValues: { reasonTitle: '', description: '' },
    });
  const deactivate = useDeactivateUser(user.id);
  const errors = formState.errors;

  return (
    <Modal open onClose={onClose} title="Deactivation Reason">
      <form
        className={styles.dialogBody}
        onSubmit={handleSubmit((values) =>
          deactivate.mutate(values, { onSuccess: onClose }),
        )}
        noValidate
      >
        <div className={styles.formHeader}>
          <span className={styles.createIcon} aria-hidden="true">
            <Check size={22} />
          </span>
          <p className={styles.formSubtitle}>
            All fields should be filled with importance
          </p>
        </div>
        <InputField
          label="Reason Title"
          placeholder="Reason Title"
          registration={register('reasonTitle')}
          error={errors.reasonTitle?.message}
        />
        <div>
          <InputField
            label="Description"
            placeholder="Description"
            multiline
            registration={register('description')}
            error={errors.description?.message}
          />
          <AiAssist
            task="draft"
            purpose="deactivation-reason"
            subject={user.name}
            context={`Role: ${user.role}. Department: ${user.department}.`}
            variant="link"
            onApply={(text) =>
              setValue('description', text, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </div>
        {deactivate.isError ? (
          <p className={styles.errorText} role="alert">
            The user could not be deactivated. Please try again.
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
            disabled={deactivate.isPending}
          >
            Send
          </button>
        </div>
      </form>
    </Modal>
  );
}
