export type TaskStatus = 'to-do' | 'in-progress' | 'done';

export type TaskPeriod = 'daily' | 'weekly' | 'monthly';

/**
 * Priority labels offered by the create-task form. 'in-progress' is a
 * selectable label in the design even though it is also a status name;
 * the backend contract should confirm the final vocabulary.
 */
export type TaskPriority = 'top' | 'high' | 'medium' | 'low' | 'in-progress';

export const TASK_PRIORITIES: readonly TaskPriority[] = [
  'top',
  'high',
  'medium',
  'low',
  'in-progress',
];

export interface TaskAttachment {
  /** Descriptive line shown above the file name (e.g. case title). */
  title: string;
  fileName: string;
  sizeBytes: number;
}

export interface TaskRecord {
  id: string;
  title: string;
  description: string;
  department: string;
  assignee: string;
  attachment?: TaskAttachment;
  priorities: TaskPriority[];
  status: TaskStatus;
  /** Whether the request behind this task has already been captured. */
  captured: boolean;
  /** ISO 8601 date. */
  startDate: string;
  /** ISO 8601 date. */
  endDate: string;
  createdBy: string;
  /** ISO 8601 date. */
  createdOn: string;
}

export interface TaskAssignee {
  id: string;
  name: string;
  title: string;
}

export interface TaskFormOptions {
  departments: string[];
  assignees: TaskAssignee[];
}

/** Which slice of tasks a signed-in user wants to see. */
export type TaskScope = 'all' | 'assigned' | 'created';

export interface TaskListQuery {
  period: TaskPeriod;
  query?: string;
  status?: TaskStatus;
  department?: string;
  priority?: TaskPriority;
  /**
   * 'assigned' limits to tasks assigned to `me`; 'created' limits to
   * tasks created by `me`. The real backend derives this from the
   * session token; the dev stub uses `me` instead.
   */
  scope?: TaskScope;
  /** Display name of the signed-in user, used by the dev stub for scope. */
  me?: string;
  /** ISO date (yyyy-mm-dd) bounds on startDate. */
  from?: string;
  to?: string;
  signal?: AbortSignal;
}

export interface TaskInput {
  title: string;
  description: string;
  department: string;
  assignee: string;
  /** Original name of the attached file, if one was chosen. */
  attachmentName?: string;
  priorities: TaskPriority[];
  /** Display name of the creator; the real backend takes it from the token. */
  createdBy?: string;
}

export interface TasksApi {
  list(query: TaskListQuery): Promise<TaskRecord[]>;
  listFormOptions(signal?: AbortSignal): Promise<TaskFormOptions>;
  create(input: TaskInput): Promise<TaskRecord>;
  update(taskId: string, input: TaskInput): Promise<TaskRecord>;
  remove(taskId: string): Promise<void>;
  capture(taskId: string): Promise<void>;
  updateStatus(taskId: string, status: TaskStatus): Promise<void>;
}
