import { ORG_DEPARTMENTS } from '../../../shared/dev/org-units';
import type {
  PhotoUploadResult,
  ProfileInput,
  ProfileSettings,
  SettingsApi,
  SettingsOptions,
  TimeZoneOption,
  UploadInput,
  WorkflowUpload,
} from '../types/settings.types';

const SIMULATED_LATENCY_MS = 300;
const UPLOAD_DURATION_MS = 30_000;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

const TIME_ZONES: TimeZoneOption[] = [
  { value: 'pst', label: 'Pacific Standard Time (PST)  UTC−08:00' },
  { value: 'est', label: 'Eastern Standard Time (EST)  UTC−05:00' },
  { value: 'gmt', label: 'Greenwich Mean Time (GMT)  UTC+00:00' },
  { value: 'wat', label: 'West Africa Time (WAT)  UTC+01:00' },
  { value: 'cet', label: 'Central European Time (CET)  UTC+01:00' },
  { value: 'eat', label: 'East Africa Time (EAT)  UTC+03:00' },
];

let profile: ProfileSettings = {
  firstName: 'Olivia',
  lastName: 'Rhye',
  email: 'olivia@untitledui.com',
  photoUrl: undefined,
  title: 'Head Of Department',
  department: 'Finance Department',
  timeZone: 'pst',
  bio: "I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development.",
  notificationsMuted: true,
};

/**
 * Progress is derived from elapsed time so the dev environment can show
 * realistic in-flight uploads without a server. startedAt offsets seed the
 * list at the percentages shown in the design.
 */
interface DevUpload {
  id: string;
  fileName: string;
  sizeBytes: number;
  startedAt: number;
  durationMs: number;
}

const seedTime = Date.now();
let uploads: DevUpload[] = [
  {
    id: 'upl-1',
    fileName: 'Tech design requirements.pdf',
    sizeBytes: 200 * 1024,
    startedAt: seedTime - UPLOAD_DURATION_MS,
    durationMs: UPLOAD_DURATION_MS,
  },
  {
    id: 'upl-2',
    fileName: 'Dashboard prototype recording.mp4',
    sizeBytes: 16 * 1024 * 1024,
    startedAt: seedTime - 0.4 * UPLOAD_DURATION_MS,
    durationMs: UPLOAD_DURATION_MS,
  },
  {
    id: 'upl-3',
    fileName: 'Dashboard prototype FINAL.fig',
    sizeBytes: 4_404_019,
    startedAt: seedTime - 0.8 * UPLOAD_DURATION_MS,
    durationMs: UPLOAD_DURATION_MS,
  },
];
let nextUploadId = uploads.length + 1;

function toUpload(upload: DevUpload): WorkflowUpload {
  const elapsed = Date.now() - upload.startedAt;
  return {
    id: upload.id,
    fileName: upload.fileName,
    sizeBytes: upload.sizeBytes,
    progress: Math.min(100, Math.round((elapsed / upload.durationMs) * 100)),
  };
}

/**
 * Development-only settings fixtures used when no VITE_API_BASE_URL is
 * configured. Values are generated, not real data.
 */
export const devSettingsApi: SettingsApi = {
  async getProfile(): Promise<ProfileSettings> {
    await delay();
    return profile;
  },

  async updateProfile(input: ProfileInput): Promise<ProfileSettings> {
    await delay();
    profile = { ...input };
    return profile;
  },

  async uploadPhoto(file: File): Promise<PhotoUploadResult> {
    await delay();
    // Local preview URL so the dev flow shows the chosen image.
    const photoUrl = URL.createObjectURL(file);
    profile = { ...profile, photoUrl };
    return { photoUrl };
  },

  async getOptions(): Promise<SettingsOptions> {
    await delay();
    return {
      departments: ORG_DEPARTMENTS.map((department) => department.name),
      timeZones: TIME_ZONES,
    };
  },

  async listUploads(): Promise<WorkflowUpload[]> {
    await delay();
    return uploads.map(toUpload);
  },

  async uploadFile(input: UploadInput): Promise<WorkflowUpload> {
    await delay();
    const upload: DevUpload = {
      id: `upl-${nextUploadId++}`,
      fileName: input.fileName,
      sizeBytes: input.sizeBytes,
      startedAt: Date.now(),
      durationMs: UPLOAD_DURATION_MS,
    };
    uploads = [...uploads, upload];
    return toUpload(upload);
  },

  async removeUpload(uploadId: string): Promise<void> {
    await delay();
    uploads = uploads.filter((upload) => upload.id !== uploadId);
  },
};
