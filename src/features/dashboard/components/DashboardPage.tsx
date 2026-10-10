import { useAuth } from '../../../app/providers/auth-context';
import { DEFAULT_ROLE } from '../../../shared/auth/roles';
import { useDashboardData } from '../queries/dashboard.queries';
import styles from '../dashboard.module.css';
import { DepartmentHeadDashboard } from './DepartmentHeadDashboard';
import { PermanentSecretaryDashboard } from './PermanentSecretaryDashboard';
import { StaffDashboard } from './StaffDashboard';

export function DashboardPage() {
  const { session } = useAuth();
  const role =
    session.status === 'authenticated'
      ? (session.user.role ?? DEFAULT_ROLE)
      : DEFAULT_ROLE;
  const { data, isPending, isError, refetch } = useDashboardData(role);

  if (session.status !== 'authenticated') return null;

  if (isPending) {
    return (
      <p className={styles.status} role="status">
        Loading dashboard…
      </p>
    );
  }

  if (isError || !data) {
    return (
      <div className={styles.status} role="alert">
        <p>The dashboard could not be loaded.</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </div>
    );
  }

  switch (data.role) {
    case 'permanent-secretary':
      return <PermanentSecretaryDashboard data={data} />;
    case 'department-head':
      return <DepartmentHeadDashboard data={data} />;
    default:
      return <StaffDashboard />;
  }
}
