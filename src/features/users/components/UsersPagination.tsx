import styles from './users.module.css';

interface UsersPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function UsersPagination({
  page,
  totalPages,
  onPageChange,
}: UsersPaginationProps) {
  return (
    <div className={styles.pagination}>
      <p className={styles.pageInfo}>
        Page {page} of {totalPages}
      </p>
      <div className={styles.pageButtons}>
        <button
          type="button"
          className={styles.pillButton}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className={styles.pillButton}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
