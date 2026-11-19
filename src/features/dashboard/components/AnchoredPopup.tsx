import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import styles from '../dashboard.module.css';

export interface PopupAnchor {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

interface AnchoredPopupProps {
  /** Bounding rect of the trigger element. */
  anchor: PopupAnchor;
  /** Ref to exclude the trigger from outside-click dismissal. */
  triggerRef?: RefObject<HTMLElement | null>;
  label: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Fixed-position popup panel rendered beside a trigger rect and clamped to
 * the viewport. Closes on outside pointerdown, Escape, scroll, and resize.
 */
export function AnchoredPopup({
  anchor,
  triggerRef,
  label,
  onClose,
  children,
}: AnchoredPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    const popup = popupRef.current;
    if (!popup) return;
    const { width, height } = popup.getBoundingClientRect();
    let left = anchor.right - width;
    if (left < 8) left = Math.max(8, anchor.left);
    let top = anchor.bottom + 6;
    if (top + height > window.innerHeight - 8) {
      top = Math.max(8, anchor.top - height - 6);
    }
    setPos({ top, left });
  }, [anchor]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !popupRef.current?.contains(target) &&
        !triggerRef?.current?.contains(target)
      ) {
        onClose();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.document.addEventListener('pointerdown', onPointerDown, true);
    window.document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onClose);
    window.addEventListener('scroll', onClose, true);
    return () => {
      window.document.removeEventListener('pointerdown', onPointerDown, true);
      window.document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onClose);
      window.removeEventListener('scroll', onClose, true);
    };
  }, [onClose, triggerRef]);

  return (
    <div
      ref={popupRef}
      className={styles.popup}
      role="dialog"
      aria-label={label}
      style={{
        top: pos?.top ?? anchor.bottom,
        left: pos?.left ?? anchor.left,
        visibility: pos ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>
  );
}
