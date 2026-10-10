import { ORG_DEPARTMENTS, ORG_UNITS } from '../../../shared/dev/org-units';
import type {
  DepartmentFilesApi,
  DepartmentUnit,
  DepartmentUnitsQuery,
  UnitFilePerson,
  UnitFileRecord,
  UnitFilesPage,
  UnitFilesQuery,
  UnitFileStatus,
} from '../types/department-files.types';

const SIMULATED_LATENCY_MS = 300;
const PAGE_SIZE = 9;
const FILES_PER_UNIT = 24;
const ALL_UNITS: DepartmentUnit[] = [...ORG_DEPARTMENTS, ...ORG_UNITS];

const PEOPLE: UnitFilePerson[] = [
  {
    name: 'Olivia Rhye',
    email: 'olivia@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Phoenix Baker',
    email: 'phoenix@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Lana Steiner',
    email: 'lana@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Demi Wilkinson',
    email: 'demi@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/women/17.jpg',
  },
  {
    name: 'Candice Wu',
    email: 'candice@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/women/79.jpg',
  },
  {
    name: 'Natali Craig',
    email: 'natali@untitledui.com',
    avatarUrl: 'https://randomuser.me/api/portraits/women/26.jpg',
  },
];

const SUBJECTS = [
  'Tesla, Inc.',
  'Match Group, Inc.',
  'Datadog Inc',
  'ARK Genomic Revolution ETF',
  'Square, Inc.',
  'MicroStrategy Inc.',
];

const DOCUMENT_TYPES = ['Contract', 'Memo', 'Report', 'Circular', 'Invoice'];
const STATUSES: UnitFileStatus[] = ['processing', 'success', 'declined'];

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

function seedOf(id: string): number {
  return [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
}

function matches(unit: DepartmentUnit, query: DepartmentUnitsQuery): boolean {
  if (unit.parentId !== query.parentId) return false;
  const access = query.access;
  if (access?.departmentId) {
    if (unit.parentId === null) {
      if (unit.id !== access.departmentId) return false;
    } else if (unit.parentId !== access.departmentId) {
      return false;
    }
  }
  if (access?.unitId && unit.parentId !== null && unit.id !== access.unitId) {
    return false;
  }
  const q = query.search.trim().toLowerCase();
  return !q || unit.name.toLowerCase().includes(q);
}

function makeFile(unitId: string, index: number): UnitFileRecord {
  const seed = seedOf(unitId) + index * 7;
  return {
    id: `${unitId}-file-${index + 1}`,
    fileNo: `12/234/A${132 + (seed % 4)}-${20 + (seed % 9)}`,
    subject: SUBJECTS[seed % SUBJECTS.length],
    initiatedBy: PEOPLE[seed % PEOPLE.length],
    currentHolder: PEOPLE[(seed + 3) % PEOPLE.length],
    status: STATUSES[seed % STATUSES.length],
    documentType: DOCUMENT_TYPES[seed % DOCUMENT_TYPES.length],
    lastUpdated: `2022-01-${String(6 + (seed % 8)).padStart(2, '0')}T09:${String(
      10 + (seed % 50),
    ).padStart(2, '0')}:00`,
  };
}

function fileMatches(file: UnitFileRecord, query: UnitFilesQuery): boolean {
  const q = query.search.trim().toLowerCase();
  if (
    q &&
    !`${file.fileNo} ${file.subject}`.toLowerCase().includes(q)
  ) {
    return false;
  }
  if (query.status && file.status !== query.status) return false;
  if (query.documentType && file.documentType !== query.documentType) {
    return false;
  }
  const day = file.lastUpdated.slice(0, 10);
  if (query.from && day < query.from) return false;
  if (query.to && day > query.to) return false;
  return true;
}

/**
 * Development-only org-unit and file fixtures used when no
 * VITE_API_BASE_URL is configured. Backed by the shared org fixture so the
 * hierarchy is consistent with other feature stubs.
 */
export const devDepartmentFilesApi: DepartmentFilesApi = {
  async listUnits(query: DepartmentUnitsQuery): Promise<DepartmentUnit[]> {
    await delay();
    return ALL_UNITS.filter((unit) => matches(unit, query));
  },

  async getUnit(id: string): Promise<DepartmentUnit | null> {
    await delay();
    return ALL_UNITS.find((unit) => unit.id === id) ?? null;
  },

  async listUnitFiles(query: UnitFilesQuery): Promise<UnitFilesPage> {
    await delay();
    const files = Array.from({ length: FILES_PER_UNIT }, (_, i) =>
      makeFile(query.unitId, i),
    )
      .filter((file) => fileMatches(file, query))
      .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
    const totalPages = Math.max(1, Math.ceil(files.length / PAGE_SIZE));
    const page = Math.min(Math.max(1, query.page), totalPages);
    const start = (page - 1) * PAGE_SIZE;
    return {
      items: files.slice(start, start + PAGE_SIZE),
      page,
      totalPages,
      total: files.length,
    };
  },

  async listUnitFileFilterOptions() {
    await delay();
    return { documentTypes: DOCUMENT_TYPES };
  },
};
