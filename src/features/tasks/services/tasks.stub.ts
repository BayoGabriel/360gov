import { ORG_DEPARTMENTS } from '../../../shared/dev/org-units';
import type {
  TaskAssignee,
  TaskFormOptions,
  TaskInput,
  TaskListQuery,
  TaskPriority,
  TaskRecord,
  TaskStatus,
  TasksApi,
} from '../types/tasks.types';

const SIMULATED_LATENCY_MS = 300;
const SEED_COUNT = 9;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

const ASSIGNEES: TaskAssignee[] = [
  { id: 'asg-1', name: 'Olivia Rhye', title: 'Registry Officer' },
  { id: 'asg-2', name: 'Phoenix Baker', title: 'Legal Officer' },
  { id: 'asg-3', name: 'Lana Steiner', title: 'Finance Officer' },
  { id: 'asg-4', name: 'Demi Wilkinson', title: 'Procurement Officer' },
  { id: 'asg-5', name: 'Kelechi David Eze', title: 'ICT Officer' },
];

const TITLES = [
  'Update your plan payment details.',
  'Review pending procurement requests.',
  'Prepare the monthly budget summary.',
  'Verify staff appraisal submissions.',
  'Draft response to audit query.',
  'Reconcile department imprest accounts.',
];

const ATTACHMENT_TITLES = [
  'Tofunmi Ayobade Isreal vs Nigerian Breweries',
  'Federal Ministry Circular 2022/014',
  'Q4 Capital Expenditure Report',
  'National Identity Verification Memo',
];

const STATUSES: TaskStatus[] = ['to-do', 'in-progress', 'done'];
const PRIORITIES: TaskPriority[] = ['top', 'high', 'medium', 'low'];

const DEPARTMENTS = ORG_DEPARTMENTS.map((department) => department.name);

function makeRow(index: number): TaskRecord {
  const status = STATUSES[index % STATUSES.length];
  return {
    id: `task-${index}`,
    title: TITLES[index % TITLES.length],
    description:
      'Consectetur. Tempus aliquam id sagittis ut Lorem ipsum dolor sit amet.',
    department: DEPARTMENTS[index % DEPARTMENTS.length],
    assignee: ASSIGNEES[index % ASSIGNEES.length].name,
    attachment: {
      title: ATTACHMENT_TITLES[index % ATTACHMENT_TITLES.length],
      fileName: 'Investment contracts.pdf',
      sizeBytes: 132_730 + index * 911,
    },
    priorities: [PRIORITIES[index % PRIORITIES.length]],
    status,
    captured: status !== 'to-do' && index % 4 === 1,
    startDate: `2022-01-${String(6 + index).padStart(2, '0')}`,
    endDate: `2022-01-${String(13 + index).padStart(2, '0')}`,
    createdBy: 'Super Admin',
    createdOn: '2022-06-07',
  };
}

/**
 * In-memory record store so create/update/remove/capture stay visible
 * across list calls during a session. Generated fixtures only.
 */
let rows: TaskRecord[] = Array.from({ length: SEED_COUNT }, (_, i) =>
  makeRow(i),
);
let nextId = SEED_COUNT;

function matchesQuery(row: TaskRecord, query: TaskListQuery): boolean {
  const q = (query.query ?? '').trim().toLowerCase();
  if (
    q &&
    !row.title.toLowerCase().includes(q) &&
    !row.department.toLowerCase().includes(q) &&
    !row.assignee.toLowerCase().includes(q)
  ) {
    return false;
  }
  if (query.status && row.status !== query.status) return false;
  if (query.department && row.department !== query.department) return false;
  if (query.priority && !row.priorities.includes(query.priority)) return false;
  if (query.from && row.startDate < query.from) return false;
  if (query.to && row.startDate > query.to) return false;
  return true;
}

function toRecord(input: TaskInput, id: string): TaskRecord {
  return {
    id,
    title: input.title,
    description: input.description,
    department: input.department,
    assignee: input.assignee,
    attachment: input.attachmentName
      ? { title: input.title, fileName: input.attachmentName, sizeBytes: 0 }
      : undefined,
    priorities: input.priorities,
    status: 'to-do',
    captured: false,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    createdBy: 'Super Admin',
    createdOn: new Date().toISOString().slice(0, 10),
  };
}

/**
 * Development-only task fixtures used when no VITE_API_BASE_URL is
 * configured. Records are generated, not real data.
 */
export const devTasksApi: TasksApi = {
  async list(query: TaskListQuery): Promise<TaskRecord[]> {
    await delay();
    return rows.filter((row) => matchesQuery(row, query));
  },

  async listFormOptions(): Promise<TaskFormOptions> {
    await delay();
    return { departments: DEPARTMENTS, assignees: ASSIGNEES };
  },

  async create(input: TaskInput): Promise<TaskRecord> {
    await delay();
    const record = toRecord(input, `task-${nextId++}`);
    rows = [record, ...rows];
    return record;
  },

  async update(taskId: string, input: TaskInput): Promise<TaskRecord> {
    await delay();
    const existing = rows.find((row) => row.id === taskId);
    if (!existing) throw new Error(`Unknown task ${taskId}`);
    const updated: TaskRecord = {
      ...existing,
      title: input.title,
      description: input.description,
      department: input.department,
      assignee: input.assignee,
      attachment: input.attachmentName
        ? { title: input.title, fileName: input.attachmentName, sizeBytes: 0 }
        : existing.attachment,
      priorities: input.priorities,
    };
    rows = rows.map((row) => (row.id === taskId ? updated : row));
    return updated;
  },

  async remove(taskId: string): Promise<void> {
    await delay();
    rows = rows.filter((row) => row.id !== taskId);
  },

  async capture(taskId: string): Promise<void> {
    await delay();
    rows = rows.map((row) =>
      row.id === taskId ? { ...row, captured: true } : row,
    );
  },
};
