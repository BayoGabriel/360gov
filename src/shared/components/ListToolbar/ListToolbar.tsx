import { Search, SlidersHorizontal } from 'lucide-react';
import { DateRangePicker } from '../DateRangePicker';
import styles from './ListToolbar.module.css';

interface ListToolbarProps {
  query: string;
  from: string | undefined;
  to: string | undefined;
  searchPlaceholder?: string;
  onQueryChange: (query: string) => void;
  onRangeChange: (from: string | undefined, to: string | undefined) => void;
  /** When provided, renders a Filters button that calls this handler. */
  onFiltersClick?: () => void;
}

export function ListToolbar({
  query,
  from,
  to,
  searchPlaceholder = 'Search for documents',
  onQueryChange,
  onRangeChange,
  onFiltersClick,
}: ListToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.search}>
        <Search size={18} className={styles.searchIcon} aria-hidden="true" />
        <input
          type="search"
          className={styles.searchInput}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <div className={styles.toolbarEnd}>
        <DateRangePicker from={from} to={to} onRangeChange={onRangeChange} />
        {onFiltersClick ? (
          <button
            type="button"
            className={styles.pillButton}
            onClick={onFiltersClick}
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
            Filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
