import { List, ScanLine } from 'lucide-react';
import { Link } from 'react-router';
import { useStaffDashboard } from '../hooks/useStaffDashboard';
import styles from '../dashboard.module.css';
import { DocList } from './DocList';
import { OutgoingFilesPanel } from './OutgoingFilesPanel';
import { PanelCard } from './PanelCard';
import { ScanDocumentDialog } from './ScanDocumentDialog';
import { StaffToolbar } from './StaffToolbar';

export function StaffDashboard() {
  const page = useStaffDashboard();
  const { files } = page;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <div className={styles.pageActions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={page.openScan}
          >
            <ScanLine size={16} aria-hidden="true" />
            Scan
          </button>
        </div>
      </div>
      <StaffToolbar
        period={page.period}
        searchInput={page.searchInput}
        status={page.status}
        from={page.from}
        to={page.to}
        onPeriodChange={page.setPeriod}
        onSearchChange={page.setSearchInput}
        onStatusChange={page.setStatus}
        onRangeChange={page.setRange}
      />
      {files.isPending ? (
        <p className={styles.status} role="status">
          Loading files…
        </p>
      ) : files.isError || !files.data ? (
        <div className={styles.status} role="alert">
          <p>Your files could not be loaded.</p>
          <button type="button" onClick={() => void files.refetch()}>
            Retry
          </button>
        </div>
      ) : (
        <div className={styles.staffGrid}>
          <PanelCard
            title="Incoming Documents"
            headerAction={
              <Link to="/documents" className={styles.viewAll}>
                <List size={14} aria-hidden="true" />
                View All
              </Link>
            }
          >
            {files.data.incoming.length === 0 ? (
              <p className={styles.status}>
                No incoming documents match the filters.
              </p>
            ) : (
              <DocList items={files.data.incoming} />
            )}
          </PanelCard>
          <OutgoingFilesPanel
            files={files.data.outgoing}
            pendingId={page.fileActionPendingId}
            onAction={page.runFileAction}
          />
        </div>
      )}
      {page.scanOpen && <ScanDocumentDialog onClose={page.closeScan} />}
    </div>
  );
}
