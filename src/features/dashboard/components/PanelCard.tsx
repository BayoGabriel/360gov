import type { ReactNode } from 'react';
import styles from '../dashboard.module.css';

interface PanelCardProps {
  title: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function PanelCard({ title, headerAction, children }: PanelCardProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        {typeof title === 'string' ? (
          <h2 className={styles.panelTitle}>{title}</h2>
        ) : (
          title
        )}
        {headerAction}
      </div>
      {children}
    </section>
  );
}
