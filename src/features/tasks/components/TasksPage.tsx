import { useToast } from '../../../shared/components/Toast';
import {
  useCaptureTask,
  useUpdateTaskStatus,
} from '../queries/tasks.mutations';
import { useTaskFormOptions } from '../queries/tasks.queries';
import { useTasksPage } from '../hooks/useTasksPage';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { TaskBoard } from './TaskBoard';
import { TaskFilterDialog } from './TaskFilterDialog';
import { TaskFormDialog } from './TaskFormDialog';
import { TasksHeader } from './TasksHeader';
import { TasksToolbar } from './TasksToolbar';
import { TaskViewDialog } from './TaskViewDialog';
import styles from './tasks.module.css';

export function TasksPage() {
  const page = useTasksPage();
  const formOptions = useTaskFormOptions(page.dialog?.kind === 'filter');
  const capture = useCaptureTask();
  const updateStatus = useUpdateTaskStatus();
  const toast = useToast();
  const { data, isPending, isError, refetch } = page.listQuery;
  const dialog = page.dialog;

  const captureTask = (taskId: string) =>
    capture.mutate(taskId, {
      onSuccess: () => toast.success('Request captured successfully.'),
      onError: () => toast.error('The request could not be captured.'),
    });
  const startTask = (taskId: string) =>
    updateStatus.mutate(
      { taskId, status: 'in-progress' },
      {
        onSuccess: () => toast.success('Task started.'),
        onError: () => toast.error('The task could not be started.'),
      },
    );
  const concludeTask = (taskId: string) =>
    updateStatus.mutate(
      { taskId, status: 'done' },
      {
        onSuccess: () => toast.success('Task concluded.'),
        onError: () => toast.error('The task could not be concluded.'),
      },
    );

  return (
    <div className={styles.page}>
      <TasksHeader onCreate={() => page.setDialog({ kind: 'create' })} />
      <TasksToolbar
        period={page.period}
        onPeriod={page.setPeriod}
        scope={page.scope}
        onScope={page.setScope}
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
          isAdmin={page.isAdmin}
          me={page.me}
          onView={(task) => page.setDialog({ kind: 'view', task })}
          onEdit={(task) => page.setDialog({ kind: 'edit', task })}
          onDelete={(task) => page.setDialog({ kind: 'delete', task })}
          onCapture={(task) => captureTask(task.id)}
          onStart={(task) => startTask(task.id)}
          onConclude={(task) => concludeTask(task.id)}
          actionPending={capture.isPending || updateStatus.isPending}
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
      {dialog?.kind === 'view' ? (
        <TaskViewDialog
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
