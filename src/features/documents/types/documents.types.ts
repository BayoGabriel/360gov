export type DocumentView = 'pending' | 'in-review' | 'processed';

export type FileStatus = 'processing' | 'success' | 'declined';

export type FilePriority = 'urgent' | 'important' | 'normal';

export interface Person {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface FileRecord {
  id: string;
  fileNo: string;
  subject: string;
  fileName: string;
  fileSizeBytes: number;
  initiatedBy: Person;
  attachments: Person;
  currentHolder: Person;
  description: string;
  reviewers: Person[];
  assignees: Person[];
  completionPct: number;
  module: string;
  department: string;
  documentType: string;
  /** People who approved the file, latest last. */
  approvedBy: Person[];
  priority: FilePriority;
  status: FileStatus;
  /** ISO 8601 date. */
  lastUpdated: string;
  /** ISO 8601 timestamp of the original upload. */
  uploadedAt: string;
}

export interface FileComment {
  id: string;
  author: Person;
  /** ISO 8601 timestamp. */
  createdAt: string;
  edited: boolean;
  text: string;
  /** Times the comment was viewed, per the mock. */
  views: number;
}

export type DocumentAction =
  | 'view'
  | 'trail'
  | 'note'
  | 'assign'
  | 'forward'
  | 'revision'
  | 'approve';

export interface DocumentTrailEntry {
  id: string;
  actor: Person;
  action: string;
  /** ISO 8601 timestamp. */
  timestamp: string;
}

/** Viewport-relative position of the element a row menu is anchored to. */
export interface MenuAnchor {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface ForwardRecipient {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
}

export interface DocumentFilterOptions {
  departments: string[];
  documentTypes: string[];
}

export interface DocumentListQuery {
  view: DocumentView;
  page: number;
  query?: string;
  status?: FileStatus;
  department?: string;
  documentType?: string;
  /** ISO date (yyyy-mm-dd) bounds on lastUpdated. */
  from?: string;
  to?: string;
  signal?: AbortSignal;
}

export interface DocumentListResult {
  items: FileRecord[];
  page: number;
  totalPages: number;
  total: number;
}

export interface DocumentsApi {
  list(query: DocumentListQuery): Promise<DocumentListResult>;
  getFile(fileId: string, signal?: AbortSignal): Promise<FileRecord>;
  listComments(
    fileId: string,
    signal?: AbortSignal,
  ): Promise<FileComment[]>;
  listFilterOptions(signal?: AbortSignal): Promise<DocumentFilterOptions>;
  listForwardRecipients(signal?: AbortSignal): Promise<ForwardRecipient[]>;
  getApprovalTrail(
    fileId: string,
    signal?: AbortSignal,
  ): Promise<DocumentTrailEntry[]>;
  addNote(fileId: string, note: string): Promise<void>;
  forwardDocument(fileId: string, recipientIds: string[]): Promise<void>;
  approveFile(fileId: string): Promise<void>;
  approveAllPending(): Promise<void>;
  requestRevision(
    fileId: string,
    staffId?: string,
    note?: string,
  ): Promise<void>;
  assignDocument(fileId: string, staffId: string): Promise<void>;
  archiveFile(fileId: string): Promise<void>;
}
