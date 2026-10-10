import type { FileRecord } from '../../types/documents.types';
import styles from '../../documents.module.css';

interface PdfPageCanvasProps {
  file: FileRecord;
  page: number;
  scale: number;
}

/**
 * Fixture rendering of a document page — real PDFs will need a renderer
 * (e.g. pdf.js) once the backend serves file bytes.
 */
export function PdfPageCanvas({ file, page, scale }: PdfPageCanvasProps) {
  return (
    <div className={styles.pdfPageWrap}>
      <article
        className={styles.pdfPage}
        style={{ transform: `scale(${scale})` }}
        aria-label={`Page ${page} of ${file.fileName}`}
      >
        <h3 className={styles.pdfTitle}>{file.subject}</h3>
        <p className={styles.pdfSubtitle}>For {file.department} Department:</p>
        <p className={styles.pdfText}>{file.description}</p>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className={styles.pdfBlock}>
            <span className={styles.pdfBlockTitle} />
            <span className={styles.pdfLine} />
            <span className={styles.pdfLine} />
            <span className={styles.pdfLineShort} />
          </div>
        ))}
      </article>
    </div>
  );
}
