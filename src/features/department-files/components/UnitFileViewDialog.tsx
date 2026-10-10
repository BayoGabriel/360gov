import { AiAssist } from '../../../shared/components/AiAssist';
import { Modal } from '../../../shared/components/Modal';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import type { UnitFileRecord } from '../types/department-files.types';
import styles from './department-files.module.css';
import { UnitFileStatusBadge } from './UnitFileStatusBadge';

interface UnitFileViewDialogProps {
  file: UnitFileRecord;
  onClose: () => void;
}

export function UnitFileViewDialog({
  file,
  onClose,
}: UnitFileViewDialogProps) {
  const rows: Array<[string, string]> = [
    ['File No.', file.fileNo],
    ['Subject', file.subject],
    ['Document type', file.documentType],
    ['Initiated by', file.initiatedBy.name],
    ['Current holder', file.currentHolder.name],
    ['Last updated', formatListTimestamp(file.lastUpdated)],
  ];

  return (
    <Modal open onClose={onClose} title="File Details">
      <div className={styles.dialogBody}>
        <dl className={styles.detailList}>
          {rows.map(([label, value]) => (
            <div key={label} className={styles.detailRow}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          <div className={styles.detailRow}>
            <dt>Status</dt>
            <dd>
              <UnitFileStatusBadge status={file.status} />
            </dd>
          </div>
        </dl>
        <AiAssist
          task="summarize"
          purpose="unit-file-summary"
          subject={`${file.fileNo} — ${file.subject}`}
          context={`Document type: ${file.documentType}. Initiated by ${file.initiatedBy.name}. Current holder: ${file.currentHolder.name}. Status: ${file.status}.`}
          variant="link"
        />
      </div>
    </Modal>
  );
}
