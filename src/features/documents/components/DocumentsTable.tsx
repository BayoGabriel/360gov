import { MoreVertical } from 'lucide-react';
import type {
  DocumentView,
  FileRecord,
  MenuAnchor,
} from '../types/documents.types';
import styles from '../documents.module.css';
import type { ColumnKey } from './DocumentCell';
import { DocumentCell } from './DocumentCell';

const HEADERS: Record<ColumnKey, string> = {
  file: 'FileNo./Subject',
  initiatedBy: 'Initiated by',
  attachments: 'Attachments',
  holder: 'Current Holder',
  description: 'Description',
  reviewers: 'Reviewers',
  completion: 'Completion',
  assignees: 'Assignees',
  module: 'Module',
  priority: 'Priority',
  status: 'Status',
  updated: 'Last Updated',
};

const VIEW_COLUMNS: Record<DocumentView, ColumnKey[]> = {
  pending: [
    'file',
    'initiatedBy',
    'holder',
    'priority',
    'assignees',
    'module',
    'status',
    'updated',
  ],
  'in-review': [
    'file',
    'attachments',
    'description',
    'reviewers',
    'completion',
    'assignees',
    'module',
    'status',
    'updated',
  ],
  processed: [
    'file',
    'initiatedBy',
    'attachments',
    'holder',
    'description',
    'status',
    'updated',
  ],
};

interface DocumentsTableProps {
  view: DocumentView;
  rows: FileRecord[];
  selected: ReadonlySet<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: (rows: FileRecord[]) => void;
  onOpenOptions: (row: FileRecord, anchor: MenuAnchor) => void;
  onOpenDocument: (row: FileRecord) => void;
}

export function DocumentsTable({
  view,
  rows,
  selected,
  onToggleRow,
  onToggleAll,
  onOpenOptions,
  onOpenDocument,
}: DocumentsTableProps) {
  const columns = VIEW_COLUMNS[view];
  const allSelected = rows.length > 0 && selected.size === rows.length;

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={allSelected}
                onChange={() => onToggleAll(rows)}
                aria-label="Select all files on this page"
              />
            </th>
            {columns.map((column) => (
              <th key={column} scope="col">
                {HEADERS[column]}
              </th>
            ))}
            <th scope="col">
              <span className={styles.srOnly}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={styles.rowClickable}
              onClick={() => onOpenDocument(row)}
            >
              <td onClick={(event) => event.stopPropagation()}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selected.has(row.id)}
                  onChange={() => onToggleRow(row.id)}
                  aria-label={`Select file ${row.fileNo}`}
                />
              </td>
              {columns.map((column) => (
                <td key={column}>
                  <DocumentCell column={column} row={row} />
                </td>
              ))}
              <td onClick={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  className={styles.menuButton}
                  aria-label={`Options for ${row.fileNo}`}
                  aria-haspopup="menu"
                  onClick={(event) =>
                    onOpenOptions(
                      row,
                      event.currentTarget.getBoundingClientRect(),
                    )
                  }
                >
                  <MoreVertical size={18} aria-hidden="true" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
