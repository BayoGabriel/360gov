import { FileText, List, PenLine } from 'lucide-react';
import { Link } from 'react-router';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import type { PendingApprovalItem } from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { PanelCard } from './PanelCard';

/**
 * Straight list of files awaiting the EVC's sign-off. Rows link to the
 * document viewer where the approval (and signature when required) happens.
 */
export function PendingApprovalsPanel({
  items,
}: {
  items: PendingApprovalItem[];
}) {
  return (
    <PanelCard
      title="Pending Approvals"
      headerAction={
        <Link to="/documents?view=pending" className={styles.viewAll}>
          <List size={14} aria-hidden="true" />
          View All
        </Link>
      }
    >
      {items.length === 0 ? (
        <p className={styles.status}>No files are waiting for approval.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th scope="col">File No.</th>
                <th scope="col">Document</th>
                <th scope="col">Type</th>
                <th scope="col">Department</th>
                <th scope="col">Uploaded</th>
                <th scope="col">
                  <span className={styles.visuallyHidden}>Open</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className={styles.fileNoCell}>{item.fileNo}</td>
                  <td>
                    <span className={styles.fileCell}>
                      <span className={styles.docIcon}>
                        <FileText size={16} aria-hidden="true" />
                      </span>
                      <span className={styles.docBody}>
                        <span className={styles.docTitle}>{item.title}</span>
                        {item.signatureRequired ? (
                          <span className={styles.sigHint}>
                            <PenLine size={11} aria-hidden="true" />
                            Signature required
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className={styles.typeBadge}>
                      {item.documentType}
                    </span>
                  </td>
                  <td className={styles.destCell}>{item.department}</td>
                  <td className={styles.dateCell}>
                    {formatListTimestamp(item.date)}
                  </td>
                  <td>
                    <Link
                      to={`/documents/${item.id}`}
                      className={styles.actionButton}
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PanelCard>
  );
}
