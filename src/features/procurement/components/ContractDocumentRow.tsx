import type { ReactNode } from 'react';
import { FileText } from 'lucide-react';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import { formatFileSize } from '../../../shared/lib/format-file-size';
import type { ContractDocument } from '../types/procurement.types';
import { documentKindLabel } from '../utils/procurement-formatters';
import { SignatureParties } from './SignatureParties';
import styles from './procurement.module.css';

interface ContractDocumentRowProps {
  document: ContractDocument;
  actions?: ReactNode;
}

export function ContractDocumentRow({
  document,
  actions,
}: ContractDocumentRowProps) {
  return (
    <li className={styles.docRow}>
      <span className={styles.docIcon} aria-hidden="true">
        <FileText size={18} />
      </span>
      <span className={styles.docMeta}>
        <span className={styles.docTitle}>{document.title}</span>
        <span className={styles.docSub}>
          {documentKindLabel(document.kind)} · {document.fileName} ·{' '}
          {formatFileSize(document.fileSizeBytes)} · Uploaded{' '}
          {formatListTimestamp(document.uploadedAt)} by{' '}
          {document.uploadedBy.name}
        </span>
        {document.signature ? (
          <SignatureParties signature={document.signature} />
        ) : null}
      </span>
      {actions ? <span className={styles.docActions}>{actions}</span> : null}
    </li>
  );
}
