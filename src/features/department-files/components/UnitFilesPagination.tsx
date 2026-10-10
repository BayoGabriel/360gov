import styles from './department-files.module.css';

interface UnitFilesPaginationProps {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}

export function UnitFilesPagination({
  page,
  totalPages,
  onPage,
}: UnitFilesPaginationProps) {
  return (
    <div className={styles.pagination}>
      <span className={styles.pageInfo}>
        Page {page} of {totalPages}
      </span>
      <div className={styles.pageButtons}>
        <button
          type="button"
          className={styles.pillButton}
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className={styles.pillButton}
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
