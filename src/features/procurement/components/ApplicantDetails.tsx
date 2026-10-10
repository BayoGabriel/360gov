import type { Bid } from '../types/procurement.types';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import { formatMoney } from '../utils/procurement-formatters';
import styles from './procurement.module.css';

export function ApplicantDetails({
  bid,
  currency,
}: {
  bid: Bid;
  currency: string;
}) {
  const fields: { label: string; value: string }[] = [
    { label: 'Company', value: bid.vendor.companyName },
    { label: 'Registration No', value: bid.vendor.registrationNo },
    { label: 'Contact Person', value: bid.vendor.contactName },
    { label: 'Email', value: bid.vendor.email },
    { label: 'Phone', value: bid.vendor.phone ?? '—' },
    {
      label: 'Proposal Amount',
      value: formatMoney(bid.proposalAmount, currency),
    },
    { label: 'Submitted', value: formatListTimestamp(bid.submittedAt) },
    { label: 'Last Updated', value: formatListTimestamp(bid.updatedAt) },
  ];

  return (
    <div>
      <ul className={styles.fieldList}>
        {fields.map((field) => (
          <li key={field.label}>
            <span className={styles.metaLabel}>{field.label}</span>
            <span className={styles.metaValue}>{field.value}</span>
          </li>
        ))}
      </ul>
      <div className={styles.panelSection}>
        <span className={styles.metaLabel}>Cover Letter</span>
        <p className={styles.coverLetter}>{bid.coverLetter}</p>
      </div>
    </div>
  );
}
