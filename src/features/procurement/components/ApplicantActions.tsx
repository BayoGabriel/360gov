import type { BidStatus, ContractStatus } from '../types/procurement.types';
import styles from './procurement.module.css';

interface ApplicantActionsProps {
  contractStatus: ContractStatus;
  bidStatus: BidStatus;
  busy: boolean;
  onSetStatus: (status: BidStatus) => void;
  onRequestAdjustment: () => void;
  onAward: () => void;
}

interface Action {
  key: string;
  label: string;
  run: (props: ApplicantActionsProps) => void;
  danger?: boolean;
}

const ACTIONS: Action[] = [
  {
    key: 'review',
    label: 'Mark Under Review',
    run: (p) => p.onSetStatus('under-review'),
  },
  {
    key: 'shortlist',
    label: 'Shortlist',
    run: (p) => p.onSetStatus('shortlisted'),
  },
  {
    key: 'adjustment',
    label: 'Request Adjustment',
    run: (p) => p.onRequestAdjustment(),
  },
  {
    key: 'award',
    label: 'Award Contract',
    run: (p) => p.onAward(),
  },
  {
    key: 'reject',
    label: 'Reject Bid',
    run: (p) => p.onSetStatus('rejected'),
    danger: true,
  },
];

function availableActions(
  contractStatus: ContractStatus,
  bidStatus: BidStatus,
): string[] {
  const evaluable = contractStatus === 'open' || contractStatus === 'evaluation';
  if (!evaluable) return [];
  switch (bidStatus) {
    case 'submitted':
      return ['review', 'shortlist', 'adjustment', 'reject'];
    case 'under-review':
      return ['shortlist', 'adjustment', 'reject'];
    case 'shortlisted':
      return ['award', 'adjustment', 'reject'];
    case 'adjustment-requested':
      return ['shortlist', 'reject'];
    default:
      return [];
  }
}

export function ApplicantActions(props: ApplicantActionsProps) {
  const keys = availableActions(props.contractStatus, props.bidStatus);
  if (keys.length === 0) return null;
  return (
    <div className={styles.applicantActions}>
      {ACTIONS.filter((a) => keys.includes(a.key)).map((action) => (
        <button
          key={action.key}
          type="button"
          className={action.danger ? styles.dangerButton : styles.outlineButton}
          disabled={props.busy}
          onClick={() => action.run(props)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
