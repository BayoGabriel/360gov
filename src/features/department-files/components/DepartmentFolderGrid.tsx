import type { DepartmentUnit } from '../types/department-files.types';
import styles from './department-files.module.css';
import { DepartmentFolderCard } from './DepartmentFolderCard';

interface DepartmentFolderGridProps {
  units: DepartmentUnit[];
  linkFor: (unit: DepartmentUnit) => string;
  emptyMessage: string;
}

export function DepartmentFolderGrid({
  units,
  linkFor,
  emptyMessage,
}: DepartmentFolderGridProps) {
  if (units.length === 0) {
    return <p className={styles.status}>{emptyMessage}</p>;
  }
  return (
    <ul className={styles.folderGrid}>
      {units.map((unit) => (
        <DepartmentFolderCard key={unit.id} unit={unit} to={linkFor(unit)} />
      ))}
    </ul>
  );
}
