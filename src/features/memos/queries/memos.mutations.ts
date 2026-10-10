import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memosApi } from '../services/memos.api';
import type { MemoMessage } from '../types/memos.types';
import { memoKeys } from './memos.queries';

export function useSendMemoMessage(memoId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => memosApi.sendMessage(memoId, body),
    onSuccess: (message) =>
      queryClient.setQueryData<MemoMessage[]>(
        memoKeys.messages(memoId),
        (prev) => [...(prev ?? []), message],
      ),
  });
}
