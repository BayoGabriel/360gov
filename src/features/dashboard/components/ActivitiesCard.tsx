import { List } from 'lucide-react';
import { Link } from 'react-router';
import { AiAssist } from '../../../shared/components/AiAssist';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import type { ActivityItem } from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { PanelCard } from './PanelCard';

export function ActivitiesCard({ items }: { items: ActivityItem[] }) {
  return (
    <PanelCard
      title="Activities Log"
      headerAction={
        <span className={styles.viewAllGroup}>
          <AiAssist
            task="summarize"
            purpose="activity-digest"
            subject="Recent activity"
            context={items.map((item) => item.description).join(' ')}
            variant="icon"
            label="Summarize recent activity"
          />
          <Link to="/reports" className={styles.viewAll}>
            <List size={14} aria-hidden="true" />
            View All
          </Link>
        </span>
      }
    >
      <ul className={styles.activityList}>
        {items.map((item) => (
          <li key={item.id} className={styles.activityItem}>
            <Avatar name={item.actorName} size={40} />
            <div className={styles.activityBody}>
              <p className={styles.activityName}>{item.actorName}</p>
              <p className={styles.activityHandle}>@{item.actorEmail}</p>
              <p className={styles.activityText}>{item.description}</p>
              <p className={styles.activityDate}>
                {formatListTimestamp(item.date)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </PanelCard>
  );
}
