import type {
  MemoDetail,
  MemoListQuery,
  MemoListResult,
  MemoMessage,
  MemosApi,
  MemoStatus,
  MemoSummary,
  Person,
} from '../types/memos.types';

const SIMULATED_LATENCY_MS = 300;
const PAGE_SIZE = 20;
const MEMO_COUNT = 200;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

const PEOPLE: Person[] = [
  {
    name: 'Olivia Rhye',
    email: 'olivia@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    online: true,
  },
  {
    name: 'Phoenix Baker',
    email: 'phoenix@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    online: true,
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
    online: true,
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
];

const SUBJECTS = [
  'Tesla, Inc.',
  'Match Group, Inc.',
  'Datadog Inc',
  'ARK Genomic Revolution ETF',
  'Square, Inc.',
  'MicroStrategy Inc.',
];

const STATUSES: MemoStatus[] = ['processing', 'success', 'declined'];
const FILE_NOS = ['12/234/A132-25', '12/234/A132-26', '12/234/A133-01'];

function person(index: number): Person {
  return PEOPLE[index % PEOPLE.length];
}

function makeMemo(index: number): MemoSummary {
  return {
    id: `memo-${index}`,
    fileNo: FILE_NOS[index % FILE_NOS.length],
    subject: SUBJECTS[index % SUBJECTS.length],
    sender: person(index),
    status: STATUSES[index % STATUSES.length],
    date: `2022-01-${String(13 - (index % 8)).padStart(2, '0')}`,
  };
}

const MEMOS: MemoSummary[] = Array.from({ length: MEMO_COUNT }, (_, i) =>
  makeMemo(i),
);

const MESSAGE_POOL = [
  'Good timing — was just looking at this.',
  'Hey Olivia, can you please review the latest design when you can?',
  'The file has been updated with the requested corrections.',
  'Please confirm receipt before end of day.',
];

function seedOf(memoId: string): number {
  return Math.abs(
    [...memoId].reduce((sum, ch) => sum + ch.charCodeAt(0), 0),
  );
}

function matchesQuery(memo: MemoSummary, query: MemoListQuery): boolean {
  const q = (query.query ?? '').trim().toLowerCase();
  if (
    q &&
    !memo.fileNo.toLowerCase().includes(q) &&
    !memo.subject.toLowerCase().includes(q) &&
    !memo.sender.name.toLowerCase().includes(q)
  ) {
    return false;
  }
  if (query.status && memo.status !== query.status) return false;
  if (query.from && memo.date < query.from) return false;
  if (query.to && memo.date > query.to) return false;
  return true;
}

/** In-memory sent messages so the conversation reflects posted replies. */
const sentMessages = new Map<string, MemoMessage[]>();

/**
 * Development-only memo fixtures used when no VITE_API_BASE_URL is
 * configured. Records are generated, not real data.
 */
export const devMemosApi: MemosApi = {
  async list(query: MemoListQuery): Promise<MemoListResult> {
    await delay();
    const rows = MEMOS.filter((memo) => matchesQuery(memo, query)).sort(
      (a, b) =>
        query.sort === 'date-asc'
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date),
    );

    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const page = Math.min(Math.max(1, query.page), totalPages);
    const items = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return { items, page, totalPages, total: rows.length };
  },

  async getMemo(memoId: string): Promise<MemoDetail | null> {
    await delay();
    const memo = MEMOS.find((m) => m.id === memoId);
    if (!memo) return null;
    const seed = seedOf(memoId);
    return {
      id: memo.id,
      fileNo: memo.fileNo,
      subject: memo.subject,
      participants: [memo.sender, person(seed + 3)],
    };
  },

  async listMessages(memoId: string): Promise<MemoMessage[]> {
    await delay();
    const seed = seedOf(memoId);
    const base: MemoMessage[] = [
      {
        id: `${memoId}-m1`,
        author: person(seed + 3),
        isOwn: false,
        body: MESSAGE_POOL[seed % MESSAGE_POOL.length],
        sentAt: '2022-01-06T11:44:00',
      },
      {
        id: `${memoId}-m2`,
        author: person(seed + 1),
        isOwn: false,
        body: MESSAGE_POOL[(seed + 1) % MESSAGE_POOL.length],
        sentAt: '2022-01-13T14:20:00',
      },
      {
        id: `${memoId}-m3`,
        author: person(seed),
        isOwn: true,
        body: "Sure thing, I'll have a look today.",
        sentAt: '2022-01-13T14:20:00',
      },
    ];
    return [...base, ...(sentMessages.get(memoId) ?? [])];
  },

  async sendMessage(memoId: string, body: string): Promise<MemoMessage> {
    await delay();
    const message: MemoMessage = {
      id: `${memoId}-sent-${(sentMessages.get(memoId)?.length ?? 0) + 1}`,
      author: { name: 'You', email: '' },
      isOwn: true,
      body,
      sentAt: new Date().toISOString(),
    };
    sentMessages.set(memoId, [...(sentMessages.get(memoId) ?? []), message]);
    return message;
  },
};
