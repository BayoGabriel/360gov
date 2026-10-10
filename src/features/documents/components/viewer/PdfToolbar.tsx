import {
  Printer,
  Search,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import styles from '../../documents.module.css';

interface PdfToolbarProps {
  title: string;
  fileName: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleSearch: () => void;
  onClose: () => void;
}

export function PdfToolbar({
  title,
  fileName,
  page,
  totalPages,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onToggleSearch,
  onClose,
}: PdfToolbarProps) {
  const clamp = (raw: string) => {
    const n = Number(raw);
    if (Number.isFinite(n)) onPageChange(Math.min(totalPages, Math.max(1, n)));
  };

  return (
    <header className={styles.pdfToolbar}>
      <div className={styles.pdfToolbarTitle}>
        <h2 className={styles.pdfTitleText}>{title}</h2>
        <p className={styles.pdfSubtitleText}>{fileName}</p>
      </div>
      <div className={styles.pdfPageNav}>
        <input
          className={styles.pdfPageInput}
          type="number"
          min={1}
          max={totalPages}
          value={page}
          aria-label="Current page"
          onChange={(e) => clamp(e.target.value)}
        />
        <span className={styles.pdfPageTotal}>of {totalPages}</span>
      </div>
      <div className={styles.pdfToolbarActions}>
        <button type="button" className={styles.pdfIcon} aria-label="Print" onClick={() => window.print()}>
          <Printer size={18} />
        </button>
        <button type="button" className={styles.pdfIcon} aria-label="Search pages" onClick={onToggleSearch}>
          <Search size={18} />
        </button>
        <button type="button" className={styles.pdfIcon} aria-label="Zoom in" onClick={onZoomIn}>
          <ZoomIn size={18} />
        </button>
        <button type="button" className={styles.pdfIcon} aria-label="Zoom out" onClick={onZoomOut}>
          <ZoomOut size={18} />
        </button>
        <button type="button" className={styles.pdfIcon} aria-label="Close preview" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
    </header>
  );
}
