import { useState } from 'react';
import { List } from 'lucide-react';
import { Link } from 'react-router';
import type { DashboardData } from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { DocList } from './DocList';
import { PanelCard } from './PanelCard';
import { StatCard } from './StatCard';

type DepartmentHeadData = Extract<DashboardData, { role: 'department-head' }>;

export function DepartmentHeadDashboard({
  data,
}: {
  data: DepartmentHeadData;
}) {
  const [activeId, setActiveId] = useState(data.columns[0]?.id ?? '');
  const active =
    data.columns.find((column) => column.id === activeId) ??
    data.columns[0];

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
      {active ? (
        <PanelCard
          title={
            <div
              className={styles.segmented}
              role="group"
              aria-label="Document types"
            >
              {data.columns.map((column) => (
                <button
                  key={column.id}
                  type="button"
                  aria-pressed={column.id === active.id}
                  className={`${styles.segment} ${column.id === active.id ? styles.segmentActive : ''}`}
                  title={column.title}
                  onClick={() => setActiveId(column.id)}
                >
                  {column.shortTitle}
                </button>
              ))}
            </div>
          }
          headerAction={
            <Link to={active.viewAllHref} className={styles.viewAll}>
              <List size={14} aria-hidden="true" />
              View All
            </Link>
          }
        >
          <DocList items={active.items} />
        </PanelCard>
      ) : null}
    </div>
  );
}
