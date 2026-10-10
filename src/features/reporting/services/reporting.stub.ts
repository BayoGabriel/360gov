import type {
  MonthlyReport,
  ReportDepartment,
  ReportingApi,
  ReportingOverview,
} from '../types/reporting.types';

const SIMULATED_LATENCY_MS = 400;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DEPARTMENTS: ReportDepartment[] = [
  { id: 'procurement', name: 'Procurement Department' },
  { id: 'legal', name: 'Legal Department' },
  { id: 'finance', name: 'Finance Department' },
  { id: 'ict', name: 'ICT Department' },
  { id: 'registry', name: 'Registry Department' },
];

/** Deterministic pseudo-random series seeded by a string. */
function seeded(seed: string, base: number, spread: number): number[] {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  return MONTHS.map((_, i) => base + ((h * (i + 7)) % spread));
}

function turnaroundSeries(departmentId: string): MonthlyReport {
  return {
    categories: MONTHS,
    series: [
      { name: 'Approved', data: seeded(`${departmentId}-a`, 300, 90) },
      { name: 'Canceled', data: seeded(`${departmentId}-c`, 260, 80) },
      { name: 'Pending', data: seeded(`${departmentId}-p`, 240, 70) },
    ],
  };
}

const overview: ReportingOverview = {
  stats: [
    {
      id: 'turnaround',
      label: 'Document Turnaround Time',
      value: 120,
      icon: 'turnaround',
      href: '/reports/turnaround',
    },
    {
      id: 'dept-activity',
      label: 'Departmental Activity',
      value: 612,
      icon: 'activity',
      href: '/department-files',
    },
    {
      id: 'productivity',
      label: 'Officer Productivity',
      value: 732,
      icon: 'productivity',
      href: '/reports/turnaround',
    },
  ],
  activeNow: {
    total: 1000,
    series: [80, 65, 50],
    labels: ['Approved', 'Pending', 'Canceled'],
  },
  officerProductivity: {
    categories: MONTHS,
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
  activitiesLog: {
    categories: MONTHS,
    series: [
      { name: 'Series 1', data: seeded('s1', 300, 60) },
      { name: 'Series 2', data: seeded('s2', 250, 70) },
      { name: 'Series 3', data: seeded('s3', 220, 80) },
    ],
  },
};

/**
 * Development-only reporting fixtures used when no VITE_API_BASE_URL is
 * configured. Figures are illustrative, not real data.
 */
export const devReportingApi: ReportingApi = {
  async getOverview(): Promise<ReportingOverview> {
    await delay();
    return overview;
  },

  async listDepartments(): Promise<ReportDepartment[]> {
    await delay();
    return DEPARTMENTS;
  },

  async getTurnaround(departmentId: string): Promise<MonthlyReport> {
    await delay();
    return turnaroundSeries(departmentId);
  },
};
