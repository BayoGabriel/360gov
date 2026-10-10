import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { ToastContext } from './toast-context';
import type { ToastContextValue } from './toast-context';
import styles from './Toast.module.css';

type ToastTone = 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, tone: ToastTone) => {
      const id = (nextId.current += 1);
      setToasts((prev) => [...prev, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message) => push(message, 'success'),
      error: (message) => push(message, 'error'),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${
              toast.tone === 'error' ? styles.toastError : styles.toastSuccess
            }`}
          >
            {toast.tone === 'error' ? (
              <AlertCircle
                size={18}
                className={`${styles.icon} ${styles.iconError}`}
                aria-hidden="true"
              />
            ) : (
              <CheckCircle
                size={18}
                className={`${styles.icon} ${styles.iconSuccess}`}
                aria-hidden="true"
              />
            )}
            <p className={styles.message}>{toast.message}</p>
            <button
              type="button"
              className={styles.dismiss}
              aria-label="Dismiss notification"
              onClick={() => dismiss(toast.id)}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
