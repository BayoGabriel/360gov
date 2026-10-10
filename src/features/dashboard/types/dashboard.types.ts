import type { AppRole } from '../../../shared/auth/roles';

export type StatIconKey =
  | 'approvals'
  | 'review'
  | 'processed'
  | 'performance'
  | 'documents'
  | 'tasks'
  | 'turnaround'
  | 'memos';

export interface DashboardStat {
  id: string;
  label: string;
  value: number;
  icon: StatIconKey;
  href: string;
}

export interface DocumentListItem {
  id: string;
  title: string;
  reference: string;
  /** ISO 8601 timestamp. */
  date: string;
  assigneeCount: number;
}

export interface ActivityItem {
  id: string;
  actorName: string;
  actorEmail: string;
  description: string;
  /** ISO 8601 timestamp. */
  date: string;
}

export interface LineSeries {
  name: string;
  data: number[];
}

export interface DocumentListColumn {
  id: string;
  title: string;
  viewAllHref: string;
  items: DocumentListItem[];
}

export type DashboardData =
  | {
      role: 'permanent-secretary';
      stats: DashboardStat[];
      activeUsers: { total: number; series: number[]; labels: string[] };
      taskProcessed: { categories: string[]; series: LineSeries[] };
      activities: ActivityItem[];
    }
  | {
      role: 'department-head';
      stats: DashboardStat[];
      columns: DocumentListColumn[];
    }
  | {
      role: 'staff';
      stats: DashboardStat[];
      tasks: DocumentListItem[];
    };

export interface DashboardApiOptions {
  signal?: AbortSignal;
}

export interface DashboardApi {
  getDashboard(
    role: AppRole,
    options?: DashboardApiOptions,
  ): Promise<DashboardData>;
}
