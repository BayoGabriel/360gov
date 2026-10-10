import { CalendarDays, Search, SlidersHorizontal } from 'lucide-react';
import { TASK_PERIODS } from '../hooks/useTasksPage';
import type { TaskPeriod } from '../types/tasks.types';
import styles from './tasks.module.css';

interface TasksToolbarProps {
  period: TaskPeriod;
  onPeriod: (period: TaskPeriod) => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
  dateFrom?: string;
  dateTo?: string;
  onDateRange: (from?: string, to?: string) => void;
  onOpenFilters: () => void;
}

export function TasksToolbar({
  period,
  onPeriod,
  searchInput,
  onSearchChange,
  dateFrom,
  dateTo,
  onDateRange,
  onOpenFilters,
}: TasksToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.periodTabs} role="tablist" aria-label="Task period">
        {TASK_PERIODS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={period === id}
            className={`${styles.periodTab} ${period === id ? styles.periodTabActive : ''}`}
            onClick={() => onPeriod(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.toolbarRight}>
        <label className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search"
            aria-label="Search tasks"
            value={searchInput}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
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
            value={dateFrom ?? ''}
            onChange={(event) =>
              onDateRange(event.target.value || undefined, dateTo)
            }
          />
          <span aria-hidden="true">–</span>
          <input
            type="date"
            className={styles.dateInput}
            aria-label="To date"
            value={dateTo ?? ''}
            onChange={(event) =>
              onDateRange(dateFrom, event.target.value || undefined)
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
