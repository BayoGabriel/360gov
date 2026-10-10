import { useDeferredValue, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useDocumentList } from '../queries/documents.queries';
import type {
  DocumentView,
  FileRecord,
  FileStatus,
} from '../types/documents.types';

export const DOCUMENT_VIEWS: { id: DocumentView; label: string }[] = [
  { id: 'pending', label: 'Pending Approval' },
  { id: 'in-review', label: 'Task-In-Review' },
  { id: 'processed', label: 'Total Processed File' },
];

const VIEW_IDS = DOCUMENT_VIEWS.map((v) => v.id);
const STATUSES: FileStatus[] = ['processing', 'success', 'declined'];

export interface DocumentFilters {
  status?: FileStatus;
  department?: string;
  documentType?: string;
}

function parseView(raw: string | null): DocumentView {
  return VIEW_IDS.includes(raw as DocumentView)
    ? (raw as DocumentView)
    : 'pending';
}

function parseStatus(raw: string | null): FileStatus | undefined {
  return STATUSES.includes(raw as FileStatus)
    ? (raw as FileStatus)
    : undefined;
}

type ParamPatch = Record<string, string | undefined>;

export function useDocumentsPage() {
  const [params, setParams] = useSearchParams();
  const view = parseView(params.get('view'));
  const page = Math.max(1, Number(params.get('page')) || 1);
  const query = params.get('q') ?? '';
  const from = params.get('from') ?? undefined;
  const to = params.get('to') ?? undefined;
  const filters: DocumentFilters = {
    status: parseStatus(params.get('status')),
    department: params.get('dept') ?? undefined,
    documentType: params.get('dtype') ?? undefined,
  };
  const deferredQuery = useDeferredValue(query);

  const result = useDocumentList({
    view,
    page,
    query: deferredQuery,
    from,
    to,
    ...filters,
  });
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);

  const updateParams = (patch: ParamPatch) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next);
  };

  const setView = (nextView: DocumentView) => {
    setSelected(new Set());
    updateParams({ view: nextView, page: undefined });
  };
  const setPage = (nextPage: number) =>
    updateParams({ page: nextPage > 1 ? String(nextPage) : undefined });
  const setQuery = (q: string) =>
    updateParams({ q: q || undefined, page: undefined });
  const setRange = (f: string | undefined, t: string | undefined) =>
    updateParams({ from: f, to: t, page: undefined });
  const setFilters = (next: DocumentFilters) =>
    updateParams({
      status: next.status,
      dept: next.department,
      dtype: next.documentType,
      page: undefined,
    });

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = (rows: FileRecord[]) => {
    setSelected((prev) =>
      prev.size === rows.length ? new Set() : new Set(rows.map((r) => r.id)),
    );
  };

  return {
    view,
    page,
    query,
    from,
    to,
    filters,
    selected,
    filtersOpen,
    ...result,
    setView,
    setPage,
    setQuery,
    setRange,
    setFilters,
    toggleRow,
    toggleAll,
    openFilters: () => setFiltersOpen(true),
    closeFilters: () => setFiltersOpen(false),
  };
}
