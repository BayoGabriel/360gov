import { List } from 'lucide-react';
import { Link } from 'react-router';
import type { DashboardData } from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { DocList } from './DocList';
import { PanelCard } from './PanelCard';
import { StatCard } from './StatCard';

type StaffData = Extract<DashboardData, { role: 'staff' }>;

export function StaffDashboard({ data }: { data: StaffData }) {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
      </div>
      <div className={styles.statsGrid}>
        {data.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
      <PanelCard
        title="My Recent Tasks"
        headerAction={
          <Link to="/tasks" className={styles.viewAll}>
            <List size={14} aria-hidden="true" />
            View All
          </Link>
        }
      >
        <DocList items={data.tasks} />
      </PanelCard>
    </div>
  );
}
