import { FileText, Users } from 'lucide-react';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import type { DocumentListItem } from '../types/dashboard.types';
import styles from '../dashboard.module.css';

export function DocList({ items }: { items: DocumentListItem[] }) {
  return (
    <ul className={styles.docList}>
      {items.map((item) => (
        <li key={item.id} className={styles.docItem}>
          <span className={styles.docIcon}>
            <FileText size={16} aria-hidden="true" />
          </span>
          <span className={styles.docBody}>
            <span className={styles.docTitle}>{item.title}</span>
            <span className={styles.docMeta}>{item.reference}</span>
            <span className={styles.docMeta}>
              {formatListTimestamp(item.date)}
            </span>
          </span>
          <span
            className={styles.docAssignees}
            title={`${item.assigneeCount} assignees`}
          >
            <Users size={14} aria-hidden="true" />
            {item.assigneeCount}
          </span>
        </li>
      ))}
    </ul>
  );
}
