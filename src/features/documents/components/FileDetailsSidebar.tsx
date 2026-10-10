import { Download, Search } from 'lucide-react';
import { formatUploadedAt } from '../../../shared/lib/format-date';
import { formatFileSize } from '../../../shared/lib/format-file-size';
import type { FileRecord } from '../types/documents.types';
import styles from './documents.module.css';

function downloadSummary(file: FileRecord) {
  const blob = new Blob(
    [`${file.fileNo} — ${file.subject}\n\n${file.description}`],
    { type: 'text/plain' },
  );
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement('a');
  anchor.href = url;
  anchor.download = file.fileName.replace(/\.[^.]+$/, '.txt');
  anchor.click();
  URL.revokeObjectURL(url);
}

interface FileDetailsSidebarProps {
  document: FileRecord;
  onPreview: () => void;
  onExpand: () => void;
}

export function FileDetailsSidebar({
  document,
  onPreview,
  onExpand,
}: FileDetailsSidebarProps) {
  const rows: [string, string][] = [
    ['Version', '1'],
    ['File Size', formatFileSize(document.fileSizeBytes)],
    ['Uploaded by', document.initiatedBy.name],
    ['Date Uploaded', formatUploadedAt(document.uploadedAt)],
    ['Category', document.documentType || 'None'],
  ];

  return (
    <aside className={styles.fileDetailsSide}>
      <h2 className={styles.fileDetailsTitle}>File Details</h2>
      <dl className={styles.metaList}>
        {rows.map(([label, value]) => (
          <div key={label} className={styles.metaRow}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.sideButtons}>
        <button
          type="button"
          className={styles.outlineButton}
          onClick={onPreview}
        >
          <Search size={14} aria-hidden="true" /> Preview
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Download file summary"
          onClick={() => downloadSummary(document)}
        >
          <Download size={16} aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={onExpand}
      >
        Expand Details
      </button>
    </aside>
  );
}
