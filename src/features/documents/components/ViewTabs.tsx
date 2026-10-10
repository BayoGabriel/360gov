import { DOCUMENT_VIEWS } from '../hooks/useDocumentsPage';
import type { DocumentView } from '../types/documents.types';
import styles from '../documents.module.css';

interface ViewTabsProps {
  view: DocumentView;
  onChange: (view: DocumentView) => void;
}

export function ViewTabs({ view, onChange }: ViewTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Document views">
      {DOCUMENT_VIEWS.map((v) => (
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
