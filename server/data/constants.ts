export const transferPrisonId = 'TRN' as const
export type TransferPrisonId = typeof transferPrisonId

export const outsidePrisonId = 'OUT' as const
export type OutsidePrisonId = typeof outsidePrisonId

/**
 * HQ role for viewing incident reports.
 * This allows a user to view  incident reports in within their caseloads.
 * TODO: should they also see regions and PECS?
 */
export const roleReadOnly = 'INCIDENT_REPORTS__RO' as const

/**
 * Reporting Officer role for incident reporting.
 * This allows a user to view and create new incident reports in within their caseloads.
 * It does not allow approval of incident reports nor creating of reports outside their caseloads.
 */
export const roleReadWrite = 'INCIDENT_REPORTS__RW' as const

/**
 * Data warden role.
 * Used to view and approve or reject incident reports, raised by reporting officers.
 * TODO: do they require caseloads? probably not sunce they need to action regions and PECS.
 */
export const roleApproveReject = 'INCIDENT_REPORTS__APPROVE' as const

// TODO: add role for data warden to report outside of own caseloads (e.g. for region or PECS)
