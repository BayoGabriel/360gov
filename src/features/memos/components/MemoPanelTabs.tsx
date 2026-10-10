import type { MemoPanelTab } from '../hooks/useMemoPanel';
import styles from './memos.module.css';

interface MemoPanelTabsProps {
  tab: MemoPanelTab;
  participantCount: number;
  onChange: (tab: MemoPanelTab) => void;
}

export function MemoPanelTabs({
  tab,
  participantCount,
  onChange,
}: MemoPanelTabsProps) {
  return (
    <div className={styles.detailTabs} role="tablist" aria-label="Memo detail">
      <button
        type="button"
        role="tab"
        aria-selected={tab === 'messages'}
        className={`${styles.detailTab} ${tab === 'messages' ? styles.detailTabActive : ''}`}
        onClick={() => onChange('messages')}
      >
        Messages
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={tab === 'participants'}
        className={`${styles.detailTab} ${tab === 'participants' ? styles.detailTabActive : ''}`}
        onClick={() => onChange('participants')}
      >
        Participants
        <span className={styles.countChip}>{participantCount}</span>
      </button>
    </div>
  );
}
