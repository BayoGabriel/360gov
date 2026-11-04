import {
  ORG_DEPARTMENTS,
  ORG_UNITS,
} from '../../../shared/dev/org-units';
import type {
  TaskAssignee,
  TaskFormOptions,
  TaskInput,
  TaskListQuery,
  TaskPriority,
  TaskRecord,
  TaskStatus,
  TaskUnit,
  TasksApi,
} from '../types/tasks.types';

const SIMULATED_LATENCY_MS = 300;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

const ASSIGNEES: TaskAssignee[] = [
  { id: 'asg-1', name: 'Olivia Rhye', title: 'Facility Maintenance Officer' },
  { id: 'asg-2', name: 'Demi Wilkinson', title: 'Head of Unit, Facility Maintenance' },
  { id: 'asg-3', name: 'Lana Steiner', title: 'General Services Officer' },
  { id: 'asg-4', name: 'Tunde Bakare', title: 'Tenders & Contracts Officer' },
  { id: 'asg-5', name: 'Kelechi David Eze', title: 'Compliance Officer' },
];

const DEPARTMENTS = ORG_DEPARTMENTS.map((department) => department.name);
const UNITS: TaskUnit[] = ORG_UNITS.map((unit) => ({
  name: unit.name,
  department:
    ORG_DEPARTMENTS.find((d) => d.id === unit.parentId)?.name ?? '',
}));

const STATUSES: TaskStatus[] = ['to-do', 'in-progress', 'done'];
const PRIORITIES: TaskPriority[] = ['top', 'high', 'medium', 'low'];

const ATTACHMENT_TITLES = [
  'Tofunmi Ayobade Isreal vs Nigerian Breweries',
  'Federal Ministry Circular 2022/014',
  'Q4 Capital Expenditure Report',
  'National Identity Verification Memo',
];

interface SeedTask {
  title: string;
  department: string;
  unit: string;
  assignee: string;
}

/**
 * Fixtures follow the ministry flow: work is designated to a unit inside
 * a department (e.g. Corporate Services -> Facility Maintenance).
 */
const SEEDS: SeedTask[] = [
  {
    title: 'Inspect fleet vehicles for Q4 servicing',
    department: 'Corporate Services Department',
    unit: 'General Services',
    assignee: 'Lana Steiner',
  },
  {
    title: 'Sort and dispatch incoming EVC Registry mail',
    department: 'Corporate Services Department',
    unit: 'General Services',
    assignee: 'Lana Steiner',
  },
  {
    title: 'Fix plumbing on the 3rd floor, Block C',
    department: 'Corporate Services Department',
    unit: 'Facility Maintenance',
    assignee: 'Olivia Rhye',
  },
  {
    title: 'Replace faulty electrical fittings in the conference room',
    department: 'Corporate Services Department',
    unit: 'Facility Maintenance',
    assignee: 'Olivia Rhye',
  },
  {
    title: 'Review pending office allocation requests',
    department: 'Corporate Services Department',
    unit: 'Estate Maintenance',
    assignee: 'Olivia Rhye',
  },
  {
    title: 'Conduct HSE inspection of the annex building',
    department: 'Corporate Services Department',
    unit: 'Estate Maintenance',
    assignee: 'Demi Wilkinson',
  },
  {
    title: 'Consolidate procurement requirements for the FY2027 bid process',
    department: 'Procurement Department',
    unit: 'Planning, Research & Data Management',
    assignee: 'Tunde Bakare',
  },
  {
    title: 'Prepare bid documents — office furniture tender',
    department: 'Procurement Department',
    unit: 'Tenders & Contract Administration',
    assignee: 'Tunde Bakare',
  },
  {
    title: 'Physical inspection of delivered generators',
    department: 'Procurement Department',
    unit: 'Compliance, Monitoring & Evaluation',
    assignee: 'Kelechi David Eze',
  },
  {
    title: 'Stock-level audit of store inventory',
    department: 'Procurement Department',
    unit: 'Logistics, Store & Inventory Management',
    assignee: 'Kelechi David Eze',
  },
  {
    title: 'Process third-party payment certificate',
    department: 'Finance Department',
    unit: 'Accounts',
    assignee: 'Kelechi David Eze',
  },
  {
    title: 'Vet draft MoU with the state ministry',
    department: 'Legal Department',
    unit: 'Records',
    assignee: 'Demi Wilkinson',
  },
];

function makeRow(index: number): TaskRecord {
  const seed = SEEDS[index % SEEDS.length];
  const status = STATUSES[index % STATUSES.length];
  return {
    id: `task-${index}`,
    title: seed.title,
    description: `${seed.unit} assignment raised through the Head of Unit for ${seed.department.replace(/ Department$/, '')}.`,
    department: seed.department,
    unit: seed.unit,
    assignee: seed.assignee,
    attachment:
      index % 2 === 0
        ? {
            title: ATTACHMENT_TITLES[index % ATTACHMENT_TITLES.length],
            fileName: 'Investment contracts.pdf',
            sizeBytes: 132_730 + index * 911,
          }
        : undefined,
    priorities: [PRIORITIES[index % PRIORITIES.length]],
    status,
    captured: status !== 'to-do' && index % 4 === 1,
    startDate: `2022-01-${String(6 + index).padStart(2, '0')}`,
    endDate: `2022-01-${String(13 + index).padStart(2, '0')}`,
    createdBy:
      index % 3 === 0 ? seed.assignee : 'Phoenix Baker',
    createdOn: '2022-06-07',
  };
}

/**
 * In-memory record store so create/update/remove/capture stay visible
 * across list calls during a session. Generated fixtures only.
 */
let rows: TaskRecord[] = Array.from({ length: SEEDS.length }, (_, i) =>
  makeRow(i),
);
let nextId = SEEDS.length;

function matchesQuery(row: TaskRecord, query: TaskListQuery): boolean {
  // Role scope: a unit-scoped user only sees their unit's tasks; a
  // department-scoped user sees their whole department.
  if (query.userUnit) {
    if (row.unit !== query.userUnit) return false;
  } else if (query.userDepartment && row.department !== query.userDepartment) {
    return false;
  }
  const q = (query.query ?? '').trim().toLowerCase();
  if (
    q &&
    !row.title.toLowerCase().includes(q) &&
    !row.department.toLowerCase().includes(q) &&
    !row.unit.toLowerCase().includes(q) &&
    !row.assignee.toLowerCase().includes(q)
  ) {
    return false;
  }
  if (query.scope === 'assigned' && query.me && row.assignee !== query.me) {
    return false;
  }
  if (query.scope === 'created' && query.me && row.createdBy !== query.me) {
    return false;
  }
  if (query.status && row.status !== query.status) return false;
  if (query.department && row.department !== query.department) return false;
  if (query.unit && row.unit !== query.unit) return false;
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
    unit: input.unit,
    assignee: input.assignee,
    attachment: input.attachmentName
      ? { title: input.title, fileName: input.attachmentName, sizeBytes: 0 }
      : undefined,
    priorities: input.priorities,
    status: 'to-do',
    captured: false,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    createdBy: input.createdBy ?? 'Super Admin',
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
    return { departments: DEPARTMENTS, units: UNITS, assignees: ASSIGNEES };
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
      unit: input.unit,
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

  async updateStatus(taskId: string, status: TaskStatus): Promise<void> {
    await delay();
    if (!rows.some((row) => row.id === taskId)) {
      throw new Error(`Unknown task ${taskId}`);
    }
    rows = rows.map((row) => (row.id === taskId ? { ...row, status } : row));
  },
};
