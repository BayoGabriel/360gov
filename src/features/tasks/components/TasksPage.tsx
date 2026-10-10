import { useCaptureTask } from '../queries/tasks.mutations';
import { useTaskFormOptions } from '../queries/tasks.queries';
import { useTasksPage } from '../hooks/useTasksPage';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { TaskBoard } from './TaskBoard';
import { TaskFilterDialog } from './TaskFilterDialog';
import { TaskFormDialog } from './TaskFormDialog';
import { TasksHeader } from './TasksHeader';
import { TasksToolbar } from './TasksToolbar';
import styles from './tasks.module.css';

export function TasksPage() {
  const page = useTasksPage();
  const formOptions = useTaskFormOptions(page.dialog?.kind === 'filter');
  const capture = useCaptureTask();
  const { data, isPending, isError, refetch } = page.listQuery;
  const dialog = page.dialog;

  return (
    <div className={styles.page}>
      <TasksHeader onCreate={() => page.setDialog({ kind: 'create' })} />
      <TasksToolbar
        period={page.period}
        onPeriod={page.setPeriod}
        searchInput={page.searchInput}
        onSearchChange={page.setSearchInput}
        dateFrom={page.from}
        dateTo={page.to}
        onDateRange={page.setRange}
        onOpenFilters={() => page.setDialog({ kind: 'filter' })}
      />
      {isPending ? (
        <p className={styles.status} role="status">
          Loading tasks…
        </p>
      ) : isError ? (
        <div className={styles.status} role="alert">
          <p>Tasks could not be loaded.</p>
          <button type="button" onClick={() => void refetch()}>
            Retry
          </button>
        </div>
      ) : (
        <TaskBoard
          tasks={data ?? []}
          onEdit={(task) => page.setDialog({ kind: 'edit', task })}
          onDelete={(task) => page.setDialog({ kind: 'delete', task })}
          onCapture={(task) => capture.mutate(task.id)}
          capturePending={capture.isPending}
        />
      )}

      {dialog?.kind === 'create' ? (
        <TaskFormDialog task={null} onClose={() => page.setDialog(null)} />
      ) : null}
      {dialog?.kind === 'edit' ? (
        <TaskFormDialog
          task={dialog.task}
          onClose={() => page.setDialog(null)}
        />
      ) : null}
      {dialog?.kind === 'delete' ? (
        <DeleteTaskDialog
          task={dialog.task}
          onClose={() => page.setDialog(null)}
        />
      ) : null}
      {dialog?.kind === 'filter' ? (
        <TaskFilterDialog
          options={formOptions.data}
          current={page.filters}
          onApply={page.applyFilters}
          onClose={() => page.setDialog(null)}
        />
      ) : null}
    </div>
  );
}
