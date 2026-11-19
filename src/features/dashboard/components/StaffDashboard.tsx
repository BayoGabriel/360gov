import { List, ScanLine } from 'lucide-react';
import { Link } from 'react-router';
import { useStaffDashboard } from '../hooks/useStaffDashboard';
import styles from '../dashboard.module.css';
import { PanelCard } from './PanelCard';
import { ScanDocumentDialog } from './ScanDocumentDialog';
import { StaffFilesTable } from './StaffFilesTable';
import { StaffToolbar } from './StaffToolbar';

export function StaffDashboard() {
  const page = useStaffDashboard();
  const { files } = page;
  const isOutgoing = page.direction === 'outgoing';

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
        direction={page.direction}
        searchInput={page.searchInput}
        status={page.status}
        from={page.from}
        to={page.to}
        onDirectionChange={page.setDirection}
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
        <PanelCard
          title={isOutgoing ? 'Outgoing Files' : 'Incoming Documents'}
          headerAction={
            <Link to="/documents" className={styles.viewAll}>
              <List size={14} aria-hidden="true" />
              View All
            </Link>
          }
        >
          <StaffFilesTable
            direction={page.direction}
            incoming={files.data.incoming}
            outgoing={files.data.outgoing}
            pendingId={page.fileActionPendingId}
            onAction={page.runFileAction}
          />
        </PanelCard>
      )}
      {page.scanOpen && <ScanDocumentDialog onClose={page.closeScan} />}
    </div>
  );
}
