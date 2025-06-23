/** Categories of users with permissions */
export const userTypes = [
  { code: 'dataWarden', description: 'Data warden' },
  { code: 'reportingOfficer', description: 'Reporting officer' },
  { code: 'hqViewer', description: 'HQ viewer' }, // TODO: is there a better name?
] as const

export type UserType = (typeof userTypes)[number]['code']
