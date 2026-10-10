import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BarChart3,
  FileCheck,
  FileSearch,
  FileStack,
  FileText,
  ListChecks,
  Notebook,
  Timer,
} from 'lucide-react';
import { Link } from 'react-router';
import type { DashboardStat, StatIconKey } from '../types/dashboard.types';
import styles from '../dashboard.module.css';

const STAT_ICONS: Record<StatIconKey, LucideIcon> = {
  approvals: FileCheck,
  review: FileSearch,
  processed: FileStack,
  performance: BarChart3,
  documents: FileText,
  tasks: ListChecks,
  turnaround: Timer,
  memos: Notebook,
};

export function StatCard({ stat }: { stat: DashboardStat }) {
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
