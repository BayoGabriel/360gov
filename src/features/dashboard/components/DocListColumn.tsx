import { List } from 'lucide-react';
import { Link } from 'react-router';
import type { DocumentListColumn } from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { DocList } from './DocList';
import { PanelCard } from './PanelCard';

export function DocListColumn({ column }: { column: DocumentListColumn }) {
  return (
    <PanelCard
      title={column.title}
      headerAction={
        <Link to={column.viewAllHref} className={styles.viewAll}>
          <List size={14} aria-hidden="true" />
          View All
        </Link>
      }
    >
      <DocList items={column.items} />
    </PanelCard>
  );
}
