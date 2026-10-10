export type MemoStatus = 'processing' | 'success' | 'declined';

export type MemoSort = 'date-asc' | 'date-desc';

export interface Person {
  name: string;
  email: string;
  avatarUrl?: string;
  online?: boolean;
}

export interface MemoSummary {
  id: string;
  fileNo: string;
  subject: string;
  sender: Person;
  status: MemoStatus;
  /** ISO 8601 date of the latest memo activity. */
  date: string;
}

export interface MemoDetail {
  id: string;
  fileNo: string;
  subject: string;
  participants: Person[];
}

export interface MemoMessage {
  id: string;
  author: Person;
  /** True when the current user authored the message. */
  isOwn: boolean;
  body: string;
  /** ISO 8601 timestamp. */
  sentAt: string;
}

export interface MemoListQuery {
  page: number;
  sort: MemoSort;
  query?: string;
  status?: MemoStatus;
  /** ISO date (yyyy-mm-dd) bounds on date. */
  from?: string;
  to?: string;
  signal?: AbortSignal;
}

export interface MemoListResult {
  items: MemoSummary[];
  page: number;
  totalPages: number;
  total: number;
}

export interface MemosApi {
  list(query: MemoListQuery): Promise<MemoListResult>;
  getMemo(memoId: string, signal?: AbortSignal): Promise<MemoDetail | null>;
  listMessages(
    memoId: string,
    signal?: AbortSignal,
  ): Promise<MemoMessage[]>;
  sendMessage(memoId: string, body: string): Promise<MemoMessage>;
}
