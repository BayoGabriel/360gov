import { describe, expect, it } from 'vitest';
import type { CapabilityUser } from '../../../shared/auth/permissions';
import {
  recipientsFor,
  type DirectoryParty,
  type RecipientPurpose,
} from './recipient-scope';

/**
 * Fixture mirroring the staff directory in documents.stub.ts: one EVC
 * office contact, three departments each with a head, a secretariat,
 * unit heads and officers.
 */
interface Party extends DirectoryParty {
  id: string;
}

const CORP = 'corporate-services';
const PROC = 'procurement';
const FIN = 'finance';
const CORP_FAC = 'corporate-services-facility-maintenance';
const CORP_GEN = 'corporate-services-general-services';
const PROC_PLAN = 'procurement-planning-research-data-management';

const DIRECTORY: Party[] = [
  { id: 'evc-sec', role: 'evc' },
  { id: 'hod-corp', role: 'department-head', departmentId: CORP },
  { id: 'hod-proc', role: 'department-head', departmentId: PROC },
  { id: 'hod-fin', role: 'department-head', departmentId: FIN },
  {
    id: 'sec-corp',
    role: 'department-secretariat',
    departmentId: CORP,
  },
  {
    id: 'sec-proc',
    role: 'department-secretariat',
    departmentId: PROC,
  },
  {
    id: 'sec-fin',
    role: 'department-secretariat',
    departmentId: FIN,
  },
  {
    id: 'hou-fac',
    role: 'unit-head',
    departmentId: CORP,
    unitId: CORP_FAC,
  },
  {
    id: 'hou-gen',
    role: 'unit-head',
    departmentId: CORP,
    unitId: CORP_GEN,
  },
  {
    id: 'hou-plan',
    role: 'unit-head',
    departmentId: PROC,
    unitId: PROC_PLAN,
  },
  {
    id: 'off-fac-1',
    role: 'officer',
    departmentId: CORP,
    unitId: CORP_FAC,
  },
  {
    id: 'off-fac-2',
    role: 'officer',
    departmentId: CORP,
    unitId: CORP_FAC,
  },
  {
    id: 'off-plan',
    role: 'officer',
    departmentId: PROC,
    unitId: PROC_PLAN,
  },
];

function ids(
  purpose: RecipientPurpose,
  user: CapabilityUser,
): string[] {
  return recipientsFor(purpose, user, DIRECTORY).map((p) => p.id);
}

const corpOfficer: CapabilityUser = {
  role: 'officer',
  departmentId: CORP,
  unitId: CORP_FAC,
};
const corpUnitHead: CapabilityUser = {
  role: 'unit-head',
  departmentId: CORP,
  unitId: CORP_FAC,
};
const corpHod: CapabilityUser = {
  role: 'department-head',
  departmentId: CORP,
};
const corpSecretariat: CapabilityUser = {
  role: 'department-secretariat',
  departmentId: CORP,
};
const evc: CapabilityUser = { role: 'evc' };

describe('forward targets follow the routing chain', () => {
  it('officer returns the file to their own Head of Unit only', () => {
    expect(ids('forward', corpOfficer)).toEqual(['hou-fac']);
  });

  it('unit head returns the file to their own Head of Department only', () => {
    expect(ids('forward', corpUnitHead)).toEqual(['hod-corp']);
  });

  it('secretariat routes to its head of department and peer secretariats', () => {
    expect(ids('forward', corpSecretariat)).toEqual([
      'hod-corp',
      'sec-proc',
      'sec-fin',
    ]);
  });

  it('head of department submits to the EVC and dispatches onward', () => {
    expect(ids('forward', corpHod)).toEqual([
      'evc-sec',
      'hod-proc',
      'hod-fin',
      'sec-corp',
    ]);
  });

  it('EVC routes onward to departments — never to the EVC itself', () => {
    const targets = ids('forward', evc);
    expect(targets).toEqual([
      'hod-corp',
      'hod-proc',
      'hod-fin',
      'sec-corp',
      'sec-proc',
      'sec-fin',
    ]);
    expect(targets).not.toContain('evc-sec');
    expect(
      recipientsFor('forward', evc, DIRECTORY).every(
        (p) => p.role !== 'evc',
      ),
    ).toBe(true);
  });
});

describe('assign targets step one level down', () => {
  it('head of department assigns to unit heads in the department', () => {
    expect(ids('assign', corpHod)).toEqual(['hou-fac', 'hou-gen']);
  });

  it('unit head assigns to officers in the unit', () => {
    expect(ids('assign', corpUnitHead)).toEqual([
      'off-fac-1',
      'off-fac-2',
    ]);
  });

  it('roles without assignment authority get no targets', () => {
    expect(ids('assign', corpOfficer)).toEqual([]);
    expect(ids('assign', corpSecretariat)).toEqual([]);
    expect(ids('assign', evc)).toEqual([]);
  });
});

describe('revision targets send work back down the chain', () => {
  it('EVC returns files to heads of department', () => {
    expect(ids('revision', evc)).toEqual([
      'hod-corp',
      'hod-proc',
      'hod-fin',
    ]);
  });

  it('head of department returns to its unit heads', () => {
    expect(ids('revision', corpHod)).toEqual(['hou-fac', 'hou-gen']);
  });

  it('unit head returns to its officers', () => {
    expect(ids('revision', corpUnitHead)).toEqual([
      'off-fac-1',
      'off-fac-2',
    ]);
  });

  it('officers and secretariat cannot request revisions', () => {
    expect(ids('revision', corpOfficer)).toEqual([]);
    expect(ids('revision', corpSecretariat)).toEqual([]);
  });
});
