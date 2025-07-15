import type { Status } from '../../reportConfiguration/constants'
import type { UserAction } from './userActions'
import type { UserType } from './userType'

export type Transitions = {
  /** Given a user type… */
  [U in UserType]?: {
    /** …and a report with this status… */
    [S in Status]?: {
      /** …they can possibly perform this action */
      [A in UserAction]?: Transition
    }
  }
}

export type Transition = {
  /** If action is performed, should report status also be changed? */
  newStatus?: Status
  /** Is report required to be valid before action is performed? */
  mustBeValid?: boolean
  /** Label as the users will see within the form on report page */
  label?: string
  /** Is a comment required when submitting this action? */
  commentRequired?: boolean
  /** Associated text for comment box in form */
  commentBoxText?: string
  /** Is a valid incident report number required to mark as duplicate? */
  incidentNumberRequired?: boolean
  /** Associated text for duplicate incident number box in form */
  duplicateIncidentNumberBoxText?: string
  /** Message in success banner when landing back onto reports screen.
   * reportReference will be replaced with actual value during banner implementation */
  bannerText?: string
}

/**
 * Given a prison report and a user of a particular type, what *modifying* actions are possible
 * and what is the resulting status transition?
 *
 * NB:
 * - `view` action is not included as it never changes a report nor transitions status
 * - presence of a user action does not guarantee permission: report location and validity also matter
 */
export const prisonReportTransitions: Transitions = {
  reportingOfficer: {
    DRAFT: {
      edit: {},
      requestReview: {
        newStatus: 'AWAITING_REVIEW',
        mustBeValid: true,
        label: 'Submit',
        bannerText: 'You have submitted incident report reportReference',
      },
      requestRemoval: { newStatus: 'AWAITING_REVIEW', label: 'Request to remove report' },
    },
    AWAITING_REVIEW: {
      edit: { newStatus: 'DRAFT' },
      recall: { newStatus: 'DRAFT' },
    },
    NEEDS_UPDATING: {
      edit: {},
      requestReview: {
        newStatus: 'UPDATED',
        mustBeValid: true,
        label: 'Resubmit',
        commentRequired: true,
        commentBoxText: 'Describe what has changed in the report',
        bannerText: 'You have resubmitted incident report reportReference',
      },
      requestRemoval: { newStatus: 'UPDATED', label: 'Request to remove report' },
    },
    ON_HOLD: {},
    UPDATED: {
      recall: { newStatus: 'DRAFT' },
    },
    CLOSED: {
      recall: { newStatus: 'DRAFT' },
    },
    DUPLICATE: {
      recall: { newStatus: 'DRAFT' },
    },
    NOT_REPORTABLE: {
      recall: { newStatus: 'DRAFT' },
    },
    REOPENED: {
      edit: {},
      requestReview: {
        newStatus: 'WAS_CLOSED',
        mustBeValid: true,
        label: 'Resubmit',
        commentRequired: true,
        commentBoxText: 'Describe what has changed in the report',
        bannerText: 'You have resubmitted incident report reportReference',
      },
      requestRemoval: { newStatus: 'WAS_CLOSED', label: 'Request to remove report' },
    },
    WAS_CLOSED: {
      recall: { newStatus: 'DRAFT' },
    },
  },
  dataWarden: {
    DRAFT: {},
    AWAITING_REVIEW: {
      close: {
        newStatus: 'CLOSED',
        mustBeValid: true,
        label: 'Close',
        bannerText: 'Incident report reportReference has been marked as closed',
      },
      requestCorrection: {
        newStatus: 'NEEDS_UPDATING',
        label: 'Send back',
        commentRequired: true,
        commentBoxText: "Explain why you're sending the report back",
        bannerText: 'Incident report reportReference has been sent back',
      },
      hold: {
        newStatus: 'ON_HOLD',
        label: 'Put on hold',
        commentRequired: true,
        commentBoxText: 'Describe why the report is being put on hold',
        bannerText: 'Incident report reportReference has been put on hold',
      },
      markDuplicate: {
        newStatus: 'DUPLICATE',
        commentRequired: true,
        label: 'Mark as a duplicate',
        commentBoxText: 'Describe why it is a duplicate (optional)',
        incidentNumberRequired: true,
        duplicateIncidentNumberBoxText: 'Enter incident number of the original report',
        bannerText: 'Report reportReference has been marked as duplicate',
      },
      markNotReportable: {
        newStatus: 'NOT_REPORTABLE',
        label: 'Mark as not reportable',
        commentRequired: true,
        commentBoxText: 'Describe why it is not reportable',
        bannerText: 'Report reportReference has been marked as not reportable',
      },
    },
    ON_HOLD: {
      close: {
        newStatus: 'CLOSED',
        mustBeValid: true,
        label: 'Close',
        bannerText: 'Incident report reportReference has been marked as closed',
      },
      requestCorrection: {
        newStatus: 'NEEDS_UPDATING',
        label: 'Send back',
        commentRequired: true,
        commentBoxText: "Explain why you're sending the report back",
        bannerText: 'Incident report reportReference has been sent back',
      },
      markDuplicate: {
        newStatus: 'DUPLICATE',
        commentRequired: true,
        label: 'Mark as a duplicate',
        commentBoxText: 'Describe why it is a duplicate (optional)',
        incidentNumberRequired: true,
        duplicateIncidentNumberBoxText: 'Enter incident number of the original report',
        bannerText: 'Report reportReference has been marked as duplicate',
      },
      markNotReportable: {
        newStatus: 'NOT_REPORTABLE',
        label: 'Mark as not reportable',
        commentRequired: true,
        commentBoxText: 'Describe why it is not reportable',
        bannerText: 'Report reportReference has been marked as not reportable',
      },
    },
    NEEDS_UPDATING: {
      recall: { newStatus: 'UPDATED' },
    },
    UPDATED: {
      close: {
        newStatus: 'CLOSED',
        mustBeValid: true,
        label: 'Close',
        bannerText: 'Incident report reportReference has been marked as closed',
      },
      requestCorrection: {
        newStatus: 'NEEDS_UPDATING',
        label: 'Send back',
        commentRequired: true,
        commentBoxText: "Explain why you're sending the report back",
        bannerText: 'Incident report reportReference has been sent back',
      },
      hold: {
        newStatus: 'ON_HOLD',
        label: 'Put on hold',
        commentRequired: true,
        commentBoxText: 'Describe why the report is being put on hold',
        bannerText: 'Incident report reportReference has been put on hold',
      },
      markDuplicate: {
        newStatus: 'DUPLICATE',
        commentRequired: true,
        label: 'Mark as a duplicate',
        commentBoxText: 'Describe why it is a duplicate (optional)',
        incidentNumberRequired: true,
        duplicateIncidentNumberBoxText: 'Enter incident number of the original report',
        bannerText: 'Report reportReference has been marked as duplicate',
      },
      markNotReportable: {
        newStatus: 'NOT_REPORTABLE',
        label: 'Mark as not reportable',
        commentRequired: true,
        commentBoxText: 'Describe why it is not reportable',
        bannerText: 'Report reportReference has been marked as not reportable',
      },
    },
    CLOSED: {
      recall: { newStatus: 'UPDATED' },
    },
    DUPLICATE: {
      recall: { newStatus: 'UPDATED' },
    },
    NOT_REPORTABLE: {
      recall: { newStatus: 'UPDATED' },
    },
    REOPENED: {
      recall: { newStatus: 'WAS_CLOSED' },
    },
    WAS_CLOSED: {
      close: {
        newStatus: 'CLOSED',
        mustBeValid: true,
        label: 'Close',
        bannerText: 'Incident report reportReference has been marked as closed',
      },
      requestCorrection: {
        newStatus: 'NEEDS_UPDATING',
        label: 'Send back',
        commentRequired: true,
        commentBoxText: "Explain why you're sending the report back",
        bannerText: 'Incident report reportReference has been sent back',
      },
      hold: {
        newStatus: 'ON_HOLD',
        label: 'Put on hold',
        commentRequired: true,
        commentBoxText: 'Describe why the report is being put on hold',
        bannerText: 'Incident report reportReference has been put on hold',
      },
      markDuplicate: {
        newStatus: 'DUPLICATE',
        commentRequired: true,
        label: 'Mark as a duplicate',
        commentBoxText: 'Describe why it is a duplicate (optional)',
        incidentNumberRequired: true,
        duplicateIncidentNumberBoxText: 'Enter incident number of the original report',
        bannerText: 'Report reportReference has been marked as duplicate',
      },
      markNotReportable: {
        newStatus: 'NOT_REPORTABLE',
        label: 'Mark as not reportable',
        commentRequired: true,
        commentBoxText: 'Describe why it is not reportable',
        bannerText: 'Report reportReference has been marked as not reportable',
      },
    },
  },
  hqViewer: {},
}

/**
 * Given a PECS report and a user of a particular type, what *modifying* actions are possible
 * and what is the resulting status transition?
 *
 * NB:
 * - `view` action is not included as it never changes a report nor transitions status
 * - presence of a user action does not guarantee permission: report location and validity also matter
 *
 * TODO: not confirmed, eg: is on-hold needed?
 */
export const pecsReportTransitions: Transitions = {
  dataWarden: {
    DRAFT: {
      edit: {},
      close: { newStatus: 'CLOSED', mustBeValid: true },
      markDuplicate: { newStatus: 'DUPLICATE' },
      markNotReportable: { newStatus: 'NOT_REPORTABLE' },
    },
    CLOSED: {
      recall: { newStatus: 'DRAFT' },
    },
    DUPLICATE: {
      recall: { newStatus: 'DRAFT' },
    },
    NOT_REPORTABLE: {
      recall: { newStatus: 'DRAFT' },
    },
  },
}
