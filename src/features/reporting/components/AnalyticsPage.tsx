import { Eye } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '../../../shared/constants/routes';
import { useReportingOverview } from '../queries/reporting.queries';
import styles from '../reporting.module.css';
import { ActiveNowPanel } from './ActiveNowPanel';
import { ActivitiesLogPanel } from './ActivitiesLogPanel';
import { AnalyticsStatCard } from './AnalyticsStatCard';
import { ApproveAllButton } from './ApproveAllButton';
import { OfficerProductivityPanel } from './OfficerProductivityPanel';

export function AnalyticsPage() {
  const { data, isPending, isError, refetch } = useReportingOverview();

  if (isPending) {
    return (
      <p className={styles.status} role="status">
        Loading reports…
      </p>
    );
  }

  if (isError || !data) {
    return (
      <div className={styles.status} role="alert">
        <p>The reports could not be loaded.</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <div className={styles.pageActions}>
          <Link to={ROUTES.departmentFiles} className={styles.outlineButton}>
            <Eye size={16} aria-hidden="true" />
            View Departmental Reports
          </Link>
          <ApproveAllButton />
        </div>
      </div>
      <div className={styles.statsGrid}>
        {data.stats.map((stat) => (
          <AnalyticsStatCard key={stat.id} stat={stat} />
        ))}
      </div>
      <div className={styles.panelsGrid}>
        <ActiveNowPanel report={data.activeNow} />
        <OfficerProductivityPanel report={data.officerProductivity} />
        <ActivitiesLogPanel report={data.activitiesLog} />
      </div>
    </div>
  );
}
