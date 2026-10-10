import { Eye, SquareCheck } from 'lucide-react';
import { Link } from 'react-router';
import type { DashboardData } from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { ActiveUsersCard } from './ActiveUsersCard';
import { ActivitiesCard } from './ActivitiesCard';
import { StatCard } from './StatCard';
import { TaskProcessedCard } from './TaskProcessedCard';

type ExecutiveData = Extract<DashboardData, { role: 'permanent-secretary' }>;

export function PermanentSecretaryDashboard({ data }: { data: ExecutiveData }) {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <div className={styles.pageActions}>
          <Link to="/reports" className={styles.outlineButton}>
            <Eye size={16} aria-hidden="true" />
            View Departmental Reports
          </Link>
          <button type="button" className={styles.primaryButton}>
            <SquareCheck size={16} aria-hidden="true" />
            Approve all Pending Files
          </button>
        </div>
      </div>
      <div className={styles.statsGrid}>
        {data.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
      <div className={styles.execGrid}>
        <ActiveUsersCard activeUsers={data.activeUsers} />
        <TaskProcessedCard taskProcessed={data.taskProcessed} />
        <ActivitiesCard items={data.activities} />
      </div>
    </div>
  );
}
