import { TriangleAlert } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import type { DepartmentUnit } from '../types/department-files.types';
import styles from './department-files.module.css';
import { FolderArt } from './FolderArt';

interface DepartmentFolderCardProps {
  unit: DepartmentUnit;
  to: string;
}

export function DepartmentFolderCard({ unit, to }: DepartmentFolderCardProps) {
  const { search } = useLocation();
  return (
    <li>
      <Link
        to={{ pathname: to, search }}
        className={styles.folderCard}
        title={unit.name}
      >
        <span className={styles.folderArt}>
          <FolderArt />
          {unit.hasAttention ? (
            <span
              className={styles.attentionBadge}
              role="img"
              aria-label="Contains items that need attention"
            >
              <TriangleAlert size={14} aria-hidden="true" />
            </span>
          ) : null}
        </span>
        <span className={styles.folderName}>{unit.name}</span>
      </Link>
    </li>
  );
}
