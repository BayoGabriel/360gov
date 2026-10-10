import { Search, SlidersHorizontal } from 'lucide-react';
import { DateRangePicker } from '../../../shared/components/DateRangePicker';
import styles from './department-files.module.css';

interface DepartmentFilesToolbarProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  dateFrom?: string;
  dateTo?: string;
  onDateRange: (from?: string, to?: string) => void;
  onOpenFilters: () => void;
}

export function DepartmentFilesToolbar({
  searchInput,
  onSearchChange,
  dateFrom,
  dateTo,
  onDateRange,
  onOpenFilters,
}: DepartmentFilesToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <label className={styles.searchBox}>
        <Search size={16} className={styles.searchIcon} aria-hidden="true" />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search for documents"
          aria-label="Search for documents"
          value={searchInput}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
      <div className={styles.toolbarRight}>
        <DateRangePicker
          from={dateFrom}
          to={dateTo}
          onRangeChange={onDateRange}
        />
        <button
          type="button"
          className={styles.pillButton}
          onClick={onOpenFilters}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filters
        </button>
      </div>
    </div>
  );
}
