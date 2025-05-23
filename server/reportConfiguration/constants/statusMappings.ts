import type { Status } from './statuses'

export type WorkListMapping = {
  code: string
  description: string
  statuses: Status[]
}

/** Report work list status mappings */
export const workListMapping: WorkListMapping[] = [
  { code: 'toDo', description: 'To do', statuses: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED'] },

  {
    code: 'submitted',
    description: 'Submitted',
    statuses: ['AWAITING_REVIEW', 'UPDATED', 'ON_HOLD', 'WAS_CLOSED'],
  },
  { code: 'done', description: 'Done', statuses: ['CLOSED', 'DUPLICATE', 'NOT_REPORTABLE'] },
] as const

/** Work list options */
export type WorkListDetails = (typeof workListMapping)[number]

/** Codes for work list */
export type WorkList = WorkListDetails['code']
// TODO: WorkList is actually just `string` so offers no type code-based checking

export type WorkListStatusMapping = { [key: WorkList]: Status[] }

export const workListStatusMapping: WorkListStatusMapping = workListMapping.reduce(
  (prev, workListOption) => ({ ...prev, [workListOption.code]: workListOption.statuses }),
  {},
)

export const workListCodes = workListMapping.map(mapping => mapping.code)

// TODO: map these final statuses appropriately if necessary – not needed yet and they will eventually be removed from NOMIS
// { code: 'POST_INCIDENT_UPDATE', description: 'Post-incident update', nomisCode: 'PIU' },
