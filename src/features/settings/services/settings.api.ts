import { apiClient } from '../../../shared/api/api-client';
import { env } from '../../../shared/config/env';
import type {
  PhotoUploadResult,
  ProfileSettings,
  SettingsApi,
  SettingsOptions,
  WorkflowUpload,
} from '../types/settings.types';
import { devSettingsApi } from './settings.stub';

/**
 * Assumed backend contract (no API spec exists yet — confirm before release):
 *   GET    /settings/profile          -> ProfileSettings
 *   PUT    /settings/profile          -> ProfileSettings
 *   POST   /settings/profile/photo    -> PhotoUploadResult (multipart 'photo')
 *   GET    /settings/profile/options  -> SettingsOptions
 *   GET    /settings/uploads          -> WorkflowUpload[]
 *   POST   /settings/uploads          -> WorkflowUpload
 *   DELETE /settings/uploads/:id
 *
 * Upload progress is reported by the API on listUploads; clients poll
 * while any upload is incomplete. POST /settings/uploads currently sends
 * file metadata only — the real contract may require multipart.
 */
const httpSettingsApi: SettingsApi = {
  getProfile: (signal) =>
    apiClient.get<ProfileSettings>('/settings/profile', { signal }),
  updateProfile: (input) =>
    apiClient.put<ProfileSettings>('/settings/profile', input),
  uploadPhoto: (file) => {
    const form = new FormData();
    form.append('photo', file);
    return apiClient.postForm<PhotoUploadResult>(
      '/settings/profile/photo',
      form,
    );
  },
  getOptions: (signal) =>
    apiClient.get<SettingsOptions>('/settings/profile/options', { signal }),
  listUploads: (signal) =>
    apiClient.get<WorkflowUpload[]>('/settings/uploads', { signal }),
  uploadFile: (input) =>
    apiClient.post<WorkflowUpload>('/settings/uploads', input),
  removeUpload: (uploadId) =>
    apiClient.delete<void>(`/settings/uploads/${uploadId}`),
};

export const settingsApi: SettingsApi = env.apiBaseUrl
  ? httpSettingsApi
  : devSettingsApi;
