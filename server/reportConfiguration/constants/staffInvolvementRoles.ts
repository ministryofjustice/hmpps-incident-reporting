// Generated with ./scripts/importDpsConstants.ts at 2024-11-06T10:46:41.177Z

/** Roles of staff involvement in an incident */
export const staffInvolvementRoles = [
  { code: 'ACTIVELY_INVOLVED', description: 'Actively involved', nomisCodes: ['AI', 'INV'] },
  { code: 'AUTHORISING_OFFICER', description: 'Authorising officer', nomisCodes: ['AO'] },
  { code: 'CR_HEAD', description: 'Control and restraint - head', nomisCodes: ['CRH'] },
  { code: 'CR_LEFT_ARM', description: 'Control and restraint - left arm', nomisCodes: ['CRL'] },
  { code: 'CR_LEGS', description: 'Control and restraint - legs', nomisCodes: ['CRLG'] },
  { code: 'CR_RIGHT_ARM', description: 'Control and restraint - right arm', nomisCodes: ['CRR'] },
  { code: 'CR_SUPERVISOR', description: 'Control and restraint - supervisor', nomisCodes: ['CRS'] },
  { code: 'DECEASED', description: 'Deceased', nomisCodes: ['DEC'] },
  { code: 'FIRST_ON_SCENE', description: 'First on scene', nomisCodes: ['FOS'] },
  { code: 'HEALTHCARE', description: 'Healthcare', nomisCodes: ['HEALTH'] },
  { code: 'HOSTAGE', description: 'Hostage', nomisCodes: ['HOST'] },
  { code: 'IN_POSSESSION', description: 'In possession', nomisCodes: ['INPOS'] },
  { code: 'NEGOTIATOR', description: 'Negotiator', nomisCodes: ['NEG'] },
  { code: 'PRESENT_AT_SCENE', description: 'Present at scene', nomisCodes: ['PAS'] },
  { code: 'SUSPECTED_INVOLVEMENT', description: 'Suspected involvement', nomisCodes: ['SUSIN'] },
  { code: 'VICTIM', description: 'Victim', nomisCodes: ['VICT'] },
  { code: 'WITNESS', description: 'Witness', nomisCodes: ['WIT'] },
] as const

/** Roles of staff involvement in an incident */
export type StaffInvolvementRoleDetails = (typeof staffInvolvementRoles)[number]

/** Codes for roles of staff involvement in an incident */
export type StaffInvolvementRole = StaffInvolvementRoleDetails['code']

/**
 * NOMIS codes for Roles of staff involvement in an incident
 * @deprecated
 */
export type NomisStaffInvolvementRole = StaffInvolvementRoleDetails['nomisCodes'][number]

/** Lookup for roles of staff involvement in an incident */
export function getStaffInvolvementRoleDetails(code: string): StaffInvolvementRoleDetails | null {
  return staffInvolvementRoles.find(item => item.code === code) ?? null
}
