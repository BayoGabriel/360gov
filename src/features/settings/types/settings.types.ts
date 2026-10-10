export interface TimeZoneOption {
  value: string;
  label: string;
}

/** Selectable values served alongside the profile form. */
export interface SettingsOptions {
  departments: string[];
  timeZones: TimeZoneOption[];
}

export interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  /** URL of the stored profile photo, if one has been uploaded. */
  photoUrl?: string;
  title: string;
  /** Department name; must match one of SettingsOptions.departments. */
  department: string;
  /** Value matching one of SettingsOptions.timeZones. */
  timeZone: string;
  /** Plain text with optional lightweight markup applied by the toolbar. */
  bio: string;
  notificationsMuted: boolean;
}

/** Payload accepted by the profile update endpoint. */
export type ProfileInput = ProfileSettings;

export interface PhotoUploadResult {
  photoUrl: string;
}

export interface WorkflowUpload {
  id: string;
  fileName: string;
  sizeBytes: number;
  /** Upload progress percentage, 0-100. 100 means the file is stored. */
  progress: number;
}

export interface UploadInput {
  fileName: string;
  sizeBytes: number;
}

export interface SettingsApi {
  getProfile(signal?: AbortSignal): Promise<ProfileSettings>;
  updateProfile(input: ProfileInput): Promise<ProfileSettings>;
  uploadPhoto(file: File): Promise<PhotoUploadResult>;
  getOptions(signal?: AbortSignal): Promise<SettingsOptions>;
  listUploads(signal?: AbortSignal): Promise<WorkflowUpload[]>;
  uploadFile(input: UploadInput): Promise<WorkflowUpload>;
  removeUpload(uploadId: string): Promise<void>;
}
