import { useState } from 'react';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useOutgoingFileAction } from '../queries/dashboard.mutations';
import { useStaffFiles } from '../queries/dashboard.queries';
import type {
  DocStatus,
  OutgoingFileAction,
  StaffDirection,
} from '../types/dashboard.types';

/**
 * Orchestration for the staff dashboard: direction/filter/search state and
 * the incoming/outgoing file lists behind the shared staff query.
 */
export function useStaffDashboard() {
  const [direction, setDirection] = useState<StaffDirection>('incoming');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput);
  const [status, setStatus] = useState<DocStatus | undefined>(undefined);
  const [from, setFrom] = useState<string | undefined>('2022-01-06');
  const [to, setTo] = useState<string | undefined>('2022-01-13');
  const [scanOpen, setScanOpen] = useState(false);

  const files = useStaffFiles({
    search: debouncedSearch || undefined,
    status,
    from,
    to,
  });
  const fileAction = useOutgoingFileAction();

  const runFileAction = (
    fileId: string,
    action: OutgoingFileAction,
    fileName?: string,
  ) => fileAction.mutate({ fileId, action, fileName });

  return {
    direction,
    setDirection,
    searchInput,
    setSearchInput,
    status,
    setStatus: (next?: DocStatus) => setStatus(next),
    from,
    to,
    setRange: (nextFrom?: string, nextTo?: string) => {
      setFrom(nextFrom);
      setTo(nextTo);
    },
    files,
    fileActionPendingId: fileAction.isPending
      ? (fileAction.variables?.fileId ?? null)
      : null,
    runFileAction,
    scanOpen,
    openScan: () => setScanOpen(true),
    closeScan: () => setScanOpen(false),
  };
}
