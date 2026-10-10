import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { InputField } from '../../../shared/components/FormField';
import { Modal } from '../../../shared/components/Modal';
import { useToast } from '../../../shared/components/Toast';
import { useRequestAdjustment } from '../queries/procurement.mutations';
import {
  adjustmentSchema,
  type AdjustmentFormValues,
} from '../schemas/procurement.schemas';
import type { Bid } from '../types/procurement.types';
import styles from './procurement.module.css';

interface AdjustmentDialogProps {
  contractId: string;
  bid: Bid;
  onClose: () => void;
}

export function AdjustmentDialog({
  contractId,
  bid,
  onClose,
}: AdjustmentDialogProps) {
  const toast = useToast();
  const request = useRequestAdjustment(contractId, bid.id);
  const { register, handleSubmit, formState } = useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: { note: '' },
  });

  const submit = handleSubmit((values) => {
    request.mutate(values.note, {
      onSuccess: () => {
        toast.success(
          `Adjustment requested from ${bid.vendor.companyName}. The note was posted to your conversation.`,
        );
        onClose();
      },
      onError: () => toast.error('The adjustment request could not be sent.'),
    });
  });

  return (
    <Modal open onClose={onClose} title="Request Adjustment">
      <form className={styles.dialogBody} onSubmit={submit} noValidate>
        <p className={styles.dialogNote}>
          Tell <strong>{bid.vendor.companyName}</strong> what needs to change in
          their bid — pricing, missing documents, or clarification. The request
          is posted to your conversation and logged in the trail.
        </p>
        <InputField
          label="Adjustment note"
          placeholder="e.g. Please resubmit your financial proposal with a breakdown of logistics costs"
          multiline
          registration={register('note')}
          error={formState.errors.note?.message}
        />
        {request.isError ? (
          <p className={styles.errorText} role="alert">
            The request could not be sent. Please try again.
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
            disabled={request.isPending}
          >
            {request.isPending ? 'Sending…' : 'Send Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
