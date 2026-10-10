/**
 * Development-only organizational fixture shared by feature stubs so their
 * fake "backend" serves one consistent hierarchy (departments -> units ->
 * files). Not used by production code paths; the HTTP implementations read
 * this structure from the API instead.
 */
export interface OrgUnit {
  id: string;
  name: string;
  parentId: string | null;
  /** Units flagged as containing items that need attention. */
  hasAttention: boolean;
}

export const ORG_DEPARTMENTS: OrgUnit[] = [
  { id: 'finance', name: 'Finance Department', parentId: null, hasAttention: true },
  { id: 'procurement', name: 'Procurement Department', parentId: null, hasAttention: false },
  { id: 'legal', name: 'Legal Department', parentId: null, hasAttention: true },
  { id: 'ict', name: 'ICT Department', parentId: null, hasAttention: false },
  { id: 'registry', name: 'Registry Department', parentId: null, hasAttention: false },
  { id: 'hr', name: 'Human Resources Department', parentId: null, hasAttention: false },
  { id: 'planning', name: 'Planning & Research Department', parentId: null, hasAttention: false },
  { id: 'audit', name: 'Internal Audit Department', parentId: null, hasAttention: false },
  { id: 'admin', name: 'Administration Department', parentId: null, hasAttention: false },
  { id: 'prs', name: 'Public Relations Department', parentId: null, hasAttention: false },
];

const UNIT_NAMES = [
  'Secretary',
  'Procurement',
  'Records',
  'Accounts',
  'Field Operations',
];

export const ORG_UNITS: OrgUnit[] = ORG_DEPARTMENTS.flatMap(
  (department, deptIndex) =>
    UNIT_NAMES.map((name, unitIndex) => ({
      id: `${department.id}-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
      name,
      parentId: department.id,
      hasAttention: (deptIndex + unitIndex) % 9 === 4,
    })),
);
