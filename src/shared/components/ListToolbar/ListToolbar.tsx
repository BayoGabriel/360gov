import { Calendar, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatListTimestamp } from '../../lib/format-date';
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

function rangeLabel(from?: string, to?: string): string {
  if (!from && !to) return 'All dates';
  const fmt = (iso: string) =>
    formatListTimestamp(`${iso}T00:00:00`).split(' - ')[0];
  return `${from ? fmt(from) : '…'} – ${to ? fmt(to) : '…'}`;
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
  const [rangeOpen, setRangeOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rangeOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setRangeOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [rangeOpen]);

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
        <div className={styles.datePickerWrap} ref={wrapRef}>
          <button
            type="button"
            className={styles.pillButton}
            aria-expanded={rangeOpen}
            onClick={() => setRangeOpen((v) => !v)}
          >
            <Calendar size={16} aria-hidden="true" />
            {rangeLabel(from, to)}
          </button>
          {rangeOpen && (
            <div className={styles.datePopover}>
              <label className={styles.dateField}>
                From
                <input
                  type="date"
                  value={from ?? ''}
                  onChange={(e) =>
                    onRangeChange(e.target.value || undefined, to)
                  }
                />
              </label>
              <label className={styles.dateField}>
                To
                <input
                  type="date"
                  value={to ?? ''}
                  onChange={(e) =>
                    onRangeChange(from, e.target.value || undefined)
                  }
                />
              </label>
            </div>
          )}
        </div>
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
