import { StatusBadge } from '../../../shared/components/StatusBadge';
import type { BidStatus } from '../types/procurement.types';
import { bidStatusLabel, bidStatusTone } from '../utils/procurement-formatters';

export function BidStatusBadge({ status }: { status: BidStatus }) {
  return (
    <StatusBadge label={bidStatusLabel(status)} tone={bidStatusTone(status)} />
  );
}
