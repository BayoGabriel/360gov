import type { DashboardData } from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { DocListColumn } from './DocListColumn';
import { StatCard } from './StatCard';

type DepartmentHeadData = Extract<DashboardData, { role: 'department-head' }>;

export function DepartmentHeadDashboard({
  data,
}: {
  data: DepartmentHeadData;
}) {
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
      <div className={styles.columnsGrid}>
        {data.columns.map((column) => (
          <DocListColumn key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
}
