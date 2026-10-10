import { useParams } from 'react-router';
import { ROUTES } from '../../../shared/constants/routes';
import { useDepartmentAccess } from '../hooks/useDepartmentAccess';
import { useUnitFilesPage } from '../hooks/useUnitFilesPage';
import {
  useDepartmentUnit,
  useUnitFileFilterOptions,
} from '../queries/department-files.queries';
import styles from './department-files.module.css';
import { DepartmentBreadcrumb } from './DepartmentBreadcrumb';
import { DepartmentFilesToolbar } from './DepartmentFilesToolbar';
import { UnitFilesFilterDialog } from './UnitFilesFilterDialog';
import { UnitFilesPagination } from './UnitFilesPagination';
import { UnitFilesTable } from './UnitFilesTable';
import { UnitFileViewDialog } from './UnitFileViewDialog';

export function DepartmentUnitFilesPage() {
  const { departmentId = '', unitId = '' } = useParams();
  const { canViewUnit } = useDepartmentAccess();
  const department = useDepartmentUnit(departmentId || null);
  const unit = useDepartmentUnit(unitId || null);
  const page = useUnitFilesPage(unitId);
  const filterOptions = useUnitFileFilterOptions();
  const { data, isPending, isError, refetch } = page.filesQuery;

  if (!canViewUnit(departmentId, unitId)) {
    return (
      <div className={styles.page}>
        <DepartmentBreadcrumb ancestors={[]} current="No access" />
        <p className={styles.status} role="alert">
          You do not have access to this unit&rsquo;s files.
        </p>
      </div>
    );
  }

  const ancestors = department.data
    ? [
        {
          label: department.data.name,
          to: `${ROUTES.departmentFiles}/${departmentId}`,
        },
      ]
    : [];
  const unitName = unit.data?.name ?? '…';

  return (
    <div className={styles.page}>
      <DepartmentBreadcrumb ancestors={ancestors} current={unitName} />
      <h1 className={styles.title}>{unitName}</h1>
      <DepartmentFilesToolbar
        searchInput={page.searchInput}
        onSearchChange={page.setSearchInput}
        dateFrom={page.dateFrom}
        dateTo={page.dateTo}
        onDateRange={page.setDateRange}
        onOpenFilters={page.openFilters}
      />
      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>All Documents</h2>
        {isPending ? (
          <p className={styles.status} role="status">
            Loading files…
          </p>
        ) : isError ? (
          <div className={styles.status} role="alert">
            <p>Files could not be loaded.</p>
            <button type="button" onClick={() => void refetch()}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <UnitFilesTable
              files={data?.items ?? []}
              selected={page.selected}
              onToggle={page.toggleSelected}
              onToggleAll={page.toggleAll}
              onView={page.setViewing}
            />
            <UnitFilesPagination
              page={data?.page ?? 1}
              totalPages={data?.totalPages ?? 1}
              onPage={page.setPage}
            />
          </>
        )}
      </section>
      {page.filtersOpen ? (
        <UnitFilesFilterDialog
          open
          options={filterOptions.data}
          current={page.filters}
          onApply={page.applyFilters}
          onClose={page.closeFilters}
        />
      ) : null}
      {page.viewing ? (
        <UnitFileViewDialog
          file={page.viewing}
          onClose={() => page.setViewing(null)}
        />
      ) : null}
    </div>
  );
}
