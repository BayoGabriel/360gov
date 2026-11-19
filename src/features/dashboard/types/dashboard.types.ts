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

/** Which staff file list is shown: received documents vs files dispatched. */
export type StaffDirection = 'incoming' | 'outgoing';

export interface DocumentListItem {
  id: string;
  title: string;
  reference: string;
  documentType: string;
  /** ISO 8601 timestamp. */
  date: string;
  assigneeCount: number;
  /** People who have handled or treated the document so far. */
  treatedBy: Collaborator[];
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
  documentType: string;
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
  /** Compact label used when the column is presented as a tab. */
  shortTitle: string;
  viewAllHref: string;
  items: DocumentListItem[];
}

export interface PendingApprovalItem {
  /** Same identifier as the file record so rows can link to the viewer. */
  id: string;
  fileNo: string;
  title: string;
  documentType: string;
  department: string;
  /** ISO 8601 timestamp. */
  date: string;
  signatureRequired: boolean;
}

export type DashboardData =
  | {
      role: 'evc';
      stats: DashboardStat[];
      activeUsers: { total: number; series: number[]; labels: string[] };
      taskProcessed: { categories: string[]; series: LineSeries[] };
      activities: ActivityItem[];
      pendingApprovals: PendingApprovalItem[];
    }
  | {
      role: 'department-head';
      stats: DashboardStat[];
      columns: DocumentListColumn[];
    }
  | {
      role: 'officer';
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
