import styles from '../../documents.module.css';

interface TocSidebarProps {
  totalPages: number;
  current: number;
  /** Optional filter text — only matching page numbers are shown. */
  filter: string;
  onSelect: (page: number) => void;
}

export function TocSidebar({
  totalPages,
  current,
  filter,
  onSelect,
}: TocSidebarProps) {
  const term = filter.trim();
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (n) => !term || String(n).includes(term),
  );

  return (
    <nav className={styles.toc} aria-label="Table of Contents">
      <h2 className={styles.tocTitle}>Table of Contents</h2>
      <ol className={styles.tocList}>
        {pages.map((n) => (
          <li key={n}>
            <button
              type="button"
              className={`${styles.tocThumb} ${n === current ? styles.tocThumbActive : ''}`}
              aria-label={`Go to page ${n}`}
              aria-current={n === current ? 'page' : undefined}
              onClick={() => onSelect(n)}
            >
              <span className={styles.tocThumbTitle} />
              <span className={styles.tocThumbLine} />
              <span className={styles.tocThumbLine} />
              <span className={styles.tocThumbLine} />
              <span className={styles.tocThumbLine} />
              <span className={styles.tocPageNo}>{n}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
