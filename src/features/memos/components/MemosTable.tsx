import { ArrowDown, ArrowUp, StickyNote } from 'lucide-react';
import type { MemoSort, MemoSummary } from '../types/memos.types';
import { MemoRow } from './MemoRow';
import styles from './memos.module.css';

interface MemosTableProps {
  rows: MemoSummary[];
  selected: ReadonlySet<string>;
  sort: MemoSort;
  openMemoId: string | null;
  onToggleRow: (id: string) => void;
  onToggleAll: (rows: MemoSummary[]) => void;
  onToggleSort: () => void;
  onOpen: (id: string) => void;
}

export function MemosTable({
  rows,
  selected,
  sort,
  openMemoId,
  onToggleRow,
  onToggleAll,
  onToggleSort,
  onOpen,
}: MemosTableProps) {
  const allSelected = rows.length > 0 && selected.size === rows.length;
  const SortIcon = sort === 'date-desc' ? ArrowDown : ArrowUp;

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" className={styles.checkCol}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={allSelected}
                onChange={() => onToggleAll(rows)}
                aria-label="Select all memos on this page"
              />
            </th>
            <th scope="col">
              <span className={styles.fileHeader}>
                <StickyNote
                  size={16}
                  className={styles.fileHeaderIcon}
                  aria-hidden="true"
                />
                FileNo./Subject
              </span>
            </th>
            <th scope="col">Sender</th>
            <th scope="col">Status</th>
            <th scope="col" aria-sort={sort === 'date-desc' ? 'descending' : 'ascending'}>
              <button
                type="button"
                className={styles.sortButton}
                onClick={onToggleSort}
              >
                Date
                <SortIcon size={14} aria-hidden="true" />
              </button>
            </th>
            <th scope="col">
              <span className={styles.visuallyHidden}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((memo) => (
            <MemoRow
              key={memo.id}
              memo={memo}
              checked={selected.has(memo.id)}
              open={openMemoId === memo.id}
              onToggle={onToggleRow}
              onOpen={onOpen}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
