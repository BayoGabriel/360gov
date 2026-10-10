import type {
  Bid,
  BidDocument,
  BidStatus,
  Contract,
  ContractActivity,
  ContractCategory,
  ContractDocument,
  ContractFilterOptions,
  ContractListQuery,
  ContractListResult,
  ContractMessage,
  ContractStatus,
  CreateContractInput,
  Person,
  ProcurementApi,
  ProcurementMethod,
  SignaturePartyRole,
  UploadDocumentInput,
  VendorProfile,
} from '../types/procurement.types';

const SIMULATED_LATENCY_MS = 300;
const PAGE_SIZE = 8;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

/** The officer the dev "backend" attributes your actions to. */
const CURRENT_OFFICER: Person = {
  name: 'Kelechi David Eze',
  email: 'kelechi@gov.org',
  avatarUrl: 'https://randomuser.me/api/portraits/men/36.jpg',
};

const OFFICERS: Person[] = [
  CURRENT_OFFICER,
  {
    name: 'Mrs. Halima Yusuf',
    email: 'halima.yusuf@gov.org',
    avatarUrl: 'https://randomuser.me/api/portraits/women/50.jpg',
  },
  {
    name: 'Dr. Emeka Obi',
    email: 'emeka.obi@gov.org',
    avatarUrl: 'https://randomuser.me/api/portraits/men/11.jpg',
  },
];

const VENDORS: VendorProfile[] = [
  {
    companyName: 'Julius Berger Nigeria Plc',
    registrationNo: 'RC-000439',
    contactName: 'Tobias Merz',
    email: 'bids@juliusberger.ng',
    phone: '+234 803 555 0142',
    avatarUrl: 'https://randomuser.me/api/portraits/men/52.jpg',
  },
  {
    companyName: 'Dangote Industries Ltd',
    registrationNo: 'RC-011762',
    contactName: 'Amina Bello',
    email: 'tenders@dangote-ind.ng',
    phone: '+234 809 555 0177',
    avatarUrl: 'https://randomuser.me/api/portraits/women/21.jpg',
  },
  {
    companyName: 'Chagoury Construction Group',
    registrationNo: 'RC-204118',
    contactName: 'Ronald Chagoury',
    email: 'procurement@chagoury.com',
    avatarUrl: 'https://randomuser.me/api/portraits/men/64.jpg',
  },
  {
    companyName: 'SystemSpecs Technology Ltd',
    registrationNo: 'RC-309882',
    contactName: 'Demola Adegbite',
    email: 'bids@systemspecs.com.ng',
    phone: '+234 701 555 0193',
    avatarUrl: 'https://randomuser.me/api/portraits/men/29.jpg',
  },
  {
    companyName: 'BUA Foods Plc',
    registrationNo: 'RC-117204',
    contactName: 'Fatima Sani',
    email: 'supplies@buafoods.com',
    avatarUrl: 'https://randomuser.me/api/portraits/women/63.jpg',
  },
  {
    companyName: 'Nigerite Building Systems',
    registrationNo: 'RC-088311',
    contactName: 'Chinedu Okafor',
    email: 'sales@nigerite.ng',
    avatarUrl: 'https://randomuser.me/api/portraits/men/76.jpg',
  },
];

const CATEGORIES: ContractCategory[] = [
  'goods',
  'works',
  'services',
  'consultancy',
];
const METHODS: ProcurementMethod[] = [
  'open-tender',
  'selective-tender',
  'direct-procurement',
  'request-for-quotation',
];
const DEPARTMENTS = [
  'Procurement Department',
  'ICT Department',
  'Planning & Research Department',
  'Administration Department',
];

interface SeedSpec {
  title: string;
  description: string;
  category: ContractCategory;
  method: ProcurementMethod;
  budget: number;
  items: [string, number, string][];
  status: ContractStatus;
  bidCount: number;
}

const SEEDS: SeedSpec[] = [
  {
    title: 'Supply of 1,200 Office Workstations',
    description:
      'Supply, delivery and installation of ergonomic office workstations across the ministry headquarters. Items must meet SON industrial standards and include a 24-month warranty.',
    category: 'goods',
    method: 'open-tender',
    budget: 145_000_000,
    items: [
      ['Ergonomic workstation desk (1.6m)', 1200, 'pcs'],
      ['High-back swivel chair', 1200, 'pcs'],
      ['Under-desk pedestal drawer', 1200, 'pcs'],
    ],
    status: 'open',
    bidCount: 4,
  },
  {
    title: 'Renovation of Block C Conference Wing',
    description:
      'Renovation of the third-floor conference wing including partitioning, HVAC replacement, electrical rewiring and acoustic panel installation. Site inspection is mandatory before bidding.',
    category: 'works',
    method: 'open-tender',
    budget: 380_000_000,
    items: [
      ['Demolition and partitioning', 1, 'lot'],
      ['HVAC system supply & install', 6, 'units'],
      ['Acoustic wall panels', 240, 'sqm'],
      ['Electrical rewiring', 1, 'lot'],
    ],
    status: 'open',
    bidCount: 5,
  },
  {
    title: 'Enterprise Records Digitisation Project',
    description:
      'Scanning, indexing and archival of 2.4 million pages of legacy registry files into the central document management system. Includes on-site scanning equipment and trained operators for 9 months.',
    category: 'services',
    method: 'selective-tender',
    budget: 210_000_000,
    items: [
      ['Document scanning & indexing', 2_400_000, 'pages'],
      ['Metadata tagging & QA', 2_400_000, 'pages'],
      ['Project management', 9, 'months'],
    ],
    status: 'evaluation',
    bidCount: 3,
  },
  {
    title: 'Procurement of 40 Utility Vehicles',
    description:
      'Supply of forty (40) mid-size utility vehicles for field operations, delivered with full registration, insurance and 3-year service packages.',
    category: 'goods',
    method: 'open-tender',
    budget: 1_600_000_000,
    items: [['Mid-size utility vehicle', 40, 'units']],
    status: 'evaluation',
    bidCount: 4,
  },
  {
    title: 'Data Centre Cooling Upgrade',
    description:
      'Upgrade of the ministry data centre cooling infrastructure to N+1 redundancy, including precision air-conditioning units, containment systems and environmental monitoring.',
    category: 'works',
    method: 'selective-tender',
    budget: 520_000_000,
    items: [
      ['Precision AC units (60kW)', 4, 'units'],
      ['Hot-aisle containment', 1, 'lot'],
      ['Environmental monitoring system', 1, 'lot'],
    ],
    status: 'awarded',
    bidCount: 4,
  },
  {
    title: 'Independent Audit of Capital Projects FY2025',
    description:
      'Engagement of an external consultancy firm to conduct a value-for-money audit of all capital projects executed in FY2025, with a final report to the Public Accounts Committee.',
    category: 'consultancy',
    method: 'selective-tender',
    budget: 95_000_000,
    items: [
      ['Project audit fieldwork', 1, 'lot'],
      ['Draft & final audit reports', 2, 'reports'],
    ],
    status: 'awarded',
    bidCount: 3,
  },
  {
    title: 'Nationwide Staff Verification Exercise',
    description:
      'Biometric capture and payroll verification for 18,000 staff across all 36 states. Consultants must supply enrolment kits, supervisors and a secure verification portal.',
    category: 'consultancy',
    method: 'open-tender',
    budget: 840_000_000,
    items: [
      ['Biometric enrolment', 18_000, 'staff'],
      ['Verification portal hosting', 12, 'months'],
    ],
    status: 'open',
    bidCount: 2,
  },
  {
    title: 'Supply of Medical Consumables (Q1)',
    description:
      'Quarterly supply of medical consumables to the ministry clinic including PPE, diagnostics and first-aid supplies in line with the approved drug list.',
    category: 'goods',
    method: 'request-for-quotation',
    budget: 28_500_000,
    items: [
      ['Examination gloves (boxes)', 800, 'boxes'],
      ['Rapid diagnostic kits', 450, 'kits'],
      ['First-aid supplies', 1, 'lot'],
    ],
    status: 'draft',
    bidCount: 0,
  },
  {
    title: 'Construction of Perimeter Fence & Gatehouse',
    description:
      'Construction of a 640m reinforced perimeter fence, two gatehouses and associated drainage works at the ministry annex.',
    category: 'works',
    method: 'open-tender',
    budget: 460_000_000,
    items: [
      ['Reinforced perimeter fence', 640, 'm'],
      ['Gatehouse construction', 2, 'units'],
      ['Drainage works', 1, 'lot'],
    ],
    status: 'evaluation',
    bidCount: 5,
  },
  {
    title: 'Catering Services for Ministerial Events',
    description:
      'Framework agreement for catering services covering ministerial conferences, retreats and official functions for a 12-month period.',
    category: 'services',
    method: 'request-for-quotation',
    budget: 36_000_000,
    items: [['Event catering (per head)', 4000, 'covers']],
    status: 'completed',
    bidCount: 3,
  },
  {
    title: 'ICT Service Desk Outsourcing',
    description:
      'Outsourcing of the ministry ICT service desk for 24 months: 8 support staff, ticket management and quarterly service reviews.',
    category: 'services',
    method: 'open-tender',
    budget: 180_000_000,
    items: [
      ['Service desk agents', 8, 'staff'],
      ['Contract duration', 24, 'months'],
    ],
    status: 'completed',
    bidCount: 4,
  },
  {
    title: 'Supply of Printing Press Consumables',
    description:
      'Supply of inks, plates and photographic paper for the government printing press for the second half of the year.',
    category: 'goods',
    method: 'direct-procurement',
    budget: 52_000_000,
    items: [
      ['Offset printing ink', 1200, 'kg'],
      ['CTP plates', 600, 'plates'],
      ['Photographic paper rolls', 300, 'rolls'],
    ],
    status: 'cancelled',
    bidCount: 1,
  },
];

const COVER_LETTERS = [
  'We confirm our capacity to deliver within the stipulated timeline and have attached our company profile, tax clearance and similar project references.',
  'Our bid is accompanied by evidence of three comparable contracts completed in the last five years and our audited financial statements.',
  'We have reviewed the bill of quantities and confirm our pricing covers supply, delivery, installation and warranty obligations.',
  'Kindly find enclosed our technical and financial proposals submitted in line with the tender requirements.',
];

const BID_DOC_NAMES = [
  'Company Profile.pdf',
  'CAC Registration.pdf',
  'Tax Clearance 2025.pdf',
  'Technical Proposal.pdf',
  'Financial Proposal.pdf',
  'Project References.pdf',
];

const MESSAGE_BODIES = [
  'Good afternoon, kindly confirm whether the site inspection is mandatory for all bidders.',
  'Please clarify if the warranty period covers spare parts replacement.',
  'Our technical proposal has been updated to reflect the addendum published last week.',
  'Can the submission deadline be extended by one week?',
  'We confirm receipt of your clarification. Our final offer remains as submitted.',
];

const contractStore = new Map<string, Contract>();
const bidStore = new Map<string, Bid[]>();
const messageStore = new Map<string, ContractMessage[]>();
const activityStore = new Map<string, ContractActivity[]>();
let contractCounter = 0;

function iso(daysAgo: number, hour = 9): string {
  const date = new Date(Date.now() - daysAgo * 86_400_000);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
}

function isoDate(daysFromNow: number): string {
  return new Date(Date.now() + daysFromNow * 86_400_000)
    .toISOString()
    .slice(0, 10);
}

function messageKey(contractId: string, bidId: string): string {
  return `${contractId}/${bidId}`;
}

function logActivity(
  contractId: string,
  action: string,
  detail?: string,
  at?: string,
): void {
  const list = activityStore.get(contractId) ?? [];
  list.push({
    id: `act-${contractId}-${list.length}-${Date.now()}`,
    actor: CURRENT_OFFICER,
    action,
    detail,
    timestamp: at ?? new Date().toISOString(),
  });
  activityStore.set(contractId, list);
}

function makeBidDocuments(seed: number, count: number): BidDocument[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `bidoc-${seed}-${i}`,
    name: BID_DOC_NAMES[(seed + i) % BID_DOC_NAMES.length],
    fileSizeBytes: 180_000 + ((seed * 7_919 + i * 4_721) % 1_800_000),
    uploadedAt: iso(9 - (i % 5), 10 + (i % 6)),
  }));
}

const BID_LIFECYCLE: BidStatus[] = [
  'submitted',
  'under-review',
  'shortlisted',
  'adjustment-requested',
];

function bidStatusesFor(
  contractStatus: ContractStatus,
  bidCount: number,
): BidStatus[] {
  return Array.from({ length: bidCount }, (_, i) => {
    if (contractStatus === 'open') return 'submitted';
    if (contractStatus === 'awarded' || contractStatus === 'completed') {
      return i === 0 ? 'awarded' : 'rejected';
    }
    if (contractStatus === 'evaluation') {
      return BID_LIFECYCLE[i % BID_LIFECYCLE.length];
    }
    return 'submitted';
  });
}

function makeBid(
  contract: Contract,
  index: number,
  status: BidStatus,
): Bid {
  const vendor = VENDORS[(contractCounter + index) % VENDORS.length];
  const seed = contractCounter * 13 + index * 31;
  const variance = 0.82 + ((seed % 30) / 100);
  return {
    id: `${contract.id}-bid-${index}`,
    contractId: contract.id,
    vendor,
    proposalAmount: Math.round((contract.budget * variance) / 1000) * 1000,
    coverLetter: COVER_LETTERS[seed % COVER_LETTERS.length],
    documents: makeBidDocuments(seed, 2 + (seed % 4)),
    status,
    submittedAt: iso(12 - index * 2),
    updatedAt: iso(Math.max(0, 6 - index)),
  };
}

function makeContract(spec: SeedSpec, index: number): Contract {
  const id = `contract-${index}`;
  const createdAgo = 30 - index * 2;
  const statusRank =
    spec.status === 'draft'
      ? 0
      : spec.status === 'open'
        ? 1
        : spec.status === 'evaluation'
          ? 2
          : spec.status === 'awarded'
            ? 3
            : spec.status === 'completed'
              ? 4
              : 1;
  const contract: Contract = {
    id,
    referenceNo: `GOV/PROC/2026/${String(index + 14).padStart(3, '0')}`,
    title: spec.title,
    description: spec.description,
    category: spec.category,
    method: spec.method,
    department: DEPARTMENTS[index % DEPARTMENTS.length],
    budget: spec.budget,
    currency: 'NGN',
    status: spec.status,
    visibility: spec.method === 'direct-procurement' ? 'restricted' : 'public',
    createdBy: OFFICERS[index % OFFICERS.length],
    items: spec.items.map(([description, quantity, unit], i) => ({
      id: `${id}-item-${i}`,
      description,
      quantity,
      unit,
    })),
    documents: [
      {
        id: `${id}-doc-notice`,
        title: 'Tender Notice',
        fileName: `${spec.title.replace(/[^a-z0-9]+/gi, '_')}_Notice.pdf`,
        fileSizeBytes: 240_000 + index * 31_000,
        kind: 'tender-notice',
        uploadedBy: OFFICERS[index % OFFICERS.length],
        uploadedAt: iso(createdAgo),
      },
      {
        id: `${id}-doc-boq`,
        title: 'Bill of Quantities / Specification',
        fileName: `${spec.title.replace(/[^a-z0-9]+/gi, '_')}_BOQ.pdf`,
        fileSizeBytes: 820_000 + index * 47_000,
        kind: 'bill-of-quantities',
        uploadedBy: OFFICERS[index % OFFICERS.length],
        uploadedAt: iso(createdAgo),
      },
    ],
    applicationCount: spec.bidCount,
    awardedBidId:
      statusRank >= 3 ? `${id}-bid-0` : undefined,
    submissionDeadline: isoDate(
      spec.status === 'open'
        ? 7 + index * 3
        : spec.status === 'draft'
          ? 21
          : -(5 + index),
    ),
    publishedAt: spec.status === 'draft' ? undefined : iso(createdAgo - 2),
    createdAt: iso(createdAgo),
    updatedAt: iso(Math.max(0, 4 - index % 5)),
  };
  return contract;
}

function seedContract(spec: SeedSpec, index: number): void {
  contractCounter = index;
  const contract = makeContract(spec, index);
  contractStore.set(contract.id, contract);

  const statuses = bidStatusesFor(spec.status, spec.bidCount);
  const bids = statuses.map((status, i) => makeBid(contract, i, status));
  bidStore.set(contract.id, bids);

  const activities: ContractActivity[] = [
    {
      id: `${contract.id}-act-created`,
      actor: contract.createdBy,
      action: 'Contract created as draft',
      timestamp: contract.createdAt,
    },
  ];
  if (contract.publishedAt) {
    activities.push({
      id: `${contract.id}-act-published`,
      actor: contract.createdBy,
      action:
        contract.visibility === 'public'
          ? 'Tender published to the public notice board'
          : 'Tender issued to selected vendors',
      timestamp: contract.publishedAt,
    });
  }
  bids.slice(0, 2).forEach((bid, i) => {
    activities.push({
      id: `${contract.id}-act-bid-${i}`,
      actor: {
        name: bid.vendor.contactName,
        email: bid.vendor.email,
        avatarUrl: bid.vendor.avatarUrl,
      },
      action: `Bid submitted by ${bid.vendor.companyName}`,
      timestamp: bid.submittedAt,
    });
  });
  if (spec.status === 'evaluation') {
    activities.push({
      id: `${contract.id}-act-eval`,
      actor: CURRENT_OFFICER,
      action: 'Submissions closed; evaluation commenced',
      timestamp: contract.updatedAt,
    });
  }
  if (spec.status === 'awarded' || spec.status === 'completed') {
    const winner = bids[0];
    activities.push(
      {
        id: `${contract.id}-act-award`,
        actor: CURRENT_OFFICER,
        action: `Contract awarded to ${winner.vendor.companyName}`,
        timestamp: contract.updatedAt,
      },
      {
        id: `${contract.id}-act-agreement`,
        actor: CURRENT_OFFICER,
        action: 'Contract agreement generated and sent for signature',
        timestamp: contract.updatedAt,
      },
    );
    const bothSigned = spec.status === 'completed';
    contract.documents.push({
      id: `${contract.id}-doc-agreement`,
      title: 'Contract Agreement',
      fileName: `${contract.referenceNo.replace(/\//g, '-')}_Agreement.pdf`,
      fileSizeBytes: 640_000,
      kind: 'agreement',
      uploadedBy: CURRENT_OFFICER,
      uploadedAt: contract.updatedAt,
      signature: {
        status: bothSigned ? 'complete' : 'partial',
        sentAt: contract.updatedAt,
        parties: [
          {
            role: 'ministry',
            name: CURRENT_OFFICER.name,
            email: CURRENT_OFFICER.email,
            signedAt: contract.updatedAt,
          },
          {
            role: 'vendor',
            name: winner.vendor.contactName,
            email: winner.vendor.email,
            signedAt: bothSigned ? contract.updatedAt : undefined,
          },
        ],
      },
    });
    if (bothSigned) {
      activities.push(
        {
          id: `${contract.id}-act-sign-m`,
          actor: CURRENT_OFFICER,
          action: 'Signed the contract agreement (Ministry)',
          timestamp: contract.updatedAt,
        },
        {
          id: `${contract.id}-act-sign-v`,
          actor: {
            name: winner.vendor.contactName,
            email: winner.vendor.email,
            avatarUrl: winner.vendor.avatarUrl,
          },
          action: 'Signed the contract agreement (Vendor)',
          timestamp: contract.updatedAt,
        },
      );
    }
  }
  activityStore.set(contract.id, activities);

  bids.slice(0, 2).forEach((bid, bidIndex) => {
    const key = messageKey(contract.id, bid.id);
    const messages = Array.from({ length: 2 + bidIndex }, (_, i) => {
      const fromVendor = i % 2 === 0;
      return {
        id: `${key}-msg-${i}`,
        author: fromVendor
          ? {
              name: bid.vendor.contactName,
              email: bid.vendor.email,
              avatarUrl: bid.vendor.avatarUrl,
            }
          : CURRENT_OFFICER,
        isOwn: !fromVendor,
        body: MESSAGE_BODIES[(bidIndex + i) % MESSAGE_BODIES.length],
        sentAt: iso(6 - i, 9 + i * 2),
      };
    });
    messageStore.set(key, messages);
  });
}

SEEDS.forEach(seedContract);

function matchesQuery(contract: Contract, query: ContractListQuery): boolean {
  const q = (query.query ?? '').trim().toLowerCase();
  if (
    q &&
    !contract.title.toLowerCase().includes(q) &&
    !contract.referenceNo.toLowerCase().includes(q) &&
    !contract.department.toLowerCase().includes(q)
  ) {
    return false;
  }
  if (query.category && contract.category !== query.category) return false;
  if (query.method && contract.method !== query.method) return false;
  if (query.department && contract.department !== query.department) {
    return false;
  }
  if (query.from && contract.submissionDeadline < query.from) return false;
  if (query.to && contract.submissionDeadline > query.to) return false;
  return true;
}

function requireContract(contractId: string): Contract {
  const contract = contractStore.get(contractId);
  if (!contract) throw new Error(`No such contract: ${contractId}`);
  return contract;
}

function requireBid(contractId: string, bidId: string): Bid {
  const bid = (bidStore.get(contractId) ?? []).find((b) => b.id === bidId);
  if (!bid) throw new Error(`No such bid: ${bidId}`);
  return bid;
}

function touch(contract: Contract): Contract {
  contract.updatedAt = new Date().toISOString();
  return { ...contract };
}

const FILTER_OPTIONS: ContractFilterOptions = {
  categories: CATEGORIES,
  departments: DEPARTMENTS,
  methods: METHODS,
};

/**
 * Development-only procurement fixtures used when no VITE_API_BASE_URL is
 * configured. Records are generated, not real data. Writes are kept in memory
 * so the audit trail, chat and signature flow stay consistent within a session.
 */
export const devProcurementApi: ProcurementApi = {
  async list(query: ContractListQuery): Promise<ContractListResult> {
    await delay();
    const rows = [...contractStore.values()]
      .filter((contract) =>
        query.view === 'all' ? true : contract.status === query.view,
      )
      .filter((contract) => matchesQuery(contract, query))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const page = Math.min(Math.max(1, query.page), totalPages);
    const items = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return { items, page, totalPages, total: rows.length };
  },

  async getContract(contractId: string): Promise<Contract> {
    await delay();
    return { ...requireContract(contractId) };
  },

  async listFilterOptions(): Promise<ContractFilterOptions> {
    await delay();
    return FILTER_OPTIONS;
  },

  async listBids(contractId: string): Promise<Bid[]> {
    await delay();
    requireContract(contractId);
    return (bidStore.get(contractId) ?? []).map((bid) => ({ ...bid }));
  },

  async listMessages(
    contractId: string,
    bidId: string,
  ): Promise<ContractMessage[]> {
    await delay();
    requireBid(contractId, bidId);
    return [...(messageStore.get(messageKey(contractId, bidId)) ?? [])];
  },

  async sendMessage(
    contractId: string,
    bidId: string,
    body: string,
  ): Promise<ContractMessage> {
    await delay();
    const bid = requireBid(contractId, bidId);
    const key = messageKey(contractId, bidId);
    const messages = messageStore.get(key) ?? [];
    const message: ContractMessage = {
      id: `${key}-msg-${messages.length}-${Date.now()}`,
      author: CURRENT_OFFICER,
      isOwn: true,
      body,
      sentAt: new Date().toISOString(),
    };
    messages.push(message);
    messageStore.set(key, messages);
    logActivity(
      contractId,
      `Message sent to ${bid.vendor.companyName}`,
      body.length > 60 ? `${body.slice(0, 60)}…` : body,
    );
    return message;
  },

  async listActivity(contractId: string): Promise<ContractActivity[]> {
    await delay();
    requireContract(contractId);
    return [...(activityStore.get(contractId) ?? [])].reverse();
  },

  async createContract(input: CreateContractInput): Promise<Contract> {
    await delay();
    const id = `contract-new-${Date.now()}`;
    const now = new Date().toISOString();
    const contract: Contract = {
      id,
      referenceNo: `GOV/PROC/2026/${String(contractStore.size + 14).padStart(3, '0')}`,
      title: input.title,
      description: input.description,
      category: input.category,
      method: input.method,
      department: input.department,
      budget: input.budget,
      currency: 'NGN',
      status: input.publish ? 'open' : 'draft',
      visibility: input.method === 'direct-procurement' ? 'restricted' : 'public',
      createdBy: CURRENT_OFFICER,
      items: input.items.map((item, i) => ({
        id: `${id}-item-${i}`,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
      })),
      documents: [],
      applicationCount: 0,
      submissionDeadline: input.submissionDeadline,
      publishedAt: input.publish ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };
    contractStore.set(id, contract);
    bidStore.set(id, []);
    logActivity(
      id,
      input.publish
        ? 'Contract created and published to the public notice board'
        : 'Contract created as draft',
      undefined,
      now,
    );
    return { ...contract };
  },

  async runContractAction(contractId, action): Promise<Contract> {
    await delay();
    const contract = requireContract(contractId);
    const now = new Date().toISOString();
    switch (action) {
      case 'publish':
        contract.status = 'open';
        contract.publishedAt = now;
        logActivity(contractId, 'Tender published to the public notice board');
        break;
      case 'close-submissions':
        contract.status = 'evaluation';
        logActivity(contractId, 'Submissions closed; evaluation commenced');
        break;
      case 'complete':
        contract.status = 'completed';
        logActivity(contractId, 'Contract marked as completed');
        break;
      case 'cancel':
        contract.status = 'cancelled';
        logActivity(contractId, 'Tender cancelled');
        break;
    }
    contractStore.set(contractId, touch(contract));
    return { ...contract };
  },

  async setBidStatus(contractId, bidId, status): Promise<Bid> {
    await delay();
    const bid = requireBid(contractId, bidId);
    bid.status = status;
    bid.updatedAt = new Date().toISOString();
    const labels: Partial<Record<BidStatus, string>> = {
      'under-review': 'Bid moved to under review',
      shortlisted: 'Bid shortlisted',
      rejected: 'Bid rejected',
      submitted: 'Bid returned to submitted',
    };
    logActivity(
      contractId,
      `${labels[status] ?? `Bid status set to ${status}`} — ${bid.vendor.companyName}`,
    );
    return { ...bid };
  },

  async requestAdjustment(contractId, bidId, note): Promise<void> {
    await delay();
    const bid = requireBid(contractId, bidId);
    bid.status = 'adjustment-requested';
    bid.updatedAt = new Date().toISOString();
    const key = messageKey(contractId, bidId);
    const messages = messageStore.get(key) ?? [];
    messages.push({
      id: `${key}-msg-${messages.length}-${Date.now()}`,
      author: CURRENT_OFFICER,
      isOwn: true,
      body: `Adjustment requested: ${note}`,
      sentAt: new Date().toISOString(),
    });
    messageStore.set(key, messages);
    logActivity(
      contractId,
      `Adjustment requested from ${bid.vendor.companyName}`,
      note,
    );
  },

  async awardContract(contractId, bidId): Promise<Contract> {
    await delay();
    const contract = requireContract(contractId);
    const bids = bidStore.get(contractId) ?? [];
    const now = new Date().toISOString();
    bids.forEach((bid) => {
      bid.status = bid.id === bidId ? 'awarded' : 'rejected';
      bid.updatedAt = now;
    });
    const winner = requireBid(contractId, bidId);
    contract.status = 'awarded';
    contract.awardedBidId = bidId;
    contract.documents.push({
      id: `${contractId}-doc-agreement-${Date.now()}`,
      title: 'Contract Agreement',
      fileName: `${contract.referenceNo.replace(/\//g, '-')}_Agreement.pdf`,
      fileSizeBytes: 640_000,
      kind: 'agreement',
      uploadedBy: CURRENT_OFFICER,
      uploadedAt: now,
      signature: {
        status: 'awaiting',
        sentAt: now,
        parties: [
          {
            role: 'ministry',
            name: CURRENT_OFFICER.name,
            email: CURRENT_OFFICER.email,
          },
          {
            role: 'vendor',
            name: winner.vendor.contactName,
            email: winner.vendor.email,
          },
        ],
      },
    });
    logActivity(contractId, `Contract awarded to ${winner.vendor.companyName}`);
    logActivity(
      contractId,
      'Contract agreement generated and sent for signature',
    );
    contractStore.set(contractId, touch(contract));
    return { ...contract };
  },

  async uploadDocument(
    contractId,
    input: UploadDocumentInput,
  ): Promise<ContractDocument> {
    await delay();
    const contract = requireContract(contractId);
    const document: ContractDocument = {
      id: `${contractId}-doc-${Date.now()}`,
      title: input.title,
      fileName: input.fileName,
      fileSizeBytes: input.fileSizeBytes,
      kind: input.kind,
      uploadedBy: CURRENT_OFFICER,
      uploadedAt: new Date().toISOString(),
    };
    contract.documents.push(document);
    logActivity(contractId, `Document uploaded: ${input.title}`);
    contractStore.set(contractId, touch(contract));
    return { ...document };
  },

  async sendForSignature(contractId, documentId): Promise<void> {
    await delay();
    const contract = requireContract(contractId);
    const document = contract.documents.find((doc) => doc.id === documentId);
    if (!document) throw new Error(`No such document: ${documentId}`);
    if (!document.signature) {
      const awarded = (bidStore.get(contractId) ?? []).find(
        (bid) => bid.id === contract.awardedBidId,
      );
      document.signature = {
        status: 'awaiting',
        sentAt: new Date().toISOString(),
        parties: [
          {
            role: 'ministry',
            name: CURRENT_OFFICER.name,
            email: CURRENT_OFFICER.email,
          },
          {
            role: 'vendor',
            name: awarded?.vendor.contactName ?? 'Vendor Representative',
            email: awarded?.vendor.email ?? 'vendor@example.com',
          },
        ],
      };
    } else {
      document.signature.sentAt = new Date().toISOString();
    }
    logActivity(contractId, `Signature requested on ${document.title}`);
    contractStore.set(contractId, touch(contract));
  },

  async signDocument(
    contractId,
    documentId,
    party: SignaturePartyRole,
  ): Promise<void> {
    await delay();
    const contract = requireContract(contractId);
    const document = contract.documents.find((doc) => doc.id === documentId);
    if (!document?.signature) throw new Error(`No such document: ${documentId}`);
    const signer = document.signature.parties.find((p) => p.role === party);
    if (!signer) throw new Error(`No signatory for role: ${party}`);
    if (!signer.signedAt) {
      signer.signedAt = new Date().toISOString();
      const allSigned = document.signature.parties.every((p) => p.signedAt);
      document.signature.status = allSigned ? 'complete' : 'partial';
      logActivity(
        contractId,
        `Signed ${document.title} (${party === 'ministry' ? 'Ministry' : 'Vendor'})`,
        signer.name,
      );
      if (allSigned) {
        logActivity(
          contractId,
          'All parties have signed; agreement is fully executed',
        );
      }
    }
    contractStore.set(contractId, touch(contract));
  },
};
