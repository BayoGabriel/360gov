export type DriveItemKind =
  | 'folder'
  | 'doc'
  | 'sheet'
  | 'pdf'
  | 'image'
  | 'file';

export interface DriveItem {
  id: string;
  name: string;
  kind: DriveItemKind;
  mimeType: string;
  parentId: string | null;
  owner: string;
  modifiedAt: string;
  sizeBytes: number | null;
  starred: boolean;
  /**
   * Google embed URL supplied by the backend in production
   * (docs.google.com/document|spreadsheets .../preview). Absent in the dev
   * stub — the viewer renders `body` as a simulated document instead.
   */
  embedUrl?: string;
  /** Dev-stub-only document body rendered by the simulated viewer. */
  body?: string;
}

export interface DriveBreadcrumb {
  id: string | null;
  name: string;
}

export interface MailAddress {
  name: string;
  email: string;
}

export interface MailMessage {
  id: string;
  from: MailAddress;
  to: MailAddress[];
  sentAt: string;
  body: string;
}

export interface MailThread {
  id: string;
  subject: string;
  snippet: string;
  from: MailAddress;
  unread: boolean;
  starred: boolean;
  updatedAt: string;
  messageCount: number;
}

export interface MailThreadDetail extends MailThread {
  messages: MailMessage[];
}

export interface WorkspaceAccount {
  connected: boolean;
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export interface DriveListQuery {
  parentId: string | null;
  query?: string;
  signal?: AbortSignal;
}

export interface SendMailInput {
  threadId?: string;
  to: string;
  subject: string;
  body: string;
}

export interface CreateFolderInput {
  parentId: string | null;
  name: string;
}

export interface UploadDriveFileInput {
  parentId: string | null;
  file: File;
}

export interface WorkspaceApi {
  getAccount(signal?: AbortSignal): Promise<WorkspaceAccount>;
  listDriveItems(query: DriveListQuery): Promise<DriveItem[]>;
  getDriveItem(itemId: string, signal?: AbortSignal): Promise<DriveItem>;
  getDriveBreadcrumbs(
    folderId: string | null,
    signal?: AbortSignal,
  ): Promise<DriveBreadcrumb[]>;
  createFolder(input: CreateFolderInput): Promise<DriveItem>;
  uploadFile(input: UploadDriveFileInput): Promise<DriveItem>;
  toggleDriveStar(itemId: string): Promise<void>;
  listMailThreads(signal?: AbortSignal): Promise<MailThread[]>;
  getMailThread(threadId: string, signal?: AbortSignal): Promise<MailThreadDetail>;
  markThreadRead(threadId: string): Promise<void>;
  toggleMailStar(threadId: string): Promise<void>;
  sendMail(input: SendMailInput): Promise<MailMessage>;
}
