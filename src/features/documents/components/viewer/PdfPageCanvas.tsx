import type { PointerEvent, ReactNode, Ref } from 'react';
import type { FileRecord } from '../../types/documents.types';
import styles from '../../documents.module.css';
import { SignatureStamp } from './SignatureStamp';

interface PdfPageCanvasProps {
  file: FileRecord;
  page: number;
  scale: number;
  /** Ref to the page element, for coordinate math (e.g. signing). */
  pageRef?: Ref<HTMLElement>;
  /** Pointer handlers forwarded to the page element. */
  onPointerDown?: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove?: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp?: (event: PointerEvent<HTMLElement>) => void;
  onPointerCancel?: (event: PointerEvent<HTMLElement>) => void;
  /** Overlay rendered inside the page (e.g. a pending signature stamp). */
  children?: ReactNode;
}

/**
 * Fixture rendering of a document page — real PDFs will need a renderer
 * (e.g. pdf.js) once the backend serves file bytes. Signature stamps are
 * laid over the page content at their normalized coordinates.
 */
export function PdfPageCanvas({
  file,
  page,
  scale,
  pageRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  children,
}: PdfPageCanvasProps) {
  const pageSignatures = (file.signatures ?? []).filter(
    (placement) => placement.page === page,
  );

  return (
    <div className={styles.pdfPageWrap}>
      <article
        ref={pageRef}
        className={styles.pdfPage}
        style={{ transform: `scale(${scale})` }}
        aria-label={`Page ${page} of ${file.fileName}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
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
        {pageSignatures.map((placement) => (
          <SignatureStamp key={placement.id} placement={placement} />
        ))}
        {children}
      </article>
    </div>
  );
}
