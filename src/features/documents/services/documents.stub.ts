import type {
  DocumentFilterOptions,
  DocumentListQuery,
  DocumentListResult,
  DocumentsApi,
  DocumentTrailEntry,
  FileComment,
  FilePriority,
  FileRecord,
  FileStatus,
  ForwardRecipient,
  Person,
} from '../types/documents.types';

const SIMULATED_LATENCY_MS = 300;
const PAGE_SIZE = 10;
const ROWS_PER_VIEW = 28;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

const PEOPLE: Person[] = [
  {
    name: 'Olivia Rhye',
    email: 'olivia@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Phoenix Baker',
    email: 'phoenix@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Lana Steiner',
    email: 'lana@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Demi Wilkinson',
    email: 'demi@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/women/17.jpg',
  },
  {
    name: 'Candice Wu',
    email: 'candice@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/women/79.jpg',
  },
  {
    name: 'Natali Craig',
    email: 'natali@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/women/26.jpg',
  },
  {
    name: 'Kelechi David Eze',
    email: 'kelechi@gov.org',
    avatarUrl: 'https://randomuser.me/api/portraits/men/36.jpg',
  },
];

const SUBJECTS = [
  'Tesla, Inc.',
  'Match Group, Inc.',
  'Datadog Inc',
  'ARK Genomic Revolution ETF',
  'Square, Inc.',
  'MicroStrategy Inc.',
];

const MODULES = ['Requisitions', 'Offers', 'Appraisals', 'Journal Entries'];
const DEPARTMENTS = ['Registry', 'Legal', 'Finance', 'Procurement', 'ICT'];
const DOCUMENT_TYPES = ['Contract', 'Memo', 'Report', 'Circular', 'Invoice'];
const STATUSES: FileStatus[] = ['processing', 'success', 'declined'];
const PRIORITIES: FilePriority[] = ['important', 'normal', 'urgent'];
const FILE_NOS = ['12/234/A132-25', '12/234/A132-26', '12/234/A133-01'];

/** File IDs mutated via the stub, so reads reflect writes. */
const approvedIds = new Set<string>();
const revisionIds = new Set<string>();
const archivedIds = new Set<string>();
const assignedTo = new Map<string, Person>();
const commentStore = new Map<string, FileComment[]>();

function person(index: number): Person {
  return PEOPLE[index % PEOPLE.length];
}

function people(offset: number, count: number): Person[] {
  return Array.from({ length: count }, (_, i) => person(offset + i));
}

function makeRow(viewIndex: number, rowIndex: number): FileRecord {
  const seed = viewIndex * ROWS_PER_VIEW + rowIndex;
  const id = `file-${viewIndex}-${rowIndex}`;
  return {
    id,
    fileNo: FILE_NOS[seed % FILE_NOS.length],
    subject: SUBJECTS[seed % SUBJECTS.length],
    fileName: `${SUBJECTS[seed % SUBJECTS.length].replace(/[.,]/g, '')}.pdf`,
    fileSizeBytes: 90_000 + seed * 4_713,
    initiatedBy: person(seed),
    attachments: person(seed + 2),
    currentHolder: person(seed + 4),
    description:
      'Consectetur. Tempus aliquam id sagittis ut Lorem ipsum dolor sit amet.',
    reviewers: people(seed, 3),
    assignees: assignedTo.has(id)
      ? [assignedTo.get(id)!, ...people(seed + 1, 2)]
      : people(seed + 1, 3),
    approvedBy: people(seed + 3, 4 + (seed % 4)),
    completionPct: 20 + ((seed * 17) % 80),
    module: MODULES[seed % MODULES.length],
    department: DEPARTMENTS[seed % DEPARTMENTS.length],
    documentType: DOCUMENT_TYPES[seed % DOCUMENT_TYPES.length],
    priority: PRIORITIES[seed % PRIORITIES.length],
    status: approvedIds.has(id)
      ? 'success'
      : revisionIds.has(id)
        ? 'processing'
        : STATUSES[seed % STATUSES.length],
    lastUpdated: `2022-01-${String(6 + (seed % 8)).padStart(2, '0')}`,
    uploadedAt: `2021-12-${String(10 + (seed % 18)).padStart(2, '0')}T07:47:00`,
  };
}

function matchesQuery(row: FileRecord, query: DocumentListQuery): boolean {
  if (archivedIds.has(row.id)) return false;
  const q = (query.query ?? '').trim().toLowerCase();
  if (
    q &&
    !row.fileNo.toLowerCase().includes(q) &&
    !row.subject.toLowerCase().includes(q)
  ) {
    return false;
  }
  if (query.status && row.status !== query.status) return false;
  if (query.department && row.department !== query.department) return false;
  if (query.documentType && row.documentType !== query.documentType) {
    return false;
  }
  if (query.from && row.lastUpdated < query.from) return false;
  if (query.to && row.lastUpdated > query.to) return false;
  return true;
}

const RECIPIENTS: ForwardRecipient[] = [
  {
    id: 'rec-1',
    name: 'Hon. Adebayo Olawale',
    title: 'Regional Director',
    avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: 'rec-2',
    name: 'Mr. Natali Craig',
    title: 'Sec. to EVC',
    avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 'rec-3',
    name: 'Mrs. Halima Yusuf',
    title: 'Director, Legal',
    avatarUrl: 'https://randomuser.me/api/portraits/women/50.jpg',
  },
  {
    id: 'rec-4',
    name: 'Dr. Emeka Obi',
    title: 'Head, Procurement',
    avatarUrl: 'https://randomuser.me/api/portraits/men/11.jpg',
  },
  {
    id: 'rec-5',
    name: 'Ms. Ada Nwosu',
    title: 'Finance Controller',
    avatarUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
  },
];

const FILTER_OPTIONS: DocumentFilterOptions = {
  departments: DEPARTMENTS,
  documentTypes: DOCUMENT_TYPES,
};

const TRAIL_ACTIONS = [
  'File created in Registry',
  'Forwarded for review',
  'Reviewed and noted',
  'Forwarded to current holder',
];

const VIEW_IDS = ['pending', 'in-review', 'processed'] as const;

function findRow(fileId: string): FileRecord | undefined {
  for (const view of VIEW_IDS) {
    const viewIndex = VIEW_IDS.indexOf(view);
    for (let i = 0; i < ROWS_PER_VIEW; i += 1) {
      const row = makeRow(viewIndex, i);
      if (row.id === fileId) return row;
    }
  }
  return undefined;
}

const COMMENT_TEXTS = [
  'The suspect has been located and is currently under surveillance.',
  'The victims in this case have suffered significant financial losses. Were doing everything possible to recover the stolen funds.',
  'Please review the attached affidavit before the next hearing.',
];

function commentsFor(fileId: string): FileComment[] {
  const cached = commentStore.get(fileId);
  if (cached) return cached;
  const seed = Math.abs(
    [...fileId].reduce((sum, ch) => sum + ch.charCodeAt(0), 0),
  );
  const comments = Array.from({ length: 12 }, (_, i) => ({
    id: `comment-${fileId}-${i}`,
    author: person(seed + i),
    createdAt: `2022-08-${String(6 + (i % 12)).padStart(2, '0')}T0${7 + (i % 3)}:47:00`,
    edited: i % 3 === 0,
    text: COMMENT_TEXTS[i % COMMENT_TEXTS.length],
    views: 2 + ((seed + i) % 6),
  }));
  commentStore.set(fileId, comments);
  return comments;
}

/**
 * Development-only document fixtures used when no VITE_API_BASE_URL is
 * configured. Records are generated, not real data.
 */
export const devDocumentsApi: DocumentsApi = {
  async list(query: DocumentListQuery): Promise<DocumentListResult> {
    await delay();
    const viewIndex = ['pending', 'in-review', 'processed'].indexOf(query.view);
    let rows = Array.from({ length: ROWS_PER_VIEW }, (_, i) =>
      makeRow(viewIndex, i),
    );
    if (query.view === 'processed') {
      // Files approved this session move here from their original view.
      const migrated = [...approvedIds]
        .map(findRow)
        .filter((row): row is FileRecord => Boolean(row))
        .filter((row) => !row.id.startsWith(`file-${viewIndex}-`));
      rows = [...rows, ...migrated];
    } else {
      rows = rows.filter((row) => !approvedIds.has(row.id));
    }
    rows = rows.filter((row) => matchesQuery(row, query));

    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const page = Math.min(Math.max(1, query.page), totalPages);
    const items = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return { items, page, totalPages, total: rows.length };
  },

  async listFilterOptions(): Promise<DocumentFilterOptions> {
    await delay();
    return FILTER_OPTIONS;
  },

  async listForwardRecipients(): Promise<ForwardRecipient[]> {
    await delay();
    return RECIPIENTS;
  },

  async getApprovalTrail(fileId: string): Promise<DocumentTrailEntry[]> {
    await delay();
    const seed = Math.abs(
      [...fileId].reduce((sum, ch) => sum + ch.charCodeAt(0), 0),
    );
    return TRAIL_ACTIONS.map((action, step) => ({
      id: `trail-${fileId}-${step}`,
      actor: person(seed + step),
      action,
      timestamp: `2022-01-${String(7 + step).padStart(2, '0')}T0${8 + step}:30:00`,
    }));
  },

  async getFile(fileId: string): Promise<FileRecord> {
    await delay();
    const row = findRow(fileId);
    if (!row) throw new Error(`No such file: ${fileId}`);
    return row;
  },

  async listComments(fileId: string): Promise<FileComment[]> {
    await delay();
    return [...commentsFor(fileId)];
  },

  async addNote(fileId: string, note: string): Promise<void> {
    await delay();
    commentsFor(fileId).unshift({
      id: `comment-${fileId}-new-${Date.now()}`,
      author: PEOPLE[0],
      createdAt: new Date().toISOString(),
      edited: false,
      text: note,
      views: 0,
    });
  },

  async forwardDocument(): Promise<void> {
    await delay();
  },

  async approveFile(fileId: string): Promise<void> {
    await delay();
    approvedIds.add(fileId);
    revisionIds.delete(fileId);
  },

  async approveAllPending(): Promise<void> {
    await delay();
    for (let i = 0; i < ROWS_PER_VIEW; i += 1) {
      approvedIds.add(`file-0-${i}`);
      revisionIds.delete(`file-0-${i}`);
    }
  },

  async requestRevision(fileId: string): Promise<void> {
    await delay();
    revisionIds.add(fileId);
    approvedIds.delete(fileId);
  },

  async assignDocument(fileId: string, staffId: string): Promise<void> {
    await delay();
    const recipient = RECIPIENTS.find((r) => r.id === staffId);
    assignedTo.set(
      fileId,
      recipient
        ? { name: recipient.name, email: '', avatarUrl: recipient.avatarUrl }
        : person(staffId.length),
    );
  },

  async archiveFile(fileId: string): Promise<void> {
    await delay();
    archivedIds.add(fileId);
  },
};
