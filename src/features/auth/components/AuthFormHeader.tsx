import type { ReactNode } from 'react';
import styles from './auth.module.css';

interface AuthFormHeaderProps {
  title: ReactNode;
  description: string;
}

export function AuthFormHeader({ title, description }: AuthFormHeaderProps) {
  return (
    <div>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
