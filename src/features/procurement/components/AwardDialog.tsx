import { Modal } from '../../../shared/components/Modal';
import { useToast } from '../../../shared/components/Toast';
import { useAwardContract } from '../queries/procurement.mutations';
import type { Bid, Contract } from '../types/procurement.types';
import { formatMoney } from '../utils/procurement-formatters';
import styles from './procurement.module.css';

interface AwardDialogProps {
  contract: Contract;
  bid: Bid;
  onClose: () => void;
}

export function AwardDialog({ contract, bid, onClose }: AwardDialogProps) {
  const award = useAwardContract(contract.id);
  const toast = useToast();

  const confirm = () => {
    award.mutate(bid.id, {
      onSuccess: () => {
        toast.success(
          `Contract awarded to ${bid.vendor.companyName}. The agreement has been sent for signature.`,
        );
        onClose();
      },
      onError: () => toast.error('The contract could not be awarded.'),
    });
  };

  return (
    <Modal open onClose={onClose} title="Award Contract">
      <div className={styles.dialogBody}>
        <p className={styles.dialogNote}>
          Award <strong>{contract.referenceNo}</strong> to{' '}
          <strong>{bid.vendor.companyName}</strong> for{' '}
          <strong>{formatMoney(bid.proposalAmount, contract.currency)}</strong>?
        </p>
        <p className={styles.dialogNote}>
          All other bids will be marked as rejected and a contract agreement
          will be generated for both parties to sign. This action is recorded
          in the activity trail.
        </p>
        {award.isError ? (
          <p className={styles.errorText} role="alert">
            The award could not be completed. Please try again.
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
            disabled={award.isPending}
            onClick={confirm}
          >
            {award.isPending ? 'Awarding…' : 'Award Contract'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
