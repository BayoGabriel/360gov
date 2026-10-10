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
  onEdit: (task: TaskRecord) => void;
  onDelete: (task: TaskRecord) => void;
  onCapture: (task: TaskRecord) => void;
  capturePending: boolean;
}

export function TaskBoard({
  tasks,
  onEdit,
  onDelete,
  onCapture,
  capturePending,
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
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCapture={onCapture}
                  capturePending={capturePending}
                />
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}
