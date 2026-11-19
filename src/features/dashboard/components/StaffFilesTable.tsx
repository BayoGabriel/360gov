import { FileText } from 'lucide-react';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import type {
  DocumentListItem,
  OutgoingFileAction,
  OutgoingFileItem,
  StaffDirection,
} from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { CollaboratorStack } from './CollaboratorStack';
import { RowActionsMenu } from './RowActionsMenu';

interface StaffFilesTableProps {
  direction: StaffDirection;
  incoming: DocumentListItem[];
  outgoing: OutgoingFileItem[];
  pendingId: string | null;
  onAction: (fileId: string, action: OutgoingFileAction, fileName?: string) => void;
}

function FileCell({ title }: { title: string }) {
  return (
    <span className={styles.fileCell}>
      <span className={styles.docIcon}>
        <FileText size={16} aria-hidden="true" />
      </span>
      <span className={styles.docBody}>
        <span className={styles.docTitle}>{title}</span>
      </span>
    </span>
  );
}

/**
 * Single straight file list for the staff dashboard — incoming and outgoing
 * share the same columns; outgoing adds destination and a hamburger menu
 * holding its dispatch actions.
 */
export function StaffFilesTable({
  direction,
  incoming,
  outgoing,
  pendingId,
  onAction,
}: StaffFilesTableProps) {
  const isOutgoing = direction === 'outgoing';
  const emptyMessage = isOutgoing
    ? 'No outgoing files match the filters.'
    : 'No incoming documents match the filters.';
  const isEmpty = isOutgoing ? outgoing.length === 0 : incoming.length === 0;

  if (isEmpty) {
    return <p className={styles.status}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th scope="col">File No.</th>
            <th scope="col">Document</th>
            <th scope="col">Type</th>
            <th scope="col">Date Uploaded</th>
            {isOutgoing ? <th scope="col">Destination</th> : null}
            <th scope="col">Treated by</th>
            {isOutgoing ? (
              <th scope="col">
                <span className={styles.visuallyHidden}>Actions</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {isOutgoing
            ? outgoing.map((file) => (
                <tr key={file.id}>
                  <td className={styles.fileNoCell}>{file.reference}</td>
                  <td>
                    <FileCell title={file.title} />
                  </td>
                  <td>
                    <span className={styles.typeBadge}>
                      {file.documentType}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {formatListTimestamp(file.date)}
                  </td>
                  <td className={styles.destCell}>{file.destination}</td>
                  <td>
                    {file.collaborators.length > 0 ? (
                      <CollaboratorStack collaborators={file.collaborators} />
                    ) : (
                      <span className={styles.docMeta}>—</span>
                    )}
                  </td>
                  <td>
                    <RowActionsMenu
                      file={file}
                      disabled={pendingId === file.id}
                      onAction={(action, fileName) =>
                        onAction(file.id, action, fileName)
                      }
                    />
                  </td>
                </tr>
              ))
            : incoming.map((item) => (
                <tr key={item.id}>
                  <td className={styles.fileNoCell}>{item.reference}</td>
                  <td>
                    <FileCell title={item.title} />
                  </td>
                  <td>
                    <span className={styles.typeBadge}>
                      {item.documentType}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {formatListTimestamp(item.date)}
                  </td>
                  <td>
                    {item.treatedBy.length > 0 ? (
                      <CollaboratorStack collaborators={item.treatedBy} />
                    ) : (
                      <span className={styles.docMeta}>—</span>
                    )}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
