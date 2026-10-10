import { List } from 'lucide-react';
import { Link } from 'react-router';
import type {
  OutgoingFileAction,
  OutgoingFileItem,
} from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { OutgoingFileRow } from './OutgoingFileRow';
import { PanelCard } from './PanelCard';

interface OutgoingFilesPanelProps {
  files: OutgoingFileItem[];
  pendingId: string | null;
  onAction: (fileId: string, action: OutgoingFileAction, fileName?: string) => void;
}

export function OutgoingFilesPanel({
  files,
  pendingId,
  onAction,
}: OutgoingFilesPanelProps) {
  return (
    <PanelCard
      title="Outgoing Files"
      headerAction={
        <Link to="/documents" className={styles.viewAll}>
          <List size={14} aria-hidden="true" />
          View All
        </Link>
      }
    >
      {files.length === 0 ? (
        <p className={styles.status}>No outgoing files match the filters.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.outgoingTable}>
            <thead>
              <tr>
                <th scope="col">
                  <span className={styles.visuallyHidden}>File</span>
                </th>
                <th scope="col">Destination</th>
                <th scope="col">
                  <span className={styles.visuallyHidden}>Upload</span>
                </th>
                <th scope="col">
                  <span className={styles.visuallyHidden}>Forward</span>
                </th>
                <th scope="col">
                  <span className={styles.visuallyHidden}>Share</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <OutgoingFileRow
                  key={file.id}
                  file={file}
                  disabled={pendingId === file.id}
                  onAction={(action, fileName) =>
                    onAction(file.id, action, fileName)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PanelCard>
  );
}
