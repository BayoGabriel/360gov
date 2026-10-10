import { ArrowDownUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from '../documents.module.css';
import type { CommentSort } from './comment-sort';
import { COMMENT_SORT_OPTIONS } from './comment-sort';

interface CommentSortMenuProps {
  value: CommentSort;
  onChange: (sort: CommentSort) => void;
}

export function CommentSortMenu({ value, onChange }: CommentSortMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.sortMenuWrap} ref={rootRef}>
      <button
        type="button"
        className={styles.pdfIcon}
        aria-label="Sort comments"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ArrowDownUp size={16} aria-hidden="true" />
      </button>
      {open ? (
        <ul className={styles.sortMenu} role="menu" aria-label="Sort by">
          <li className={styles.sortMenuTitle} role="none">
            Sort By
          </li>
          {COMMENT_SORT_OPTIONS.map((option) => (
            <li key={option.id} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={value === option.id}
                className={`${styles.sortMenuItem} ${value === option.id ? styles.sortMenuItemActive : ''}`}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
