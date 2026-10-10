import {
  StatusBadge,
  type StatusTone,
} from '../../../shared/components/StatusBadge';
import type { MemoStatus } from '../types/memos.types';

const STATUS_LABELS: Record<MemoStatus, { label: string; tone: StatusTone }> = {
  processing: { label: 'Processing', tone: 'info' },
  success: { label: 'Success', tone: 'success' },
  declined: { label: 'Declined', tone: 'danger' },
};

export function MemoStatusBadge({ status }: { status: MemoStatus }) {
  const { label, tone } = STATUS_LABELS[status];
  return <StatusBadge label={label} tone={tone} />;
}
