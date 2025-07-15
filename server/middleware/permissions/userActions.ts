/** What can a user do to a report? */
export const userActions = [
  /** View all details */
  { code: 'view', description: 'View' },
  /** Change basic details, involvements and respond to questions */
  { code: 'edit', description: 'Edit' },
  /** Submit for review */
  { code: 'requestReview', description: 'Submit' },
  /** Submit for removal */
  { code: 'requestRemoval', description: 'Request to remove report' },
  /** Submit for removal as duplicate */
  { code: 'requestDuplicate', description: 'Request to mark duplicate' },
  /** Submit for removal as not reportable */
  { code: 'requestNotReportable', description: 'Request to mark not reportable' },
  /** Send back for changes */
  { code: 'requestCorrection', description: 'Request correction' },
  /** Move into own column & appropriate status */
  { code: 'recall', description: 'Recall' },
  /** Review and close */
  { code: 'close', description: 'Close' },
  /** Review and mark as duplicate */
  { code: 'markDuplicate', description: 'Mark as duplicate' },
  /** Review and mark as not reportable */
  { code: 'markNotReportable', description: 'Mark as not reportable' },
  /** Put on hold */
  { code: 'hold', description: 'Put on hold' },
] as const

export type UserAction = (typeof userActions)[number]['code']
