import { apiClient } from '../../../shared/api/api-client';
import { env } from '../../../shared/config/env';
import type {
  MemoDetail,
  MemoListQuery,
  MemoListResult,
  MemoMessage,
  MemosApi,
} from '../types/memos.types';
import { devMemosApi } from './memos.stub';

/**
 * Assumed backend contract (no API spec exists yet — confirm before release):
 *   GET  /memos?page&sort&query&status&from&to -> { items, page, totalPages, total }
 *   GET  /memos/{id}             -> MemoDetail | 404
 *   GET  /memos/{id}/messages    -> MemoMessage[]
 *   POST /memos/{id}/messages    { body }                    -> MemoMessage
 */
function toSearchParams(query: MemoListQuery): string {
  const params = new URLSearchParams({
    page: String(query.page),
    sort: query.sort,
  });
  if (query.query) params.set('query', query.query);
  if (query.status) params.set('status', query.status);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  return params.toString();
}

const httpMemosApi: MemosApi = {
  list: (query) =>
    apiClient.get<MemoListResult>(`/memos?${toSearchParams(query)}`, {
      signal: query.signal,
    }),
  getMemo: (memoId, signal) =>
    apiClient.get<MemoDetail>(`/memos/${memoId}`, { signal }),
  listMessages: (memoId, signal) =>
    apiClient.get<MemoMessage[]>(`/memos/${memoId}/messages`, { signal }),
  sendMessage: (memoId, body) =>
    apiClient.post<MemoMessage>(`/memos/${memoId}/messages`, { body }),
};

export const memosApi: MemosApi = env.apiBaseUrl ? httpMemosApi : devMemosApi;
