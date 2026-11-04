import { apiClient } from '../../../shared/api/api-client';
import { env } from '../../../shared/config/env';
import type {
  CreateFolderInput,
  DriveBreadcrumb,
  DriveItem,
  MailMessage,
  MailThread,
  MailThreadDetail,
  SendMailInput,
  UploadDriveFileInput,
  WorkspaceAccount,
  WorkspaceApi,
} from '../types/workspace.types';
import { devWorkspaceApi } from './workspace.stub';

/**
 * Assumed backend contract (no API spec exists yet — confirm before release).
 * The backend proxies Google on the officer's behalf: it owns the OAuth
 * tokens, enforces the caller's platform permissions, and writes an audit
 * event for every mail sent and file uploaded.
 *
 *   GET  /workspace/account                        -> WorkspaceAccount
 *   GET  /workspace/drive/items?parentId&query     -> DriveItem[]
 *   GET  /workspace/drive/items/{id}               -> DriveItem (incl. embedUrl)
 *   GET  /workspace/drive/breadcrumbs?folderId     -> DriveBreadcrumb[]
 *   POST /workspace/drive/folders  { parentId, name }    -> DriveItem
 *   POST /workspace/drive/files    (multipart: parentId + file) -> DriveItem
 *   POST /workspace/drive/items/{id}/star          -> 204
 *   GET  /workspace/mail/threads                   -> MailThread[]
 *   GET  /workspace/mail/threads/{id}              -> MailThreadDetail
 *   POST /workspace/mail/threads/{id}/read         -> 204
 *   POST /workspace/mail/threads/{id}/star         -> 204
 *   POST /workspace/mail/send  SendMailInput       -> MailMessage
 */
const httpWorkspaceApi: WorkspaceApi = {
  getAccount: (signal) =>
    apiClient.get<WorkspaceAccount>('/workspace/account', { signal }),

  listDriveItems: ({ parentId, query, signal }) => {
    const params = new URLSearchParams();
    if (parentId) params.set('parentId', parentId);
    if (query) params.set('query', query);
    const qs = params.toString();
    return apiClient.get<DriveItem[]>(
      `/workspace/drive/items${qs ? `?${qs}` : ''}`,
      { signal },
    );
  },

  getDriveItem: (itemId, signal) =>
    apiClient.get<DriveItem>(`/workspace/drive/items/${itemId}`, { signal }),

  getDriveBreadcrumbs: (folderId, signal) =>
    apiClient.get<DriveBreadcrumb[]>(
      `/workspace/drive/breadcrumbs${folderId ? `?folderId=${folderId}` : ''}`,
      { signal },
    ),

  createFolder: (input: CreateFolderInput) =>
    apiClient.post<DriveItem>('/workspace/drive/folders', input),

  uploadFile: ({ parentId, file }: UploadDriveFileInput) => {
    const form = new FormData();
    if (parentId) form.set('parentId', parentId);
    form.set('file', file);
    return apiClient.postForm<DriveItem>('/workspace/drive/files', form);
  },

  toggleDriveStar: (itemId) =>
    apiClient.post(`/workspace/drive/items/${itemId}/star`, undefined),

  listMailThreads: (signal) =>
    apiClient.get<MailThread[]>('/workspace/mail/threads', { signal }),

  getMailThread: (threadId, signal) =>
    apiClient.get<MailThreadDetail>(`/workspace/mail/threads/${threadId}`, {
      signal,
    }),

  markThreadRead: (threadId) =>
    apiClient.post(`/workspace/mail/threads/${threadId}/read`, undefined),

  toggleMailStar: (threadId) =>
    apiClient.post(`/workspace/mail/threads/${threadId}/star`, undefined),

  sendMail: (input: SendMailInput) =>
    apiClient.post<MailMessage>('/workspace/mail/send', input),
};

export const workspaceApi: WorkspaceApi = env.apiBaseUrl
  ? httpWorkspaceApi
  : devWorkspaceApi;
