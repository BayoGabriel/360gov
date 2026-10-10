import type { TaskRecord, TaskStatus } from '../types/tasks.types';
import { TaskCard } from './TaskCard';
import styles from './tasks.module.css';

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'to-do', label: 'To-Do' },
  { status: 'in-progress', label: 'In Progress' },
  { status: 'done', label: 'Done' },
];

interface TaskBoardProps {
  tasks: TaskRecord[];
  isAdmin: boolean;
  me: string;
  onView: (task: TaskRecord) => void;
  onEdit: (task: TaskRecord) => void;
  onDelete: (task: TaskRecord) => void;
  onCapture: (task: TaskRecord) => void;
  onStart: (task: TaskRecord) => void;
  onConclude: (task: TaskRecord) => void;
  actionPending: boolean;
}

export function TaskBoard({
  tasks,
  isAdmin,
  me,
  onView,
  onEdit,
  onDelete,
  onCapture,
  onStart,
  onConclude,
  actionPending,
}: TaskBoardProps) {
  return (
    <div className={styles.board}>
      {COLUMNS.map(({ status, label }) => {
        const columnTasks = tasks.filter((task) => task.status === status);
        return (
          <section
            key={status}
            className={styles.column}
            aria-label={`${label} tasks`}
          >
            {columnTasks.length === 0 ? (
              <p className={styles.columnEmpty}>No tasks here.</p>
            ) : (
              columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isAdmin={isAdmin}
                  canWork={task.assignee === me}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCapture={onCapture}
                  onStart={onStart}
                  onConclude={onConclude}
                  actionPending={actionPending}
                />
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}
