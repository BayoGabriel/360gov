import { apiClient } from '../../../shared/api/api-client';
import { env } from '../../../shared/config/env';
import type {
  DocumentListQuery,
  DocumentListResult,
  DocumentsApi,
  FileComment,
  FileRecord,
} from '../types/documents.types';
import { devDocumentsApi } from './documents.stub';

/**
 * Assumed backend contract (no API spec exists yet — confirm before release):
 *   GET  /documents?view&page&query&status&department&type&from&to -> { items, page, totalPages, total }
 *   GET  /documents/{id}                  -> FileRecord
 *   GET  /documents/{id}/comments         -> FileComment[]
 *   GET  /documents/filter-options        -> DocumentFilterOptions
 *   GET  /documents/forward-recipients    -> ForwardRecipient[]
 *   GET  /documents/{id}/approval-trail   -> DocumentTrailEntry[]
 *   POST /documents/{id}/notes            { note }         -> 204
 *   POST /documents/{id}/forward          { recipientIds } -> 204
 *   POST /documents/{id}/approve                           -> 204
 *   POST /documents/approve-all                            -> 204
 *   POST /documents/{id}/revision-request   { assigneeId? } -> 204
 *   POST /documents/{id}/archive                           -> 204
 */
function toSearchParams(query: DocumentListQuery): string {
  const params = new URLSearchParams({
    view: query.view,
    page: String(query.page),
  });
  if (query.query) params.set('query', query.query);
  if (query.status) params.set('status', query.status);
  if (query.department) params.set('department', query.department);
  if (query.documentType) params.set('type', query.documentType);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  return params.toString();
}

const httpDocumentsApi: DocumentsApi = {
  list: (query) =>
    apiClient.get<DocumentListResult>(`/documents?${toSearchParams(query)}`, {
      signal: query.signal,
    }),
  getFile: (fileId, signal) =>
    apiClient.get<FileRecord>(`/documents/${fileId}`, { signal }),
  listComments: (fileId, signal) =>
    apiClient.get<FileComment[]>(`/documents/${fileId}/comments`, { signal }),
  listFilterOptions: (signal) =>
    apiClient.get('/documents/filter-options', { signal }),
  listForwardRecipients: (signal) =>
    apiClient.get('/documents/forward-recipients', { signal }),
  getApprovalTrail: (fileId, signal) =>
    apiClient.get(`/documents/${fileId}/approval-trail`, { signal }),
  addNote: (fileId, note) =>
    apiClient.post(`/documents/${fileId}/notes`, { note }),
  forwardDocument: (fileId, recipientIds) =>
    apiClient.post(`/documents/${fileId}/forward`, { recipientIds }),
  approveFile: (fileId) =>
    apiClient.post(`/documents/${fileId}/approve`, undefined),
  approveAllPending: () =>
    apiClient.post('/documents/approve-all', undefined),
  requestRevision: (fileId, staffId) =>
    apiClient.post(`/documents/${fileId}/revision-request`, {
      assigneeId: staffId,
    }),
  archiveFile: (fileId) =>
    apiClient.post(`/documents/${fileId}/archive`, undefined),
};

export const documentsApi: DocumentsApi = env.apiBaseUrl
  ? httpDocumentsApi
  : devDocumentsApi;
