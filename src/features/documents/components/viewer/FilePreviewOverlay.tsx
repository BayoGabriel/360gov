import { Modal } from '../../../../shared/components/Modal';
import type { FileRecord } from '../../types/documents.types';
import styles from '../../documents.module.css';
import { PdfViewer } from './PdfViewer';

interface FilePreviewOverlayProps {
  file: FileRecord;
  onClose: () => void;
}

/** Full-screen PDF preview, stacked above the file details dialog. */
export function FilePreviewOverlay({ file, onClose }: FilePreviewOverlayProps) {
  return (
    <Modal
      open
      onClose={onClose}
      title={`Preview ${file.fileName}`}
      className={styles.previewDialog}
      hideHeader
    >
      <PdfViewer file={file} onClose={onClose} />
    </Modal>
  );
}
