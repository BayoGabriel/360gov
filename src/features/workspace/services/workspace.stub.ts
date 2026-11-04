import type {
  CreateFolderInput,
  DriveBreadcrumb,
  DriveItem,
  DriveListQuery,
  MailAddress,
  MailMessage,
  MailThreadDetail,
  SendMailInput,
  UploadDriveFileInput,
  WorkspaceAccount,
  WorkspaceApi,
} from '../types/workspace.types';

const SIMULATED_LATENCY_MS = 300;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

const ME: MailAddress = {
  name: 'Kelechi David Eze',
  email: 'kelechi@ministry.gov.ng',
};

const ACCOUNT: WorkspaceAccount = {
  connected: true,
  name: ME.name,
  email: ME.email,
  avatarUrl: 'https://randomuser.me/api/portraits/men/36.jpg',
};

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();
const daysAgo = (d: number) => hoursAgo(d * 24);

let driveSeq = 100;
let mailSeq = 100;

const driveItems: DriveItem[] = [
  { id: 'f-tenders', name: 'Tenders 2026', kind: 'folder', mimeType: 'application/vnd.google-apps.folder', parentId: null, owner: ME.name, modifiedAt: daysAgo(1), sizeBytes: null, starred: true },
  { id: 'f-legal', name: 'Legal & Contracts', kind: 'folder', mimeType: 'application/vnd.google-apps.folder', parentId: null, owner: 'Mrs. Halima Yusuf', modifiedAt: daysAgo(3), sizeBytes: null, starred: false },
  { id: 'f-reports', name: 'Reports', kind: 'folder', mimeType: 'application/vnd.google-apps.folder', parentId: null, owner: ME.name, modifiedAt: daysAgo(6), sizeBytes: null, starred: false },
  {
    id: 'd-plan',
    name: 'Q3 Procurement Plan',
    kind: 'doc',
    mimeType: 'application/vnd.google-apps.document',
    parentId: null,
    owner: ME.name,
    modifiedAt: hoursAgo(5),
    sizeBytes: null,
    starred: true,
    body: 'Q3 PROCUREMENT PLAN — FEDERAL MINISTRY\n\n1. OBJECTIVES\nConsolidate all open tenders for ICT equipment, official vehicles and office refurbishment into a single Q3 cycle to improve bid competitiveness and auditability.\n\n2. PLANNED TENDERS\n- 20-unit laptop supply (ICT Dept) — est. ₦48,000,000\n- Official vehicle lease renewal — est. ₦120,000,000\n- Annex building refurbishment — est. ₦85,500,000\n\n3. TIMELINE\nTender publication: Week 2. Bid evaluation: Weeks 4–6. Awards: Week 7. All contracts to be signed through the platform e-signature flow.\n\n4. COMPLIANCE\nEvery tender requires a minimum of three competitive bids, a documented evaluation trail, and dual sign-off by the Permanent Secretary and Director of Procurement.',
  },
  {
    id: 's-budget',
    name: 'Staffing Budget FY2026',
    kind: 'sheet',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    parentId: null,
    owner: 'Dr. Emeka Obi',
    modifiedAt: daysAgo(2),
    sizeBytes: null,
    starred: false,
    body: 'STAFFING BUDGET FY2026\n\nDepartment              | Headcount | Budget (₦m)\n------------------------|-----------|------------\nAdministration          |    42     |   812.4\nFinance & Accounts      |    28     |   654.1\nICT                     |    19     |   487.9\nProcurement             |    15     |   302.6\nLegal                   |     9     |   198.3\n------------------------|-----------|------------\nTOTAL                   |   113     | 2,455.3\n\nNotes: Figures include salaries, allowances and training budget. ICT line includes 4 contract engineers pending regularisation.',
  },
  { id: 'p-circular', name: 'Circular 12-2026 — Records Digitisation.pdf', kind: 'pdf', mimeType: 'application/pdf', parentId: null, owner: 'Office of the PS', modifiedAt: daysAgo(9), sizeBytes: 412_300, starred: false },
  { id: 'd-template', name: 'Standard Contract Agreement — Template', kind: 'doc', mimeType: 'application/vnd.google-apps.document', parentId: 'f-legal', owner: 'Mrs. Halima Yusuf', modifiedAt: daysAgo(4), sizeBytes: null, starred: false, body: 'STANDARD CONTRACT AGREEMENT\n\nTHIS AGREEMENT is made between the Federal Ministry (the "Ministry") and the Vendor named in Schedule A.\n\n1. SCOPE OF WORKS — As detailed in the tender reference and awarded bid.\n2. CONSIDERATION — Payment in accordance with the milestones in Schedule B.\n3. TERM — From the date of last signature until completion of deliverables.\n4. SIGNATURES — Executed electronically through the platform signing workflow; each signature is recorded in the contract activity trail.' },
  { id: 'p-award', name: 'Award Letter — Northgate Supplies.pdf', kind: 'pdf', mimeType: 'application/pdf', parentId: 'f-legal', owner: 'Mrs. Halima Yusuf', modifiedAt: daysAgo(12), sizeBytes: 98_200, starred: true },
  { id: 'd-tor', name: 'Terms of Reference — Vehicle Lease', kind: 'doc', mimeType: 'application/vnd.google-apps.document', parentId: 'f-tenders', owner: ME.name, modifiedAt: hoursAgo(30), sizeBytes: null, starred: false, body: 'TERMS OF REFERENCE — OFFICIAL VEHICLE LEASE\n\nThe Ministry invites bids for the lease of 12 official vehicles for a 24-month term.\n\nREQUIREMENTS\n- Vehicles must be 2024 model year or newer\n- Comprehensive insurance and maintenance included\n- Monthly reporting on mileage and condition\n\nSUBMISSION\nAll bids through the Procurement portal. Deadline as published on the tender notice.' },
  { id: 's-bids', name: 'Bid Register — Vehicle Lease', kind: 'sheet', mimeType: 'application/vnd.google-apps.spreadsheet', parentId: 'f-tenders', owner: 'Dr. Emeka Obi', modifiedAt: hoursAgo(8), sizeBytes: null, starred: false, body: 'BID REGISTER — OFFICIAL VEHICLE LEASE\n\nBidder                 | Submitted   | Amount (₦m) | Status\n-----------------------|-------------|-------------|---------\nAutoFleet NG Ltd       | 2026-10-21  |   118.2     | Under review\nLagos Motors Plc       | 2026-10-23  |   121.7     | Under review\nCapital Drive Ltd      | 2026-10-24  |   114.9     | Shortlisted\nTransNigeria Leasing   | 2026-10-25  |   126.4     | Received' },
  { id: 'i-org', name: 'Ministry Organigram.png', kind: 'image', mimeType: 'image/png', parentId: null, owner: 'ICT Dept', modifiedAt: daysAgo(20), sizeBytes: 1_240_000, starred: false },
  { id: 'p-audit', name: 'Q2 Audit Report.pdf', kind: 'pdf', mimeType: 'application/pdf', parentId: 'f-reports', owner: 'Audit Unit', modifiedAt: daysAgo(15), sizeBytes: 2_830_000, starred: true },
  { id: 's-roster', name: 'Duty Roster — November', kind: 'sheet', mimeType: 'application/vnd.google-apps.spreadsheet', parentId: 'f-reports', owner: ME.name, modifiedAt: daysAgo(1), sizeBytes: null, starred: false, body: 'DUTY ROSTER — NOVEMBER 2026\n\nWeek | Desk Officer     | Supervising Officer\n-----|------------------|--------------------\n 1   | A. Danjuma       | Mrs. H. Yusuf\n 2   | B. Okafor        | Dr. E. Obi\n 3   | C. Bello         | K. Eze\n 4   | D. Musa          | Mrs. H. Yusuf' },
];

const threads: MailThreadDetail[] = [
  {
    id: 't-award',
    subject: 'RE: Contract award — Northgate Supplies',
    snippet: 'We confirm receipt of the award letter and will return the signed copy…',
    from: { name: 'Northgate Supplies Ltd', email: 'bids@northgatesupplies.ng' },
    unread: true,
    starred: true,
    updatedAt: hoursAgo(3),
    messageCount: 3,
    messages: [
      { id: 'm-1', from: ME, to: [{ name: 'Northgate Supplies Ltd', email: 'bids@northgatesupplies.ng' }], sentAt: daysAgo(1), body: 'Dear Sir/Madam,\n\nFollowing the evaluation of bids for tender ref FMW/TDR/2026/014, the Ministry is pleased to notify Northgate Supplies Ltd of its award of the contract.\n\nPlease find the award letter attached in the shared Drive folder and return a countersigned copy within five working days.\n\nRegards,\nKelechi Eze\nProcurement Unit' },
      { id: 'm-2', from: { name: 'Northgate Supplies Ltd', email: 'bids@northgatesupplies.ng' }, to: [ME], sentAt: hoursAgo(20), body: 'Dear Mr. Eze,\n\nThank you for the notification. We confirm receipt of the award letter and will return the signed copy through the platform signing workflow before Friday.\n\nKind regards,\nAdaeze Nwosu\nContracts Manager, Northgate Supplies' },
      { id: 'm-3', from: { name: 'Northgate Supplies Ltd', email: 'bids@northgatesupplies.ng' }, to: [ME], sentAt: hoursAgo(3), body: 'Dear Mr. Eze,\n\nOne clarification: Schedule B lists milestone 2 payment at 30 days after delivery. Our proposal stated 21 days. Could this be corrected before signature?\n\nRegards,\nAdaeze' },
    ],
  },
  {
    id: 't-ps',
    subject: 'Q3 procurement plan — PS approval requested',
    snippet: 'Please review the consolidated plan before Thursday\'s management meeting…',
    from: { name: 'Mrs. Halima Yusuf', email: 'halima.yusuf@ministry.gov.ng' },
    unread: true,
    starred: false,
    updatedAt: hoursAgo(7),
    messageCount: 1,
    messages: [
      { id: 'm-4', from: { name: 'Mrs. Halima Yusuf', email: 'halima.yusuf@ministry.gov.ng' }, to: [ME], sentAt: hoursAgo(7), body: 'Kelechi,\n\nPlease review the consolidated Q3 procurement plan in Drive before Thursday\'s management meeting. The PS wants the ICT tender prioritised and all three tenders published together.\n\nAlso confirm the evaluation committee list is final.\n\nH.Y.' },
    ],
  },
  {
    id: 't-vendor',
    subject: 'Tender FMW/TDR/2026/017 — Submission deadline enquiry',
    snippet: 'We would like to confirm whether the deadline has been extended…',
    from: { name: 'AutoFleet NG Ltd', email: 'tenders@autofleet.ng' },
    unread: false,
    starred: false,
    updatedAt: daysAgo(1),
    messageCount: 2,
    messages: [
      { id: 'm-5', from: { name: 'AutoFleet NG Ltd', email: 'tenders@autofleet.ng' }, to: [ME], sentAt: daysAgo(2), body: 'Good day,\n\nWe would like to confirm whether the deadline for the official vehicle lease tender has been extended, as indicated in the addendum published last week.\n\nThank you,\nAutoFleet Tenders Team' },
      { id: 'm-6', from: ME, to: [{ name: 'AutoFleet NG Ltd', email: 'tenders@autofleet.ng' }], sentAt: daysAgo(1), body: 'Dear Team,\n\nYes — the deadline was extended by one week per Addendum 1 published on the tender page. All bids must still be submitted through the procurement portal.\n\nRegards,\nKelechi Eze' },
    ],
  },
  {
    id: 't-audit',
    subject: 'Q2 audit findings — procurement records',
    snippet: 'The audit team requires the complete bid register for…',
    from: { name: 'Audit Unit', email: 'audit@ministry.gov.ng' },
    unread: false,
    starred: true,
    updatedAt: daysAgo(3),
    messageCount: 1,
    messages: [
      { id: 'm-7', from: { name: 'Audit Unit', email: 'audit@ministry.gov.ng' }, to: [ME], sentAt: daysAgo(3), body: 'Dear Mr. Eze,\n\nAs part of the Q2 audit, the team requires the complete bid register for the vehicle lease tender plus the evaluation committee minutes. Both are expected to be in the shared Drive — please confirm access.\n\nRegards,\nInternal Audit' },
    ],
  },
  {
    id: 't-ict',
    subject: 'Drive access request — Legal department folder',
    snippet: 'Requesting edit access for two legal officers on the contracts template…',
    from: { name: 'ICT Service Desk', email: 'ict.support@ministry.gov.ng' },
    unread: false,
    starred: false,
    updatedAt: daysAgo(5),
    messageCount: 1,
    messages: [
      { id: 'm-8', from: { name: 'ICT Service Desk', email: 'ict.support@ministry.gov.ng' }, to: [ME], sentAt: daysAgo(5), body: 'Hi Kelechi,\n\nLegal has requested edit access for two officers on the Standard Contract Agreement template in the Legal & Contracts folder. Please confirm approval and we will update permissions.\n\nICT Service Desk' },
    ],
  },
];

export const devWorkspaceApi: WorkspaceApi = {
  async getAccount() {
    await delay();
    return ACCOUNT;
  },

  async listDriveItems({ parentId, query }: DriveListQuery) {
    await delay();
    const q = query?.trim().toLowerCase();
    if (q) {
      return driveItems.filter(
        (item) => item.kind !== 'folder' || item.parentId === parentId,
      ).filter((item) => item.name.toLowerCase().includes(q));
    }
    return driveItems
      .filter((item) => item.parentId === parentId)
      .sort((a, b) =>
        a.kind === 'folder' && b.kind !== 'folder'
          ? -1
          : b.kind === 'folder' && a.kind !== 'folder'
            ? 1
            : a.name.localeCompare(b.name),
      );
  },

  async getDriveItem(itemId: string) {
    await delay();
    const item = driveItems.find((i) => i.id === itemId);
    if (!item) throw new Error('File not found');
    return item;
  },

  async getDriveBreadcrumbs(folderId: string | null) {
    await delay();
    const crumbs: DriveBreadcrumb[] = [{ id: null, name: 'My Drive' }];
    let current = folderId;
    const chain: DriveBreadcrumb[] = [];
    while (current) {
      const item = driveItems.find((i) => i.id === current);
      if (!item) break;
      chain.unshift({ id: item.id, name: item.name });
      current = item.parentId;
    }
    return [...crumbs, ...chain];
  },

  async createFolder({ parentId, name }: CreateFolderInput) {
    await delay();
    const folder: DriveItem = {
      id: `f-${driveSeq++}`,
      name,
      kind: 'folder',
      mimeType: 'application/vnd.google-apps.folder',
      parentId,
      owner: ME.name,
      modifiedAt: new Date().toISOString(),
      sizeBytes: null,
      starred: false,
    };
    driveItems.push(folder);
    return folder;
  },

  async uploadFile({ parentId, file }: UploadDriveFileInput) {
    await delay();
    const ext = file.name.toLowerCase();
    const kind: DriveItem['kind'] = ext.endsWith('.pdf')
      ? 'pdf'
      : /\.(png|jpe?g|gif|webp)$/.test(ext)
        ? 'image'
        : /\.(xlsx?|csv)$/.test(ext)
          ? 'sheet'
          : /\.(docx?|txt)$/.test(ext)
            ? 'doc'
            : 'file';
    const item: DriveItem = {
      id: `d-${driveSeq++}`,
      name: file.name,
      kind,
      mimeType: file.type || 'application/octet-stream',
      parentId,
      owner: ME.name,
      modifiedAt: new Date().toISOString(),
      sizeBytes: file.size,
      starred: false,
    };
    driveItems.push(item);
    return item;
  },

  async toggleDriveStar(itemId: string) {
    await delay();
    const item = driveItems.find((i) => i.id === itemId);
    if (item) item.starred = !item.starred;
  },

  async listMailThreads() {
    await delay();
    return threads
      .map((detail) => {
        const { messages, ...thread } = detail;
        void messages;
        return thread;
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async getMailThread(threadId: string) {
    await delay();
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) throw new Error('Thread not found');
    return thread;
  },

  async markThreadRead(threadId: string) {
    await delay();
    const thread = threads.find((t) => t.id === threadId);
    if (thread) thread.unread = false;
  },

  async toggleMailStar(threadId: string) {
    await delay();
    const thread = threads.find((t) => t.id === threadId);
    if (thread) thread.starred = !thread.starred;
  },

  async sendMail(input: SendMailInput) {
    await delay();
    const message: MailMessage = {
      id: `m-${mailSeq++}`,
      from: ME,
      to: [{ name: input.to, email: input.to }],
      sentAt: new Date().toISOString(),
      body: input.body,
    };
    if (input.threadId) {
      const thread = threads.find((t) => t.id === input.threadId);
      if (thread) {
        thread.messages.push(message);
        thread.messageCount = thread.messages.length;
        thread.updatedAt = message.sentAt;
        thread.snippet = input.body.slice(0, 80);
      }
    } else {
      threads.unshift({
        id: `t-${mailSeq++}`,
        subject: input.subject,
        snippet: input.body.slice(0, 80),
        from: ME,
        unread: false,
        starred: false,
        updatedAt: message.sentAt,
        messageCount: 1,
        messages: [message],
      });
    }
    return message;
  },
};
