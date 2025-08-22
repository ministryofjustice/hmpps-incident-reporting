import type { Status } from './statuses'

/** Report statuses grouped into work lists */
export const workLists = [
  { code: 'toDo', description: 'To do', statuses: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED'] },

  {
    code: 'submitted',
    description: 'Submitted',
    statuses: ['AWAITING_REVIEW', 'UPDATED', 'ON_HOLD', 'WAS_CLOSED'],
  },
  { code: 'completed', description: 'Completed', statuses: ['CLOSED', 'DUPLICATE', 'NOT_REPORTABLE'] },
] as const

/** Codes for work list */
export type WorkList = (typeof workLists)[number]['code']

type WorkListMapping = Record<WorkList, Status[]>

/** Work list to status mapping */
export const workListMapping = workLists.reduce(
  (mapping, workList) => ({ ...mapping, [workList.code]: workList.statuses }),
  {} as WorkListMapping,
)

/** Work list codes */
export const workListCodes = workLists.map(workList => workList.code)
