import type {
  DashboardApi,
  DashboardData,
  DocumentListItem,
} from '../types/dashboard.types';
import type { AppRole } from '../../../shared/auth/roles';

const SIMULATED_LATENCY_MS = 500;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

const SAMPLE_TITLE = 'Tofunmi Ayobade Isreal vs Nigerian Breweries';
const SAMPLE_REFERENCE = 'CR: 3000/NPF/ABJ/HQ/SDC II/FIN/VOL.2/072';

function docItems(count: number): DocumentListItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `doc-${index}`,
    title: SAMPLE_TITLE,
    reference: SAMPLE_REFERENCE,
    date: '2023-08-02T16:50:00',
    assigneeCount: 5,
  }));
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
      href: '/reports',
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
      id: 'my-tasks',
      label: 'My Pending Tasks',
      value: 24,
      icon: 'tasks',
      href: '/tasks',
    },
    {
      id: 'files-submitted',
      label: 'Files I Submitted',
      value: 87,
      icon: 'documents',
      href: '/documents',
    },
    {
      id: 'memos-received',
      label: 'Memos Received',
      value: 12,
      icon: 'memos',
      href: '/memos',
    },
  ],
  tasks: docItems(6),
};

/**
 * Development-only dashboard fixtures used when no VITE_API_BASE_URL is
 * configured. Figures and records are illustrative, not real data.
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
};
