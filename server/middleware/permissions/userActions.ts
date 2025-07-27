/**
 * What can a user do to a report?
 * NB: codes map to enumeration constant in API, except VIEW, EDIT & REQUEST_REMOVAL
 */
export const userActions = [
  /** View all details */
  { code: 'VIEW', description: 'View' },
  /** Change basic details, involvements and respond to questions */
  { code: 'EDIT', description: 'Edit' },
  /** Submit for review */
  { code: 'REQUEST_REVIEW', description: 'Submit' },
  /** Submit request for removal */
  { code: 'REQUEST_REMOVAL', description: 'Request to remove report' },
  /** Send back for changes */
  { code: 'REQUEST_CORRECTION', description: 'Request correction' },
  /** Move into own column & appropriate status */
  { code: 'RECALL', description: 'Recall' },
  /** Review and close */
  { code: 'CLOSE', description: 'Close' },
  /** Review and mark as duplicate */
  { code: 'MARK_DUPLICATE', description: 'Mark as duplicate' },
  /** Review and mark as not reportable */
  { code: 'MARK_NOT_REPORTABLE', description: 'Mark as not reportable' },
  /** Put on hold */
  { code: 'HOLD', description: 'Put on hold' },
] as const

export type UserAction = (typeof userActions)[number]['code']

export const userActionMapping = Object.fromEntries(userActions.map(action => [action.code, action]))

export function parseUserActionCode(code: unknown): code is UserAction {
  return userActions.some(action => action.code === code)
}
