import type { StaffDirection } from '../types/dashboard.types';
import styles from '../dashboard.module.css';

const DIRECTIONS: { id: StaffDirection; label: string }[] = [
  { id: 'incoming', label: 'Incoming Files' },
  { id: 'outgoing', label: 'Outgoing Files' },
];

interface DirectionTabsProps {
  direction: StaffDirection;
  onChange: (direction: StaffDirection) => void;
}

export function DirectionTabs({ direction, onChange }: DirectionTabsProps) {
  return (
    <div className={styles.segmented} role="group" aria-label="File direction">
      {DIRECTIONS.map((d) => (
        <button
          key={d.id}
          type="button"
          aria-pressed={direction === d.id}
          className={`${styles.segment} ${direction === d.id ? styles.segmentActive : ''}`}
          onClick={() => onChange(d.id)}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}
