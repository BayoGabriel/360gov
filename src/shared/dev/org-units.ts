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
  /** Designated scopes of work handled by the unit, where known. */
  scopes?: string[];
}

export const ORG_DEPARTMENTS: OrgUnit[] = [
  { id: 'corporate-services', name: 'Corporate Services Department', parentId: null, hasAttention: true },
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

/** Departments with a known, ministry-confirmed unit structure. */
const NAMED_UNITS: Record<string, { name: string; scopes?: string[] }[]> = {
  'corporate-services': [
    { name: 'Department Secretariat' },
    {
      name: 'General Services',
      scopes: ['Fleet management', 'Store management', 'Mail room'],
    },
    {
      name: 'Facility Maintenance',
      scopes: [
        'Plumbing',
        'Electricals',
        'Renovations',
        'Building structure maintenance',
        'Building services',
      ],
    },
    {
      name: 'Estate Maintenance',
      scopes: ['HSE', 'Office allocation', 'Fixed asset'],
    },
  ],
  procurement: [
    { name: 'Department Secretariat' },
    { name: 'Planning, Research & Data Management' },
    { name: 'Tenders & Contract Administration' },
    { name: 'Compliance, Monitoring & Evaluation' },
    { name: 'Logistics, Store & Inventory Management' },
  ],
};

const GENERIC_UNIT_NAMES = [
  'Secretariat',
  'Records',
  'Accounts',
  'Field Operations',
  'Planning',
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z]+/g, '-');
}

export const ORG_UNITS: OrgUnit[] = ORG_DEPARTMENTS.flatMap(
  (department, deptIndex) => {
    const units = NAMED_UNITS[department.id]?.map((u) => u.name) ??
      GENERIC_UNIT_NAMES;
    const scopes = NAMED_UNITS[department.id]?.map((u) => u.scopes) ?? [];
    return units.map((name, unitIndex) => ({
      id: `${department.id}-${slugify(name)}`,
      name,
      parentId: department.id,
      hasAttention: (deptIndex + unitIndex) % 9 === 4,
      scopes: scopes[unitIndex],
    }));
  },
);

/** Units belonging to a given department id, in declared order. */
export function unitsOf(departmentId: string): OrgUnit[] {
  return ORG_UNITS.filter((unit) => unit.parentId === departmentId);
}
