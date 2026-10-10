import { useState } from 'react';
import { AlignJustify, Eye } from 'lucide-react';
import styles from './department-files.module.css';

interface UnitFileActionsMenuProps {
  fileNo: string;
  onView: () => void;
}

export function UnitFileActionsMenu({
  fileNo,
  onView,
}: UnitFileActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div
      className={styles.menuWrap}
      onKeyDown={(event) => {
        if (event.key === 'Escape') close();
      }}
    >
      <button
        type="button"
        className={styles.menuTrigger}
        aria-label={`Actions for file ${fileNo}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <AlignJustify size={16} aria-hidden="true" />
      </button>
      {open ? (
        <>
          <button
            type="button"
            className={styles.menuBackdrop}
            aria-label="Close menu"
            tabIndex={-1}
            onClick={close}
          />
          <ul className={styles.menu} role="menu">
            <li role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.menuItem}
                onClick={() => {
                  close();
                  onView();
                }}
              >
                <Eye size={16} aria-hidden="true" />
                View File
              </button>
            </li>
          </ul>
        </>
      ) : null}
    </div>
  );
}
