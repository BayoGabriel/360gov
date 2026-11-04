import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

export type WorkspaceTab = 'drive' | 'mail';

export const WORKSPACE_TABS: { id: WorkspaceTab; label: string }[] = [
  { id: 'drive', label: 'Drive' },
  { id: 'mail', label: 'Mail' },
];

/** URL-backed workspace state: ?tab=drive&folder=f-1&file=d-2 | ?tab=mail&thread=t-1 */
export function useWorkspacePage() {
  const [params, setParams] = useSearchParams();

  const tab = (params.get('tab') === 'mail' ? 'mail' : 'drive') as WorkspaceTab;
  const folderId = params.get('folder');
  const fileId = params.get('file');
  const threadId = params.get('thread');
  const query = params.get('q') ?? '';

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(patch)) {
          if (value === null) next.delete(key);
          else next.set(key, value);
        }
        return next;
      });
    },
    [setParams],
  );

  const setTab = useCallback(
    (next: WorkspaceTab) =>
      update({
        tab: next === 'drive' ? null : next,
        folder: null,
        file: null,
        thread: null,
        q: null,
      }),
    [update],
  );

  return {
    tab,
    setTab,
    folderId,
    fileId,
    threadId,
    query,
    openFolder: (id: string | null) => update({ folder: id, file: null }),
    openFile: (id: string) => update({ file: id }),
    closeFile: () => update({ file: null }),
    openThread: (id: string) => update({ thread: id }),
    closeThread: () => update({ thread: null }),
    setQuery: (value: string) => update({ q: value || null }),
  };
}
