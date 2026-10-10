import { ArrowLeft, Globe, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AiAssist } from '../../../shared/components/AiAssist';
import { ROUTES } from '../../../shared/constants/routes';
import type { Contract } from '../types/procurement.types';
import { contractActionsFor } from '../hooks/useContractDetail';
import { ContractStatusBadge } from './ContractStatusBadge';
import styles from './procurement.module.css';
import type { ContractAction } from '../types/procurement.types';

interface ContractDetailHeaderProps {
  contract: Contract;
  actionPending: boolean;
  onRequestAction: (action: ContractAction, confirm: boolean) => void;
}

export function ContractDetailHeader({
  contract,
  actionPending,
  onRequestAction,
}: ContractDetailHeaderProps) {
  const navigate = useNavigate();
  const actions = contractActionsFor(contract.status);
  const isPublic = contract.visibility === 'public';

  return (
    <div>
      <button
        type="button"
        className={styles.backLink}
        onClick={() => void navigate(ROUTES.procurement)}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Contracts
      </button>
      <div className={`${styles.detailHeader} ${styles.detailHeaderTop}`}>
        <div className={styles.detailTitleGroup}>
          <p className={styles.detailRef}>{contract.referenceNo}</p>
          <h1 className={styles.detailTitle}>{contract.title}</h1>
          <div className={styles.detailBadges}>
            <ContractStatusBadge status={contract.status} />
            <span
              className={isPublic ? styles.publicChip : styles.restrictedChip}
            >
              {isPublic ? (
                <Globe size={12} aria-hidden="true" />
              ) : (
                <Lock size={12} aria-hidden="true" />
              )}
              {isPublic ? 'Public tender' : 'Restricted tender'}
            </span>
          </div>
        </div>
        <div className={styles.actionRow}>
          <AiAssist
            task="summarize"
            purpose="contract-summary"
            subject={`${contract.referenceNo} — ${contract.title}`}
            context={`${contract.description} Status: ${contract.status}. Bids received: ${contract.applicationCount}. Items: ${contract.items.map((i) => i.description).join(', ')}.`}
          />
          {actions.map(({ action, label, confirm }) => (
            <button
              key={action}
              type="button"
              className={
                action === 'cancel' ? styles.dangerButton : styles.primaryButton
              }
              disabled={actionPending}
              onClick={() => onRequestAction(action, confirm)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
