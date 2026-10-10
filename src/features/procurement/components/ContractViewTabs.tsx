import { CONTRACT_VIEWS } from '../hooks/useProcurementPage';
import type { ContractView } from '../types/procurement.types';
import styles from './procurement.module.css';

interface ContractViewTabsProps {
  view: ContractView;
  onChange: (view: ContractView) => void;
}

export function ContractViewTabs({ view, onChange }: ContractViewTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Contract views">
      {CONTRACT_VIEWS.map((v) => (
        <button
          key={v.id}
          type="button"
          role="tab"
          aria-selected={view === v.id}
          className={`${styles.tab} ${view === v.id ? styles.tabActive : ''}`}
          onClick={() => onChange(v.id)}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
