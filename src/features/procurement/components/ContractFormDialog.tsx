import { FileSignature } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Modal } from '../../../shared/components/Modal';
import { useToast } from '../../../shared/components/Toast';
import { ROUTES } from '../../../shared/constants/routes';
import { useContractForm } from '../hooks/useContractForm';
import { useContractFilterOptions } from '../queries/procurement.queries';
import { ContractFormFields } from './ContractFormFields';
import { ContractItemsFieldset } from './ContractItemsFieldset';
import styles from './procurement.module.css';

interface ContractFormDialogProps {
  onClose: () => void;
}

export function ContractFormDialog({ onClose }: ContractFormDialogProps) {
  const toast = useToast();
  const navigate = useNavigate();
  const { form, submit, isPending, isError } = useContractForm((contract) => {
    toast.success(
      contract.status === 'open'
        ? `${contract.referenceNo} published to the public notice board.`
        : `${contract.referenceNo} saved as a draft.`,
    );
    onClose();
    if (contract.status === 'open') {
      void navigate(`${ROUTES.procurement}/${contract.id}`);
    }
  });
  const options = useContractFilterOptions();

  return (
    <Modal
      open
      onClose={onClose}
      title="New Contract / Tender"
      className={styles.formDialog}
    >
      <form className={styles.dialogBody} onSubmit={submit} noValidate>
        <div className={styles.vendorHead}>
          <span className={styles.docIcon} aria-hidden="true">
            <FileSignature size={20} />
          </span>
          <p className={styles.dialogNote}>
            Published contracts appear on the public notice board where vendors
            can review the requirements and submit bids.
          </p>
        </div>
        <ContractFormFields
          form={form}
          options={options.data}
          optionsPending={options.isPending}
        />
        <ContractItemsFieldset form={form} />
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            className={styles.checkbox}
            {...form.register('publish')}
          />
          Publish to the public notice board immediately
        </label>
        {isError ? (
          <p className={styles.errorText} role="alert">
            The contract could not be created. Please try again.
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
            {isPending ? 'Creating…' : 'Create Contract'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
