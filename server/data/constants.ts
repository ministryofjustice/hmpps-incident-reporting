export const transferPrisonId = 'TRN' as const
export type TransferPrisonId = typeof transferPrisonId

export const outsidePrisonId = 'OUT' as const
export type OutsidePrisonId = typeof outsidePrisonId

/**
 * HQ role for viewing incident reports.
 * This allows a user to view  incident reports in within their caseloads, but not change them in any way.
 * Viewing PECS reports is granted with additional role.
 */
export const roleReadOnly = 'INCIDENT_REPORTS__RO' as const

/**
 * Reporting Officer role for incident reporting.
 * This allows a user to view and create new incident reports in within their caseloads.
 * It does not allow reviewing incident reports nor creating of reports outside their caseloads.
 * Viewing PECS reports is granted with additional role.
 */
export const roleReadWrite = 'INCIDENT_REPORTS__RW' as const

/**
 * Data Warden role.
 * This allows users to view and review incident reports, raised by reporting officers.
 * Caseloads are required to perform an action.
 * Creating and editing PECS reports is granted with additional role.
 */
export const roleApproveReject = 'INCIDENT_REPORTS__APPROVE' as const

/**
 * PECS role.
 * This is used in addition to the roles above to grant access to PECS reports.
 * Acts similarly to a user caseload for reports whose location is a PECS region.
 */
export const rolePecs = 'INCIDENT_REPORTS__PECS' as const

// TODO: will management reporting need a separate role?

/**
 * Used by DPS/NOMIS central admin/support.
 * TODO: will they need any special access?
 */
export const roleCentralAdmin = 'CADM_I' as const
