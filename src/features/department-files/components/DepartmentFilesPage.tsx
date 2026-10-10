import { ROUTES } from '../../../shared/constants/routes';
import { useDepartmentFilesPage } from '../hooks/useDepartmentFilesPage';
import { useUnitFileFilterOptions } from '../queries/department-files.queries';
import styles from './department-files.module.css';
import { DepartmentFilesToolbar } from './DepartmentFilesToolbar';
import { DepartmentFolderGrid } from './DepartmentFolderGrid';
import { UnitFilesFilterDialog } from './UnitFilesFilterDialog';

export function DepartmentFilesPage() {
  const page = useDepartmentFilesPage(null);
  const filterOptions = useUnitFileFilterOptions();
  const { data, isPending, isError, refetch } = page.unitsQuery;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>All Departments</h1>
      <DepartmentFilesToolbar
        searchInput={page.searchInput}
        onSearchChange={page.setSearchInput}
        dateFrom={page.dateFrom}
        dateTo={page.dateTo}
        onDateRange={page.setDateRange}
        onOpenFilters={page.openFilters}
      />
      {isPending ? (
        <p className={styles.status} role="status">
          Loading departments…
        </p>
      ) : isError ? (
        <div className={styles.status} role="alert">
          <p>Departments could not be loaded.</p>
          <button type="button" onClick={() => void refetch()}>
            Retry
          </button>
        </div>
      ) : (
        <DepartmentFolderGrid
          units={data ?? []}
          linkFor={(unit) => `${ROUTES.departmentFiles}/${unit.id}`}
          emptyMessage="No departments match your search."
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
