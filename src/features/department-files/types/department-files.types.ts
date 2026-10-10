/** A node in the department files hierarchy (department or sub-unit). */
export interface DepartmentUnit {
  id: string;
  name: string;
  /** Null for top-level departments, otherwise the parent unit id. */
  parentId: string | null;
  /** The unit contains items flagged for attention. */
  hasAttention: boolean;
}

/**
 * Signed-in user's file-access scope, derived from their role:
 * top-level roles (permanent secretary / DG) get no scope and see every
 * department; a department head is limited to `departmentId`; staff are
 * further limited to `unitId`. The real backend derives this from the
 * session token — the dev stub filters on these fields instead.
 */
export interface UnitAccess {
  departmentId?: string;
  unitId?: string;
}

export interface DepartmentUnitsQuery {
  parentId: string | null;
  search: string;
  access?: UnitAccess;
}

export type UnitFileStatus = 'processing' | 'success' | 'declined';

export interface UnitFilePerson {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface UnitFileRecord {
  id: string;
  fileNo: string;
  subject: string;
  initiatedBy: UnitFilePerson;
  currentHolder: UnitFilePerson;
  status: UnitFileStatus;
  documentType: string;
  /** ISO 8601 timestamp. */
  lastUpdated: string;
}

export interface UnitFilesQuery {
  unitId: string;
  search: string;
  status?: UnitFileStatus;
  documentType?: string;
  /** ISO date (yyyy-mm-dd) bounds on lastUpdated. */
  from?: string;
  to?: string;
  page: number;
}

export interface UnitFilesPage {
  items: UnitFileRecord[];
  page: number;
  totalPages: number;
  total: number;
}

export interface UnitFileFilterOptions {
  documentTypes: string[];
}

export interface DepartmentFilesApiOptions {
  signal?: AbortSignal;
}

export interface DepartmentFilesApi {
  listUnits(
    query: DepartmentUnitsQuery,
    options?: DepartmentFilesApiOptions,
  ): Promise<DepartmentUnit[]>;
  getUnit(
    id: string,
    options?: DepartmentFilesApiOptions,
  ): Promise<DepartmentUnit | null>;
  listUnitFiles(
    query: UnitFilesQuery,
    options?: DepartmentFilesApiOptions,
  ): Promise<UnitFilesPage>;
  listUnitFileFilterOptions(
    options?: DepartmentFilesApiOptions,
  ): Promise<UnitFileFilterOptions>;
}
