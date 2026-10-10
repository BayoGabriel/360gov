import { Link } from 'react-router';
import { ROUTES } from '../../../shared/constants/routes';
import styles from './department-files.module.css';

export interface BreadcrumbAncestor {
  label: string;
  to: string;
}

interface DepartmentBreadcrumbProps {
  /** Linked ancestor units, outermost first. */
  ancestors: BreadcrumbAncestor[];
  current: string;
}

export function DepartmentBreadcrumb({
  ancestors,
  current,
}: DepartmentBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      <Link to={ROUTES.departmentFiles} className={styles.breadcrumbLink}>
        All Departments
      </Link>
      {ancestors.map((ancestor) => (
        <span key={ancestor.to}>
          <span className={styles.breadcrumbSeparator} aria-hidden="true">
            /
          </span>
          <Link to={ancestor.to} className={styles.breadcrumbLink}>
            {ancestor.label}
          </Link>
        </span>
      ))}
      <span>
        <span className={styles.breadcrumbSeparator} aria-hidden="true">
          /
        </span>
        <span className={styles.breadcrumbCurrent} aria-current="page">
          {current}
        </span>
      </span>
    </nav>
  );
}
