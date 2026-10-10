import { Calendar } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import styles from './department-files.module.css';

interface DateRangePickerProps {
  from?: string;
  to?: string;
  onRangeChange: (from?: string, to?: string) => void;
}

function label(from?: string, to?: string): string {
  if (!from && !to) return 'All dates';
  const fmt = (iso: string) =>
    formatListTimestamp(`${iso}T00:00:00`).split(' - ')[0];
  return `${from ? fmt(from) : '…'} – ${to ? fmt(to) : '…'}`;
}

export function DateRangePicker({
  from,
  to,
  onRangeChange,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  return (
    <div className={styles.datePickerWrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.pillButton}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Calendar size={16} aria-hidden="true" />
        {label(from, to)}
      </button>
      {open ? (
        <div className={styles.datePopover}>
          <label className={styles.dateField}>
            From
            <input
              type="date"
              value={from ?? ''}
              onChange={(event) =>
                onRangeChange(event.target.value || undefined, to)
              }
            />
          </label>
          <label className={styles.dateField}>
            To
            <input
              type="date"
              value={to ?? ''}
              onChange={(event) =>
                onRangeChange(from, event.target.value || undefined)
              }
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
