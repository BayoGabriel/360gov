export type ContractStatus =
  | 'draft'
  | 'open'
  | 'evaluation'
  | 'awarded'
  | 'completed'
  | 'cancelled';

/** List-page tab: every contract, or one lifecycle stage. */
export type ContractView = 'all' | ContractStatus;

export type ContractCategory =
  | 'goods'
  | 'works'
  | 'services'
  | 'consultancy';

export type ProcurementMethod =
  | 'open-tender'
  | 'selective-tender'
  | 'direct-procurement'
  | 'request-for-quotation';

/** Who can see the tender outside the ministry. */
export type ContractVisibility = 'public' | 'restricted';

export type BidStatus =
  | 'submitted'
  | 'under-review'
  | 'shortlisted'
  | 'adjustment-requested'
  | 'rejected'
  | 'awarded'
  | 'withdrawn';

export type ContractDocumentKind =
  | 'tender-notice'
  | 'bill-of-quantities'
  | 'agreement'
  | 'addendum'
  | 'other';

export type SignatureStatus = 'awaiting' | 'partial' | 'complete';

export type SignaturePartyRole = 'ministry' | 'vendor';

export interface Person {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface SignatureParty {
  role: SignaturePartyRole;
  name: string;
  email: string;
  /** ISO 8601 timestamp; absent until this party signs. */
  signedAt?: string;
}

export interface SignatureInfo {
  status: SignatureStatus;
  parties: SignatureParty[];
  /** ISO 8601 timestamp of when the document was sent out for signing. */
  sentAt: string;
}

export interface ContractItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
}

export interface ContractDocument {
  id: string;
  title: string;
  fileName: string;
  fileSizeBytes: number;
  kind: ContractDocumentKind;
  uploadedBy: Person;
  /** ISO 8601 timestamp. */
  uploadedAt: string;
  /** Present only on signature-tracked documents (agreements). */
  signature?: SignatureInfo;
}

export interface Contract {
  id: string;
  referenceNo: string;
  title: string;
  description: string;
  category: ContractCategory;
  method: ProcurementMethod;
  department: string;
  /** Estimated contract value in the minor-free currency unit. */
  budget: number;
  currency: string;
  status: ContractStatus;
  visibility: ContractVisibility;
  createdBy: Person;
  items: ContractItem[];
  documents: ContractDocument[];
  applicationCount: number;
  /** Set once a bid has been awarded. */
  awardedBidId?: string;
  /** ISO 8601 date (yyyy-mm-dd) after which bids are no longer accepted. */
  submissionDeadline: string;
  /** ISO 8601 timestamp of when the tender was published. */
  publishedAt?: string;
  /** ISO 8601 timestamps. */
  createdAt: string;
  updatedAt: string;
}

export interface VendorProfile {
  companyName: string;
  registrationNo: string;
  contactName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface BidDocument {
  id: string;
  name: string;
  fileSizeBytes: number;
  /** ISO 8601 timestamp. */
  uploadedAt: string;
}

export interface Bid {
  id: string;
  contractId: string;
  vendor: VendorProfile;
  /** Vendor's quoted price in the contract currency. */
  proposalAmount: number;
  coverLetter: string;
  documents: BidDocument[];
  status: BidStatus;
  /** ISO 8601 timestamps. */
  submittedAt: string;
  updatedAt: string;
}

/** A chat message between the ministry and one bidder. */
export interface ContractMessage {
  id: string;
  author: Person;
  /** True when the current user authored the message. */
  isOwn: boolean;
  body: string;
  /** ISO 8601 timestamp. */
  sentAt: string;
}

/** One entry of the contract's audit trail. */
export interface ContractActivity {
  id: string;
  actor: Person;
  action: string;
  detail?: string;
  /** ISO 8601 timestamp. */
  timestamp: string;
}

export interface ContractFilterOptions {
  categories: ContractCategory[];
  departments: string[];
  methods: ProcurementMethod[];
}

export interface ContractListQuery {
  view: ContractView;
  page: number;
  query?: string;
  category?: ContractCategory;
  method?: ProcurementMethod;
  department?: string;
  /** ISO date (yyyy-mm-dd) bounds on submissionDeadline. */
  from?: string;
  to?: string;
  signal?: AbortSignal;
}

export interface ContractListResult {
  items: Contract[];
  page: number;
  totalPages: number;
  total: number;
}

export interface ContractItemInput {
  description: string;
  quantity: number;
  unit: string;
}

export interface CreateContractInput {
  title: string;
  description: string;
  category: ContractCategory;
  method: ProcurementMethod;
  department: string;
  budget: number;
  submissionDeadline: string;
  items: ContractItemInput[];
  /** Publish immediately instead of saving a draft. */
  publish: boolean;
}

/** Lifecycle transitions allowed on a contract. */
export type ContractAction =
  | 'publish'
  | 'close-submissions'
  | 'complete'
  | 'cancel';

export interface UploadDocumentInput {
  title: string;
  fileName: string;
  fileSizeBytes: number;
  kind: ContractDocumentKind;
}

export interface ProcurementApi {
  list(query: ContractListQuery): Promise<ContractListResult>;
  getContract(contractId: string, signal?: AbortSignal): Promise<Contract>;
  listFilterOptions(signal?: AbortSignal): Promise<ContractFilterOptions>;
  listBids(contractId: string, signal?: AbortSignal): Promise<Bid[]>;
  listMessages(
    contractId: string,
    bidId: string,
    signal?: AbortSignal,
  ): Promise<ContractMessage[]>;
  sendMessage(
    contractId: string,
    bidId: string,
    body: string,
  ): Promise<ContractMessage>;
  listActivity(
    contractId: string,
    signal?: AbortSignal,
  ): Promise<ContractActivity[]>;
  createContract(input: CreateContractInput): Promise<Contract>;
  runContractAction(
    contractId: string,
    action: ContractAction,
  ): Promise<Contract>;
  setBidStatus(
    contractId: string,
    bidId: string,
    status: BidStatus,
  ): Promise<Bid>;
  requestAdjustment(
    contractId: string,
    bidId: string,
    note: string,
  ): Promise<void>;
  awardContract(contractId: string, bidId: string): Promise<Contract>;
  uploadDocument(
    contractId: string,
    input: UploadDocumentInput,
  ): Promise<ContractDocument>;
  sendForSignature(contractId: string, documentId: string): Promise<void>;
  signDocument(
    contractId: string,
    documentId: string,
    party: SignaturePartyRole,
  ): Promise<void>;
}
