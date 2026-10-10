import { FileText } from 'lucide-react';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import type { UnitFileRecord } from '../types/department-files.types';
import styles from './department-files.module.css';
import { UnitFileActionsMenu } from './UnitFileActionsMenu';
import { UnitFileStatusBadge } from './UnitFileStatusBadge';

interface UnitFileRowProps {
  file: UnitFileRecord;
  checked: boolean;
  onToggle: (id: string) => void;
  onView: (file: UnitFileRecord) => void;
}

export function UnitFileRow({
  file,
  checked,
  onToggle,
  onView,
}: UnitFileRowProps) {
  return (
    <tr className={styles.row}>
      <td>
        <input
          type="checkbox"
          className={styles.checkbox}
          aria-label={`Select ${file.fileNo}`}
          checked={checked}
          onChange={() => onToggle(file.id)}
        />
      </td>
      <td>
        <span className={styles.fileCell}>
          <FileText size={16} className={styles.fileIcon} aria-hidden="true" />
          <span>
            <span className={styles.fileNumber}>{file.fileNo}</span>
            <span className={styles.fileSubject}>{file.subject}</span>
          </span>
        </span>
      </td>
      <td>
        <span className={styles.personCell}>
          <Avatar
            name={file.initiatedBy.name}
            src={file.initiatedBy.avatarUrl}
            size={32}
          />
          <span>
            <span className={styles.personName}>{file.initiatedBy.name}</span>
            <span className={styles.personEmail}>{file.initiatedBy.email}</span>
          </span>
        </span>
      </td>
      <td>
        <span className={styles.personCell}>
          <Avatar
            name={file.currentHolder.name}
            src={file.currentHolder.avatarUrl}
            size={32}
          />
          <span>
            <span className={styles.personName}>{file.currentHolder.name}</span>
            <span className={styles.personEmail}>{file.currentHolder.email}</span>
          </span>
        </span>
      </td>
      <td>
        <UnitFileStatusBadge status={file.status} />
      </td>
      <td className={styles.dateCell}>
        {formatListTimestamp(file.lastUpdated).split(' - ')[0]}
      </td>
      <td>
        <UnitFileActionsMenu fileNo={file.fileNo} onView={() => onView(file)} />
      </td>
    </tr>
  );
}
