import { useSearchParams } from 'react-router';
import {
  useReportDepartments,
  useTurnaroundReport,
} from '../queries/reporting.queries';
import styles from '../reporting.module.css';
import { ApproveAllButton } from './ApproveAllButton';
import { FilesProcessedPanel } from './FilesProcessedPanel';

export function TurnaroundPage() {
  const [params, setParams] = useSearchParams();
  const departments = useReportDepartments();
  const selected =
    params.get('dept') ?? departments.data?.[0]?.id ?? '';
  const report = useTurnaroundReport(selected);

  const selectDepartment = (departmentId: string) => {
    setParams({ dept: departmentId }, { replace: true });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Document Turn-around Time</h1>
        <div className={styles.pageActions}>
          <ApproveAllButton />
        </div>
      </div>
      {departments.isError ? (
        <div className={styles.status} role="alert">
          <p>Departments could not be loaded.</p>
          <button type="button" onClick={() => void departments.refetch()}>
            Retry
          </button>
        </div>
      ) : (
        <FilesProcessedPanel
          departments={departments.data ?? []}
          selected={selected}
          report={report.data}
          loading={departments.isPending || report.isPending}
          onSelect={selectDepartment}
        />
      )}
    </div>
  );
}
