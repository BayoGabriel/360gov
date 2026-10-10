import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  FileSearch,
  FileSignature,
  FileText,
  MessageSquareReply,
  PenLine,
  ScrollText,
  UserRound,
  Wand2,
} from 'lucide-react';
import type { AiTask } from '../../shared/ai/ai.types';

export type CapabilityCategory =
  | 'Documents'
  | 'Procurement'
  | 'Communication'
  | 'Insights';

/** Where a capability draws its working material from. */
export type CapabilitySource =
  | { kind: 'document' }
  | { kind: 'contract' }
  | { kind: 'report' }
  | { kind: 'freeform' };

export interface AiCapability {
  id: string;
  title: string;
  description: string;
  task: AiTask;
  /** Audit label recorded with each invocation. */
  purpose: string;
  category: CapabilityCategory;
  icon: LucideIcon;
  source: CapabilitySource;
  /** Helper text shown above the record picker / inputs in the run dialog. */
  hint: string;
}

export const CAPABILITY_CATEGORIES: CapabilityCategory[] = [
  'Documents',
  'Procurement',
  'Communication',
  'Insights',
];

export const AI_CAPABILITIES: AiCapability[] = [
  {
    id: 'doc-summary',
    title: 'Summarize a file',
    description:
      'Condense a file\'s subject, status and contents into a short brief.',
    task: 'summarize',
    purpose: 'document-summary',
    category: 'Documents',
    icon: FileSearch,
    source: { kind: 'document' },
    hint: 'Pick a file from pending or in-review to summarize.',
  },
  {
    id: 'file-note',
    title: 'Draft a file note',
    description:
      'Produce a formal minute/note you can paste into the file\'s record.',
    task: 'draft',
    purpose: 'file-note',
    category: 'Documents',
    icon: FileText,
    source: { kind: 'document' },
    hint: 'Pick the file the note relates to.',
  },
  {
    id: 'contract-summary',
    title: 'Summarize a tender',
    description:
      'Brief on a contract\'s scope, status, bids and deadlines at a glance.',
    task: 'summarize',
    purpose: 'contract-summary',
    category: 'Procurement',
    icon: ScrollText,
    source: { kind: 'contract' },
    hint: 'Pick a contract or tender to summarize.',
  },
  {
    id: 'contract-description',
    title: 'Draft tender description',
    description:
      'Generate a public-ready requirements paragraph for a new contract.',
    task: 'draft',
    purpose: 'contract-description',
    category: 'Procurement',
    icon: FileSignature,
    source: { kind: 'freeform' },
    hint: 'Name the contract and optionally list key deliverables.',
  },
  {
    id: 'bid-reply',
    title: 'Draft a vendor reply',
    description:
      'Compose a professional response to a bidder on a live tender.',
    task: 'reply',
    purpose: 'bid-reply',
    category: 'Procurement',
    icon: MessageSquareReply,
    source: { kind: 'contract' },
    hint: 'Pick the contract whose vendor you want to reply to.',
  },
  {
    id: 'memo-draft',
    title: 'Draft a memo',
    description:
      'Turn a few bullet points into a formal internal memo message.',
    task: 'draft',
    purpose: 'memo-message',
    category: 'Communication',
    icon: PenLine,
    source: { kind: 'freeform' },
    hint: 'Give the memo a subject and any points to cover.',
  },
  {
    id: 'bio-draft',
    title: 'Draft a profile bio',
    description:
      'Write a short, professional staff bio for your profile settings.',
    task: 'draft',
    purpose: 'profile-bio',
    category: 'Communication',
    icon: UserRound,
    source: { kind: 'freeform' },
    hint: 'Enter the officer\'s name and role to base the bio on.',
  },
  {
    id: 'improve-text',
    title: 'Improve any text',
    description:
      'Paste rough text and get a clearer, more official version back.',
    task: 'improve',
    purpose: 'improve-text',
    category: 'Communication',
    icon: Wand2,
    source: { kind: 'freeform' },
    hint: 'Paste the text you want rewritten into the source box.',
  },
  {
    id: 'report-insights',
    title: 'Reporting insights',
    description:
      'Narrate what this week\'s processing stats mean and what to watch.',
    task: 'summarize',
    purpose: 'reporting-insights',
    category: 'Insights',
    icon: BarChart3,
    source: { kind: 'report' },
    hint: 'Runs on the current reporting overview — nothing to pick.',
  },
];
