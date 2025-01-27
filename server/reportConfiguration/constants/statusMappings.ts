import type { Status } from './statuses'

export type WorkListMapping = {
  code: string
  description: string
  statuses: Status[]
}

/** Report work list status mappings */
export const workListMapping: WorkListMapping[] = [
  { code: 'toDo', description: 'To do', statuses: ['DRAFT', 'INFORMATION_REQUIRED'] },
  {
    code: 'submitted',
    description: 'Submitted',
    statuses: ['AWAITING_ANALYSIS', 'INFORMATION_AMENDED', 'IN_ANALYSIS'],
  },
  { code: 'done', description: 'Done', statuses: ['CLOSED', 'DUPLICATE'] },
] as const

/** Work list options */
export type WorkListDetails = (typeof workListMapping)[number]

/** Codes for work list */
export type WorkList = WorkListDetails['code']

export type WorkListStatusMapping = { [key: WorkList]: Status[] }

export const workListStatusMapping: WorkListStatusMapping = workListMapping.reduce(
  (prev, workListOption) => ({ ...prev, [workListOption.code]: workListOption.statuses }),
  {},
)

// { code: 'POST_INCIDENT_UPDATE', description: 'Post-incident update', nomisCode: 'PIU' },
// { code: 'INCIDENT_UPDATED', description: 'Incident updated', nomisCode: 'IUP' },
