import type {
  Collaborator,
  DashboardApi,
  DashboardData,
  DocStatus,
  DocumentListItem,
  OutgoingFileAction,
  OutgoingFileItem,
  StaffFilesQuery,
  StaffFilesResult,
} from '../types/dashboard.types';
import type { AppRole } from '../../../shared/auth/roles';

const SIMULATED_LATENCY_MS = 500;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

const SAMPLE_TITLE = 'Tofunmi Ayobade Isreal vs Nigerian Breweries';
const SAMPLE_REFERENCE = 'CR: 3000/NPF/ABJ/HQ/SDC II/FIN/VOL.2/072';
const DOC_STATUSES: DocStatus[] = ['processing', 'success', 'declined'];

function docItems(count: number): DocumentListItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `doc-${index}`,
    title: SAMPLE_TITLE,
    reference: SAMPLE_REFERENCE,
    date: '2023-08-02T16:50:00',
    assigneeCount: 5,
    status: DOC_STATUSES[index % DOC_STATUSES.length],
  }));
}

const DESTINATIONS = ['Procurement Dpt', 'Finance Dpt', 'Maintenance Dpt'];
const COLLABORATORS: Collaborator[] = [
  { name: 'Olivia Rhye' },
  { name: 'Phoenix Baker' },
  { name: 'Demi Wilkinson' },
];

/** Mutable so staff actions/scan mutations are reflected in later queries. */
const staffIncoming: DocumentListItem[] = Array.from({ length: 9 }, (_, i) => ({
  id: `in-${i}`,
  title: SAMPLE_TITLE,
  reference: SAMPLE_REFERENCE,
  date: `2022-01-${String(13 - (i % 8)).padStart(2, '0')}T16:50:00`,
  assigneeCount: 5,
  status: DOC_STATUSES[i % DOC_STATUSES.length],
}));

const staffOutgoing: OutgoingFileItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: `out-${i}`,
  title: SAMPLE_TITLE,
  reference: SAMPLE_REFERENCE,
  date: `2022-01-${String(13 - (i % 8)).padStart(2, '0')}T16:50:00`,
  destination: DESTINATIONS[i % DESTINATIONS.length],
  status: DOC_STATUSES[i % DOC_STATUSES.length],
  uploaded: false,
  forwarded: false,
  tagged: false,
  collaborators: i % 3 === 1 ? COLLABORATORS : [],
}));

function matchesStaffQuery(
  query: StaffFilesQuery,
  item: DocumentListItem | OutgoingFileItem,
  extraSearchFields: string[] = [],
): boolean {
  const search = (query.search ?? '').trim().toLowerCase();
  const fields = [item.title, item.reference, ...extraSearchFields];
  if (search && !fields.some((f) => f.toLowerCase().includes(search))) {
    return false;
  }
  if (query.status && item.status !== query.status) return false;
  const day = item.date.slice(0, 10);
  if (query.from && day < query.from) return false;
  if (query.to && day > query.to) return false;
  return true;
}

const permanentSecretaryData: DashboardData = {
  role: 'permanent-secretary',
  stats: [
    {
      id: 'pending-approvals',
      label: 'Pending Approvals',
      value: 120,
      icon: 'approvals',
      href: '/documents?view=pending',
    },
    {
      id: 'task-in-review',
      label: 'Task in Review',
      value: 612,
      icon: 'review',
      href: '/documents?view=in-review',
    },
    {
      id: 'processed-files',
      label: 'Total Processed Files this Month',
      value: 732,
      icon: 'processed',
      href: '/documents?view=processed',
    },
    {
      id: 'dept-performance',
      label: 'Department Performance Summary',
      value: 243,
      icon: 'performance',
      href: '/reports',
    },
  ],
  activeUsers: {
    total: 1000,
    series: [80, 65, 50],
    labels: ['Series 1', 'Series 2', 'Series 3'],
  },
  taskProcessed: {
    categories: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    series: [
      {
        name: '2021',
        data: [52, 55, 54, 58, 57, 61, 63, 62, 66, 68, 71, 74],
      },
      {
        name: '2020',
        data: [38, 40, 41, 43, 42, 45, 47, 46, 49, 52, 54, 56],
      },
      {
        name: '2019',
        data: [20, 24, 26, 25, 28, 31, 30, 34, 33, 38, 40, 43],
      },
    ],
  },
  activities: [
    {
      id: 'act-1',
      actorName: 'Olayimika Yinka',
      actorEmail: 'olayimika@gmail.com',
      description:
        'Consectetur. Tempus aliquam id sagittis ut Lorem ipsum dolor sit amet empus Tempus aliquam id sagittis ut Lorem.',
      date: '2023-08-02T16:50:00',
    },
    {
      id: 'act-2',
      actorName: 'Florence Ugechukwu',
      actorEmail: 'florenceuge@gmail.com',
      description:
        'Consectetur. Tempus aliquam id sagittis ut Lorem ipsum dolor sit amet empus Tempus aliquam id sagittis.',
      date: '2023-08-02T16:50:00',
    },
    {
      id: 'act-3',
      actorName: 'Danjuma Yusuf',
      actorEmail: 'danjumayusuf@gmail.com',
      description:
        'Consectetur. Tempus aliquam id sagittis ut Lorem ipsum dolor sit amet empus Tempus aliquam id sagittis ut Lorem.',
      date: '2023-08-02T16:50:00',
    },
  ],
};

const departmentHeadData: DashboardData = {
  role: 'department-head',
  stats: [
    {
      id: 'awaiting-review',
      label: 'Documents Awaiting Review',
      value: 120,
      icon: 'documents',
      href: '/documents?view=pending',
    },
    {
      id: 'team-tasks',
      label: 'Team Tasks',
      value: 612,
      icon: 'tasks',
      href: '/tasks',
    },
    {
      id: 'tat-tracker',
      label: 'Turnaround Time Tracker TAT',
      value: 732,
      icon: 'turnaround',
      href: '/reports/turnaround',
    },
  ],
  columns: [
    {
      id: 'latest-memos',
      title: 'Latest Memos From Registry',
      viewAllHref: '/memos',
      items: docItems(8),
    },
    {
      id: 'active-assignments',
      title: 'Active File Assignments',
      viewAllHref: '/documents',
      items: docItems(8),
    },
    {
      id: 'recent-submissions',
      title: 'Recent Team Submissions',
      viewAllHref: '/tasks',
      items: docItems(8),
    },
  ],
};

const staffData: DashboardData = {
  role: 'staff',
  stats: [
    {
      id: 'my-pending',
      label: 'My Pending Files',
      value: 6,
      icon: 'documents',
      href: '/documents?view=pending',
    },
    {
      id: 'my-tasks',
      label: 'My Tasks',
      value: 4,
      icon: 'tasks',
      href: '/tasks',
    },
    {
      id: 'my-processed',
      label: 'Processed by Me',
      value: 18,
      icon: 'processed',
      href: '/documents?view=processed',
    },
    {
      id: 'my-memos',
      label: 'My Memos',
      value: 3,
      icon: 'memos',
      href: '/memos',
    },
  ],
  tasks: staffIncoming.slice(0, 5),
};

/**
 * Development-only dashboard fixtures used when no VITE_API_BASE_URL is
 * configured. Figures and records are illustrative, not real data.
 * `period` is passed through to satisfy the contract; the backend owns
 * period-window semantics, so the stub does not filter on it.
 */
export const devDashboardApi: DashboardApi = {
  async getDashboard(role: AppRole): Promise<DashboardData> {
    await delay();
    switch (role) {
      case 'permanent-secretary':
        return permanentSecretaryData;
      case 'department-head':
        return departmentHeadData;
      default:
        return staffData;
    }
  },

  async getStaffFiles(query: StaffFilesQuery): Promise<StaffFilesResult> {
    await delay();
    return {
      incoming: staffIncoming.filter((item) => matchesStaffQuery(query, item)),
      outgoing: staffOutgoing.filter((file) =>
        matchesStaffQuery(query, file, [file.destination]),
      ),
    };
  },

  async updateOutgoingFile(
    fileId: string,
    action: OutgoingFileAction,
  ): Promise<OutgoingFileItem> {
    await delay();
    const file = staffOutgoing.find((f) => f.id === fileId);
    if (!file) throw new Error(`Unknown outgoing file: ${fileId}`);
    if (action === 'upload') file.uploaded = true;
    if (action === 'forward') file.forwarded = true;
    if (action === 'tag') file.tagged = true;
    return { ...file };
  },

  async scanDocument(fileName: string): Promise<void> {
    await delay();
    staffIncoming.unshift({
      id: `scan-${staffIncoming.length}`,
      title: fileName,
      reference: 'SCANNED',
      date: new Date().toISOString(),
      assigneeCount: 1,
      status: 'processing',
    });
  },
};
