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

/** Shared workflow status used across list screens. */
export type DocStatus = 'processing' | 'success' | 'declined';

export type DashboardPeriod = 'daily' | 'weekly' | 'monthly';

export interface DocumentListItem {
  id: string;
  title: string;
  reference: string;
  /** ISO 8601 timestamp. */
  date: string;
  assigneeCount: number;
  status: DocStatus;
}

export interface Collaborator {
  name: string;
  avatarUrl?: string;
}

export type OutgoingFileAction = 'upload' | 'forward' | 'tag';

export interface OutgoingFileItem {
  id: string;
  title: string;
  reference: string;
  /** ISO 8601 timestamp. */
  date: string;
  destination: string;
  status: DocStatus;
  uploaded: boolean;
  forwarded: boolean;
  tagged: boolean;
  /** Collaborators sharing the file; when empty a Tag action is offered. */
  collaborators: Collaborator[];
}

export interface StaffFilesQuery {
  period?: DashboardPeriod;
  search?: string;
  status?: DocStatus;
  /** ISO date (yyyy-mm-dd) bounds on item dates. */
  from?: string;
  to?: string;
}

export interface StaffFilesResult {
  incoming: DocumentListItem[];
  outgoing: OutgoingFileItem[];
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
  getStaffFiles(
    query: StaffFilesQuery,
    options?: DashboardApiOptions,
  ): Promise<StaffFilesResult>;
  updateOutgoingFile(
    fileId: string,
    action: OutgoingFileAction,
    fileName?: string,
    options?: DashboardApiOptions,
  ): Promise<OutgoingFileItem>;
  /** Registers a newly scanned document (appears under Incoming). */
  scanDocument(fileName: string): Promise<void>;
}
