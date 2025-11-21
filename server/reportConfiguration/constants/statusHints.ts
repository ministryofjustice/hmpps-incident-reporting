import type { Status } from './statuses'

export const statusHints: Record<Status, string> = {
  DRAFT: 'A report that has been created but not yet submitted.',
  NEEDS_UPDATING: 'A report that has been submitted and sent back for updates.',
  REOPENED: 'A report that has been reopened after it was closed/completed.',
  AWAITING_REVIEW: 'A report that has been submitted for the first time and is now ready for review.',
  UPDATED: 'A report that has been submitted more than one time and ready for review.',
  ON_HOLD: 'The report has been set aside for investigation and cannot be edited at this time.',
  WAS_CLOSED: 'A report that has been reopened from completed and then resubmitted.',
  CLOSED: 'A report that has been submitted, reviewed and is now complete.',
  DUPLICATE: 'A copy of a report that already exists.',
  NOT_REPORTABLE: 'A report for an incident that did not need to be created.',
}
