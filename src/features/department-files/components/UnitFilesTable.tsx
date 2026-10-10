import type { UnitFileRecord } from '../types/department-files.types';
import styles from './department-files.module.css';
import { UnitFileRow } from './UnitFileRow';

interface UnitFilesTableProps {
  files: UnitFileRecord[];
  selected: ReadonlySet<string>;
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
  onView: (file: UnitFileRecord) => void;
}

export function UnitFilesTable({
  files,
  selected,
  onToggle,
  onToggleAll,
  onView,
}: UnitFilesTableProps) {
  const ids = files.map((file) => file.id);
  const allChecked = ids.length > 0 && ids.every((id) => selected.has(id));

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkCol}>
              <input
                type="checkbox"
                className={styles.checkbox}
                aria-label="Select all files on this page"
                checked={allChecked}
                onChange={() => onToggleAll(ids)}
              />
            </th>
            <th>FileNo./Subject</th>
            <th>Initiated by</th>
            <th>Current Holder</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>
              <span className={styles.visuallyHidden}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.emptyCell}>
                No files match your search.
              </td>
            </tr>
          ) : (
            files.map((file) => (
              <UnitFileRow
                key={file.id}
                file={file}
                checked={selected.has(file.id)}
                onToggle={onToggle}
                onView={onView}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
