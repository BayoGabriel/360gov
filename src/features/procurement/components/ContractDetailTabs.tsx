import type { DetailTab } from '../hooks/useContractDetail';
import styles from './procurement.module.css';

interface ContractDetailTabsProps {
  tab: DetailTab;
  applicantCount: number;
  documentCount: number;
  onChange: (tab: DetailTab) => void;
}

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'applicants', label: 'Applicants' },
  { id: 'documents', label: 'Documents' },
  { id: 'activity', label: 'Activity Trail' },
];

export function ContractDetailTabs({
  tab,
  applicantCount,
  documentCount,
  onChange,
}: ContractDetailTabsProps) {
  const countFor = (id: DetailTab) =>
    id === 'applicants' ? applicantCount : id === 'documents' ? documentCount : null;

  return (
    <div className={styles.detailTabs} role="tablist" aria-label="Contract detail">
      {TABS.map((t) => {
        const count = countFor(t.id);
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`${styles.detailTab} ${tab === t.id ? styles.detailTabActive : ''}`}
            onClick={() => onChange(t.id)}
          >
            {t.label}
            {count !== null ? (
              <span className={styles.countChip}>{count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
