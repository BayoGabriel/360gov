import { ChevronRight } from 'lucide-react';
import { PersonCell } from '../../../shared/components/PersonCell';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import type { Bid } from '../types/procurement.types';
import { formatMoney } from '../utils/procurement-formatters';
import { BidStatusBadge } from './BidStatusBadge';
import styles from './procurement.module.css';

interface ApplicantsTabProps {
  bids: Bid[] | undefined;
  loading: boolean;
  error: boolean;
  currency: string;
  onRetry: () => void;
  onOpenBid: (bid: Bid) => void;
}

export function ApplicantsTab({
  bids,
  loading,
  error,
  currency,
  onRetry,
  onOpenBid,
}: ApplicantsTabProps) {
  if (loading) {
    return (
      <p className={styles.status} role="status">
        Loading applicants…
      </p>
    );
  }
  if (error || !bids) {
    return (
      <div className={styles.status} role="alert">
        <p>The applicant list could not be loaded.</p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }
  if (bids.length === 0) {
    return (
      <p className={styles.status}>
        No bids have been submitted for this contract yet.
      </p>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Vendor</th>
            <th scope="col">Proposal</th>
            <th scope="col">Submitted</th>
            <th scope="col">Documents</th>
            <th scope="col">Status</th>
            <th scope="col" className={styles.chevronCell}>
              <span className={styles.visuallyHidden}>Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid) => (
            <tr
              key={bid.id}
              className={styles.clickable}
              onClick={() => onOpenBid(bid)}
            >
              <td>
                <PersonCell
                  name={bid.vendor.companyName}
                  email={bid.vendor.contactName}
                  avatarUrl={bid.vendor.avatarUrl}
                  size={34}
                />
              </td>
              <td className={styles.moneyCell}>
                {formatMoney(bid.proposalAmount, currency)}
              </td>
              <td className={styles.dateCell}>
                {formatListTimestamp(bid.submittedAt)}
              </td>
              <td>
                <span className={styles.countChip}>
                  {bid.documents.length}
                </span>
              </td>
              <td>
                <BidStatusBadge status={bid.status} />
              </td>
              <td className={styles.chevronCell}>
                <ChevronRight size={16} aria-hidden="true" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
