import type { ReactNode } from 'react';
import styles from '../dashboard.module.css';

interface PanelCardProps {
  title: string;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function PanelCard({ title, headerAction, children }: PanelCardProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>{title}</h2>
        {headerAction}
      </div>
      {children}
    </section>
  );
}
