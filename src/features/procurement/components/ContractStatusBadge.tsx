import { StatusBadge } from '../../../shared/components/StatusBadge';
import type { ContractStatus } from '../types/procurement.types';
import {
  contractStatusLabel,
  contractStatusTone,
} from '../utils/procurement-formatters';

export function ContractStatusBadge({ status }: { status: ContractStatus }) {
  return (
    <StatusBadge
      label={contractStatusLabel(status)}
      tone={contractStatusTone(status)}
    />
  );
}
