import { History, Sparkles } from 'lucide-react';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import type { AiHistoryEntry } from '../hooks/useAiHub';
import styles from './ai-hub.module.css';

interface AiHistoryPanelProps {
  entries: AiHistoryEntry[];
  onView: (entry: AiHistoryEntry) => void;
}

export function AiHistoryPanel({ entries, onView }: AiHistoryPanelProps) {
  return (
    <aside className={styles.historyPanel} aria-label="AI run history">
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>
          <History size={16} aria-hidden="true" /> Recent runs
        </h2>
      </div>
      {entries.length === 0 ? (
        <p className={styles.empty}>
          Nothing generated yet. Run a capability or use the console — results
          appear here.
        </p>
      ) : (
        <ul className={styles.historyList}>
          {entries.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                className={styles.historyItem}
                onClick={() => onView(entry)}
              >
                <span className={styles.historyIcon} aria-hidden="true">
                  <Sparkles size={14} />
                </span>
                <span className={styles.historyMeta}>
                  <span className={styles.historyLabel}>{entry.label}</span>
                  <span className={styles.historySubject}>{entry.subject}</span>
                  <span className={styles.historyTime}>
                    {formatListTimestamp(entry.ranAt)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
