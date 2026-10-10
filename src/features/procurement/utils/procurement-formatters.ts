import type {
  BidStatus,
  ContractCategory,
  ContractDocumentKind,
  ContractStatus,
  ProcurementMethod,
} from '../types/procurement.types';
import type { StatusTone } from '../../../shared/components/StatusBadge';

const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  draft: 'Draft',
  open: 'Open',
  evaluation: 'In Evaluation',
  awarded: 'Awarded',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const CONTRACT_STATUS_TONES: Record<ContractStatus, StatusTone> = {
  draft: 'neutral',
  open: 'info',
  evaluation: 'info',
  awarded: 'success',
  completed: 'success',
  cancelled: 'danger',
};

const BID_STATUS_LABELS: Record<BidStatus, string> = {
  submitted: 'Submitted',
  'under-review': 'Under Review',
  shortlisted: 'Shortlisted',
  'adjustment-requested': 'Adjustment Requested',
  rejected: 'Rejected',
  awarded: 'Awarded',
  withdrawn: 'Withdrawn',
};

const BID_STATUS_TONES: Record<BidStatus, StatusTone> = {
  submitted: 'neutral',
  'under-review': 'info',
  shortlisted: 'info',
  'adjustment-requested': 'danger',
  rejected: 'danger',
  awarded: 'success',
  withdrawn: 'neutral',
};

const CATEGORY_LABELS: Record<ContractCategory, string> = {
  goods: 'Goods & Supplies',
  works: 'Works & Construction',
  services: 'Services',
  consultancy: 'Consultancy',
};

const METHOD_LABELS: Record<ProcurementMethod, string> = {
  'open-tender': 'Open Tender',
  'selective-tender': 'Selective Tender',
  'direct-procurement': 'Direct Procurement',
  'request-for-quotation': 'Request for Quotation',
};

const DOCUMENT_KIND_LABELS: Record<ContractDocumentKind, string> = {
  'tender-notice': 'Tender Notice',
  'bill-of-quantities': 'Bill of Quantities',
  agreement: 'Contract Agreement',
  addendum: 'Addendum',
  other: 'Other',
};

export function contractStatusLabel(status: ContractStatus): string {
  return CONTRACT_STATUS_LABELS[status];
}

export function contractStatusTone(status: ContractStatus): StatusTone {
  return CONTRACT_STATUS_TONES[status];
}

export function bidStatusLabel(status: BidStatus): string {
  return BID_STATUS_LABELS[status];
}

export function bidStatusTone(status: BidStatus): StatusTone {
  return BID_STATUS_TONES[status];
}

export function categoryLabel(category: ContractCategory): string {
  return CATEGORY_LABELS[category];
}

export function methodLabel(method: ProcurementMethod): string {
  return METHOD_LABELS[method];
}

export function documentKindLabel(kind: ContractDocumentKind): string {
  return DOCUMENT_KIND_LABELS[kind];
}

/** Formats a contract value as "₦45,000,000". */
export function formatMoney(amount: number, currency = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

const weekdayFormatter = new Intl.DateTimeFormat('en', { weekday: 'long' });
const dayFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
const DAY_MS = 86_400_000;

function dayStart(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** Formats a timestamp as "Thursday 11:44am" for message metadata. */
export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const hours = date.getHours();
  const h = hours % 12 || 12;
  const m = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours < 12 ? 'am' : 'pm';
  return `${weekdayFormatter.format(date)} ${h}:${m}${ampm}`;
}

/**
 * Returns a divider label for a message's calendar day:
 * "Today", "Yesterday", a weekday for the past week, or "Jan 6, 2022".
 */
export function formatDayLabel(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const diff = Math.floor((dayStart(now) - dayStart(date)) / DAY_MS);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return weekdayFormatter.format(date);
  return dayFormatter.format(date);
}

/** Calendar-day key used to group messages under dividers. */
export function messageDayKey(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toDateString();
}
