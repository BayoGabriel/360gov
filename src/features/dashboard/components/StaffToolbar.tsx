import { Search } from 'lucide-react';
import { DateRangePicker } from '../../../shared/components/DateRangePicker';
import type { DashboardPeriod, DocStatus } from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { PeriodTabs } from './PeriodTabs';
import { StatusFilter } from './StatusFilter';

interface StaffToolbarProps {
  period: DashboardPeriod;
  searchInput: string;
  status: DocStatus | undefined;
  from: string | undefined;
  to: string | undefined;
  onPeriodChange: (period: DashboardPeriod) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: DocStatus | undefined) => void;
  onRangeChange: (from?: string, to?: string) => void;
}

export function StaffToolbar({
  period,
  searchInput,
  status,
  from,
  to,
  onPeriodChange,
  onSearchChange,
  onStatusChange,
  onRangeChange,
}: StaffToolbarProps) {
  return (
    <div className={styles.staffToolbar}>
      <PeriodTabs period={period} onChange={onPeriodChange} />
      <div className={styles.staffToolbarEnd}>
        <DateRangePicker from={from} to={to} onRangeChange={onRangeChange} />
        <StatusFilter value={status} onChange={onStatusChange} />
        <div className={styles.staffSearch}>
          <Search size={16} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            className={styles.staffSearchInput}
            placeholder="Search"
            aria-label="Search files"
            value={searchInput}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
