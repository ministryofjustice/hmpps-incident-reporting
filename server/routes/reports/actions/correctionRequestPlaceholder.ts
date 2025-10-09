import type { ApiUserAction } from '../../../middleware/permissions'

/**
 * This application does not require a comment from a user for certain actions
 * that result in posting a correction request.
 * For the data to remain compatible with NOMIS, we still need _some_ text in the `descriptionOfChange` field.
 * These placeholders will be used to make the data meaningful, but they will be hidden from users in this application.
 */
export function placeholderForCorrectionRequest(
  userAction: 'REQUEST_DUPLICATE' | 'MARK_DUPLICATE',
  originalReportReference: string,
): string
export function placeholderForCorrectionRequest(
  userAction: 'REQUEST_NOT_REPORTABLE' | 'MARK_NOT_REPORTABLE' | 'RECALL' | 'REQUEST_REVIEW' | 'CLOSE',
): string
// export function placeholderForCorrectionRequest(userAction: ApiUserAction, originalReportReference?: string): string
export function placeholderForCorrectionRequest(userAction: ApiUserAction, originalReportReference?: string): string {
  if (userAction === 'REQUEST_DUPLICATE') {
    return `(Report is a duplicate of ${originalReportReference})`
  }
  if (userAction === 'REQUEST_NOT_REPORTABLE') {
    return '(Not reportable)'
  }
  if (userAction === 'MARK_DUPLICATE') {
    return `(Report is a duplicate of ${originalReportReference})`
  }
  if (userAction === 'MARK_NOT_REPORTABLE') {
    return '(Not reportable)'
  }
  if (userAction === 'RECALL') {
    return '(Reopened)'
  }
  if (userAction === 'REQUEST_REVIEW') {
    return '(Submitted for review)'
  }
  if (userAction === 'CLOSE') {
    return '(Closed)'
  }
  throw new Error(`not implemented for ${userAction}`)
}

/**
 * If `CorrectionRequest.descriptionOfChange` matches, it will be hidden from users
 */
export function isCorrectionRequestPlaceholder(descriptionOfChange: string): boolean {
  return (
    descriptionOfChange === '(Not reportable)' ||
    descriptionOfChange === '(Reopened)' ||
    descriptionOfChange === '(Submitted for review)' ||
    descriptionOfChange === '(Closed)' ||
    /^\(Report is a duplicate of \d+\)$/.test(descriptionOfChange)
  )
}
