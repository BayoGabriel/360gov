import type { DashboardPeriod } from '../types/dashboard.types';
import styles from '../dashboard.module.css';

const PERIODS: { id: DashboardPeriod; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

interface PeriodTabsProps {
  period: DashboardPeriod;
  onChange: (period: DashboardPeriod) => void;
}

export function PeriodTabs({ period, onChange }: PeriodTabsProps) {
  return (
    <div className={styles.segmented} role="group" aria-label="Report period">
      {PERIODS.map((p) => (
        <button
          key={p.id}
          type="button"
          aria-pressed={period === p.id}
          className={`${styles.segment} ${period === p.id ? styles.segmentActive : ''}`}
          onClick={() => onChange(p.id)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
