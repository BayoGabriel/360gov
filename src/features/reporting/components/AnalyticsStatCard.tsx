import type { LucideIcon } from 'lucide-react';
import { ArrowRight, BarChart3, Timer, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import type { ReportStat, ReportStatIcon } from '../types/reporting.types';
import styles from '../reporting.module.css';

const STAT_ICONS: Record<ReportStatIcon, LucideIcon> = {
  turnaround: Timer,
  activity: BarChart3,
  productivity: TrendingUp,
};

export function AnalyticsStatCard({ stat }: { stat: ReportStat }) {
  const Icon = STAT_ICONS[stat.icon];
  return (
    <Link to={stat.href} className={styles.statCard}>
      <span className={styles.statIcon}>
        <Icon size={22} aria-hidden="true" />
      </span>
      <span>
        <span className={styles.statValue}>{stat.value}</span>
        <span className={styles.statLabel}>{stat.label}</span>
      </span>
      <ArrowRight size={18} className={styles.statArrow} aria-hidden="true" />
    </Link>
  );
}
