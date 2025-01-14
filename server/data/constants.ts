export const transferPrisonId = 'TRN' as const
export type TransferPrisonId = typeof transferPrisonId

export const outsidePrisonId = 'OUT' as const
export type OutsidePrisonId = typeof outsidePrisonId

/**
 * HQ role for viewing incident reports.
 * This allows a user to view  incident reports in within their caseloads.
 * TODO: should they also see PECS region reports? for now: no
 */
export const roleReadOnly = 'INCIDENT_REPORTS__RO' as const

/**
 * Reporting Officer role for incident reporting.
 * This allows a user to view and create new incident reports in within their caseloads.
 * It does not allow approval of incident reports nor creating of reports outside their caseloads.
 * TODO: should they conditionally see PECS region reports? for now: no
 */
export const roleReadWrite = 'INCIDENT_REPORTS__RW' as const

/**
 * Data Warden role.
 * This allows users to view and approve or reject incident reports, raised by reporting officers.
 * Caseloads are required to perform an action.
 * TODO: should they have automatic access to all prison caseloads? for now: no
 * TODO: should they have automatic access to all PECS regions? for now: no
 */
export const roleApproveReject = 'INCIDENT_REPORTS__APPROVE' as const
