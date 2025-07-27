/**
 * Categories of users with permissions
 * NB: codes map to enumeration constant in API, except HQ_VIEWER
 */
export const userTypes = [
  { code: 'DATA_WARDEN', description: 'Data warden' },
  { code: 'REPORTING_OFFICER', description: 'Reporting officer' },
  { code: 'HQ_VIEWER', description: 'HQ viewer' }, // TODO: is there a better name?
] as const

export type UserType = (typeof userTypes)[number]['code']
