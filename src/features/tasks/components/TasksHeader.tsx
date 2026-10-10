import { Plus } from 'lucide-react';
import styles from './tasks.module.css';

interface TasksHeaderProps {
  onCreate: () => void;
}

export function TasksHeader({ onCreate }: TasksHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Tasks</h1>
      <button type="button" className={styles.createButton} onClick={onCreate}>
        <Plus size={16} aria-hidden="true" />
        Create New Task
      </button>
    </header>
  );
}
