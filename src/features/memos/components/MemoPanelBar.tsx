import { Maximize2, Search, X } from 'lucide-react';
import styles from './memos.module.css';

interface MemoPanelBarProps {
  total: number;
  searchOpen: boolean;
  expanded: boolean;
  onToggleSearch: () => void;
  onToggleExpand: () => void;
  onClose: () => void;
}

export function MemoPanelBar({
  total,
  searchOpen,
  expanded,
  onToggleSearch,
  onToggleExpand,
  onClose,
}: MemoPanelBarProps) {
  return (
    <div className={styles.detailBar}>
      <h2 className={styles.detailTitle}>
        Memos <span className={styles.countChip}>{total}</span>
      </h2>
      <div className={styles.detailActions}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Search messages"
          aria-pressed={searchOpen}
          onClick={onToggleSearch}
        >
          <Search size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Expand panel"
          aria-pressed={expanded}
          onClick={onToggleExpand}
        >
          <Maximize2 size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Close memo panel"
          onClick={onClose}
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
