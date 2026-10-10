import { formatLongDate } from '../../../shared/lib/format-date';
import type { Contract } from '../types/procurement.types';
import { formatMoney, methodLabel } from '../utils/procurement-formatters';
import styles from './procurement.module.css';

export function ContractSummaryCards({ contract }: { contract: Contract }) {
  const cards: { label: string; value: string }[] = [
    {
      label: 'Estimated Value',
      value: formatMoney(contract.budget, contract.currency),
    },
    {
      label: 'Submission Deadline',
      value: formatLongDate(contract.submissionDeadline),
    },
    {
      label: 'Bids Received',
      value: String(contract.applicationCount),
    },
    {
      label: 'Method',
      value: methodLabel(contract.method),
    },
  ];

  return (
    <div className={styles.statCards}>
      {cards.map((card) => (
        <div key={card.label} className={styles.statCard}>
          <span className={styles.statLabel}>{card.label}</span>
          <span className={styles.statValue}>{card.value}</span>
        </div>
      ))}
    </div>
  );
}
