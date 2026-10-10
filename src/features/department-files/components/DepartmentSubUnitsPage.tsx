import { useParams } from 'react-router';
import { ROUTES } from '../../../shared/constants/routes';
import { useDepartmentFilesPage } from '../hooks/useDepartmentFilesPage';
import {
  useDepartmentUnit,
  useUnitFileFilterOptions,
} from '../queries/department-files.queries';
import styles from './department-files.module.css';
import { DepartmentBreadcrumb } from './DepartmentBreadcrumb';
import { DepartmentFilesToolbar } from './DepartmentFilesToolbar';
import { DepartmentFolderGrid } from './DepartmentFolderGrid';
import { UnitFilesFilterDialog } from './UnitFilesFilterDialog';

export function DepartmentSubUnitsPage() {
  const { departmentId = '' } = useParams();
  const department = useDepartmentUnit(departmentId);
  const page = useDepartmentFilesPage(departmentId || null);
  const filterOptions = useUnitFileFilterOptions();
  const { data, isPending, isError, refetch } = page.unitsQuery;

  if (department.data === null) {
    return (
      <div className={styles.page}>
        <DepartmentBreadcrumb ancestors={[]} current="Not found" />
        <p className={styles.status}>This department could not be found.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <DepartmentBreadcrumb
        ancestors={[]}
        current={department.data?.name ?? '…'}
      />
      <h1 className={styles.title}>{department.data?.name ?? '…'}</h1>
      <DepartmentFilesToolbar
        searchInput={page.searchInput}
        onSearchChange={page.setSearchInput}
        dateFrom={page.dateFrom}
        dateTo={page.dateTo}
        onDateRange={page.setDateRange}
        onOpenFilters={page.openFilters}
      />
      <h2 className={styles.sectionTitle}>Sub-Units</h2>
      {isPending ? (
        <p className={styles.status} role="status">
          Loading sub-units…
        </p>
      ) : isError ? (
        <div className={styles.status} role="alert">
          <p>Sub-units could not be loaded.</p>
          <button type="button" onClick={() => void refetch()}>
            Retry
          </button>
        </div>
      ) : (
        <DepartmentFolderGrid
          units={data ?? []}
          linkFor={(unit) =>
            `${ROUTES.departmentFiles}/${departmentId}/${unit.id}`
          }
          emptyMessage="No sub-units match your search."
        />
      )}
      {page.filtersOpen ? (
        <UnitFilesFilterDialog
          open
          options={filterOptions.data}
          current={page.filters}
          onApply={page.applyFilters}
          onClose={page.closeFilters}
        />
      ) : null}
    </div>
  );
}
