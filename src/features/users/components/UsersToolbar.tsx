import { CalendarDays, Search, SlidersHorizontal } from 'lucide-react';
import styles from './users.module.css';

interface UsersToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  from?: string;
  to?: string;
  onRangeChange: (from?: string, to?: string) => void;
  onOpenFilters: () => void;
}

export function UsersToolbar({
  query,
  onQueryChange,
  from,
  to,
  onRangeChange,
  onOpenFilters,
}: UsersToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <label className={styles.searchBox}>
        <Search size={16} className={styles.searchIcon} aria-hidden="true" />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search"
          aria-label="Search users"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      <div className={styles.toolbarRight}>
        <div className={styles.dateRange}>
          <CalendarDays
            size={16}
            className={styles.dateIcon}
            aria-hidden="true"
          />
          <input
            type="date"
            className={styles.dateInput}
            aria-label="From date"
            value={from ?? ''}
            onChange={(event) =>
              onRangeChange(event.target.value || undefined, to)
            }
          />
          <span aria-hidden="true">–</span>
          <input
            type="date"
            className={styles.dateInput}
            aria-label="To date"
            value={to ?? ''}
            onChange={(event) =>
              onRangeChange(from, event.target.value || undefined)
            }
          />
        </div>
        <button
          type="button"
          className={styles.filterButton}
          onClick={onOpenFilters}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filters
        </button>
      </div>
    </div>
  );
}
