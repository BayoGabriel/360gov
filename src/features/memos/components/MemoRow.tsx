import { AlignJustify } from 'lucide-react';
import { PersonCell } from '../../../shared/components/PersonCell';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import type { MemoSummary } from '../types/memos.types';
import { MemoStatusBadge } from './MemoStatusBadge';
import styles from './memos.module.css';

interface MemoRowProps {
  memo: MemoSummary;
  checked: boolean;
  open: boolean;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
}

export function MemoRow({ memo, checked, open, onToggle, onOpen }: MemoRowProps) {
  return (
    <tr className={open ? styles.rowActive : undefined}>
      <td>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={checked}
          onChange={() => onToggle(memo.id)}
          aria-label={`Select memo ${memo.fileNo}`}
        />
      </td>
      <td>
        <span className={styles.fileNo}>{memo.fileNo}</span>
        <span className={styles.fileSubject}>{memo.subject}</span>
      </td>
      <td>
        <PersonCell
          name={memo.sender.name}
          email={memo.sender.email}
          avatarUrl={memo.sender.avatarUrl}
        />
      </td>
      <td>
        <MemoStatusBadge status={memo.status} />
      </td>
      <td className={styles.dateCell}>
        {formatListTimestamp(memo.date).split(' - ')[0]}
      </td>
      <td>
        <button
          type="button"
          className={styles.iconButton}
          aria-label={`Open conversation for memo ${memo.fileNo}`}
          aria-pressed={open}
          onClick={() => onOpen(memo.id)}
        >
          <AlignJustify size={18} aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}
