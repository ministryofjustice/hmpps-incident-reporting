import type { ApiUserAction } from '../../../middleware/permissions'

export const correctionRequestActionLabels: Record<ApiUserAction, string> = {
  REQUEST_REVIEW: 'Resubmitted',
  REQUEST_CORRECTION: 'Sent back',
  CLOSE: 'Closed',
  MARK_DUPLICATE: 'Report removed because of duplication',
  MARK_NOT_REPORTABLE: 'Report removed because incident not reportable',
  HOLD: 'Put on hold',
  REQUEST_DUPLICATE: 'Request to remove duplicate report',
  REQUEST_NOT_REPORTABLE: 'Request to remove not reportable incident',
  // actions below do not currently post correction requests, but are included for completeness
  RECALL: 'Comment',
}
