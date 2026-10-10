import { X } from 'lucide-react';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { useToast } from '../../../shared/components/Toast';
import { useApplicantPanel } from '../hooks/useApplicantPanel';
import { useSetBidStatus } from '../queries/procurement.mutations';
import type { Bid, ContractStatus } from '../types/procurement.types';
import { bidStatusLabel } from '../utils/procurement-formatters';
import { ApplicantActions } from './ApplicantActions';
import { ApplicantComposer } from './ApplicantComposer';
import { ApplicantDetails } from './ApplicantDetails';
import { ApplicantDocuments } from './ApplicantDocuments';
import { ApplicantMessages } from './ApplicantMessages';
import { BidStatusBadge } from './BidStatusBadge';
import styles from './procurement.module.css';

interface ApplicantPanelProps {
  contractId: string;
  contractStatus: ContractStatus;
  currency: string;
  bid: Bid;
  onRequestAdjustment: (bid: Bid) => void;
  onAward: (bid: Bid) => void;
  onClose: () => void;
}

const PANEL_TABS = [
  { id: 'messages', label: 'Messages' },
  { id: 'documents', label: 'Documents' },
  { id: 'details', label: 'Details' },
] as const;

export function ApplicantPanel({
  contractId,
  contractStatus,
  currency,
  bid,
  onRequestAdjustment,
  onAward,
  onClose,
}: ApplicantPanelProps) {
  const panel = useApplicantPanel(contractId, bid.id);
  const setStatus = useSetBidStatus(contractId);
  const toast = useToast();

  const changeStatus = (status: typeof bid.status) => {
    setStatus.mutate(
      { bidId: bid.id, status },
      {
        onSuccess: () =>
          toast.success(
            `${bid.vendor.companyName} — ${bidStatusLabel(status).toLowerCase()}.`,
          ),
        onError: () => toast.error('The bid status could not be updated.'),
      },
    );
  };

  return (
    <aside
      className={styles.detailPanel}
      aria-label={`Bid from ${bid.vendor.companyName}`}
    >
      <div className={styles.detailBar}>
        <h2 className={styles.detailBarTitle}>Bid Application</h2>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Close applicant panel"
          onClick={onClose}
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <div className={styles.vendorHead}>
        <Avatar
          name={bid.vendor.companyName}
          src={bid.vendor.avatarUrl}
          size={40}
        />
        <span className={styles.vendorMeta}>
          <span className={styles.vendorName}>{bid.vendor.companyName}</span>
          <span className={styles.vendorSub}>
            {bid.vendor.registrationNo} · {bid.vendor.contactName}
          </span>
        </span>
        <BidStatusBadge status={bid.status} />
      </div>
      <ApplicantActions
        contractStatus={contractStatus}
        bidStatus={bid.status}
        busy={setStatus.isPending}
        onSetStatus={changeStatus}
        onRequestAdjustment={() => onRequestAdjustment(bid)}
        onAward={() => onAward(bid)}
      />
      <div className={styles.panelTabs} role="tablist" aria-label="Bid details">
        {PANEL_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={panel.tab === t.id}
            className={`${styles.panelTab} ${panel.tab === t.id ? styles.panelTabActive : ''}`}
            onClick={() => panel.setTab(t.id)}
          >
            {t.label}
            {t.id === 'documents' ? (
              <span className={styles.countChip}>{bid.documents.length}</span>
            ) : null}
          </button>
        ))}
      </div>
      <div className={styles.panelScroll}>
        {panel.tab === 'messages' ? (
          <ApplicantMessages
            messages={panel.messages.data}
            loading={panel.messages.isPending}
            error={panel.messages.isError}
            onRetry={() => void panel.messages.refetch()}
          />
        ) : panel.tab === 'documents' ? (
          <ApplicantDocuments bid={bid} />
        ) : (
          <ApplicantDetails bid={bid} currency={currency} />
        )}
      </div>
      {panel.tab === 'messages' ? (
        <ApplicantComposer
          pending={panel.send.isPending}
          error={panel.send.isError}
          onSend={panel.sendMessage}
          aiSubject={`${bid.vendor.companyName} — bid for contract`}
          aiContext={`Proposal: ₦${bid.proposalAmount.toLocaleString()}. Status: ${bid.status}. ${bid.coverLetter}`}
        />
      ) : null}
    </aside>
  );
}
