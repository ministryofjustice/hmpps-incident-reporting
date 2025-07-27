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
  /** Radio button label as the users will see within the form on report page */
  label?: string
  /** Is a valid incident report number required to mark as duplicate? */
  originalReportReferenceRequired?: boolean
  /** Message in success banner when landing back onto reports screen.
   * `$reportReference` will be replaced with actual value during banner implementation */
  successBanner?: string
} & (
  | {
      /** Action does not permit a comment */
      comment?: undefined
    }
  | {
      /** Action allows or requires a comment */
      comment: 'optional' | 'required'
      /** Associated label for comment box */
      commentLabel: string
    }
)

/**
 * Given a prison report and a user of a particular type, what *modifying* actions are possible
 * and what is the resulting status transition?
 *
 * NB:
 * - `view` action is not included as it never changes a report nor transitions status
 * - presence of a user action does not guarantee permission: report location and validity also matter
 */
export const prisonReportTransitions: Transitions = {
  REPORTING_OFFICER: {
    DRAFT: {
      EDIT: {},
      REQUEST_REVIEW: {
        newStatus: 'AWAITING_REVIEW',
        mustBeValid: true,
        label: 'Submit',
        successBanner: 'You have submitted incident report $reportReference',
      },
      REQUEST_REMOVAL: { newStatus: 'AWAITING_REVIEW', label: 'Request to remove report' },
    },
    AWAITING_REVIEW: {
      EDIT: { newStatus: 'DRAFT' },
      RECALL: { newStatus: 'DRAFT' },
    },
    NEEDS_UPDATING: {
      EDIT: {},
      REQUEST_REVIEW: {
        newStatus: 'UPDATED',
        mustBeValid: true,
        label: 'Resubmit',
        comment: 'required',
        commentLabel: 'Describe what has changed in the report',
        successBanner: 'You have resubmitted incident report $reportReference',
      },
      REQUEST_REMOVAL: { newStatus: 'UPDATED', label: 'Request to remove report' },
    },
    UPDATED: {
      RECALL: { newStatus: 'NEEDS_UPDATING' },
    },
    CLOSED: {
      RECALL: { newStatus: 'REOPENED' },
    },
    DUPLICATE: {
      RECALL: { newStatus: 'NEEDS_UPDATING' },
    },
    NOT_REPORTABLE: {
      RECALL: { newStatus: 'NEEDS_UPDATING' },
    },
    REOPENED: {
      EDIT: {},
      REQUEST_REVIEW: {
        newStatus: 'WAS_CLOSED',
        mustBeValid: true,
        label: 'Resubmit',
        comment: 'required',
        commentLabel: 'Describe what has changed in the report',
        successBanner: 'You have resubmitted incident report $reportReference',
      },
      REQUEST_REMOVAL: { newStatus: 'WAS_CLOSED', label: 'Request to remove report' },
    },
    WAS_CLOSED: {
      RECALL: { newStatus: 'REOPENED' },
    },
  },
  DATA_WARDEN: {
    AWAITING_REVIEW: {
      CLOSE: {
        newStatus: 'CLOSED',
        mustBeValid: true,
        label: 'Close',
        successBanner: 'Incident report $reportReference has been marked as closed',
      },
      REQUEST_CORRECTION: {
        newStatus: 'NEEDS_UPDATING',
        label: 'Send back',
        comment: 'required',
        commentLabel: 'Describe why the report is being sent back',
        successBanner: 'Incident report $reportReference has been sent back',
      },
      HOLD: {
        newStatus: 'ON_HOLD',
        label: 'Put on hold',
        comment: 'required', // TODO: maybe this should be optional?
        commentLabel: 'Describe why the report is being put on hold',
        successBanner: 'Incident report $reportReference has been put on hold',
      },
      MARK_DUPLICATE: {
        newStatus: 'DUPLICATE',
        label: 'Mark as a duplicate',
        comment: 'optional',
        commentLabel: 'Describe why it is a duplicate report (optional)',
        originalReportReferenceRequired: true,
        successBanner: 'Report $reportReference has been marked as duplicate',
      },
      MARK_NOT_REPORTABLE: {
        newStatus: 'NOT_REPORTABLE',
        label: 'Mark as not reportable',
        comment: 'optional',
        commentLabel: 'Describe why it is not reportable (optional)',
        successBanner: 'Report $reportReference has been marked as not reportable',
      },
    },
    ON_HOLD: {
      CLOSE: {
        newStatus: 'CLOSED',
        mustBeValid: true,
        label: 'Close',
        successBanner: 'Incident report $reportReference has been marked as closed',
      },
      REQUEST_CORRECTION: {
        newStatus: 'NEEDS_UPDATING',
        label: 'Send back',
        comment: 'required',
        commentLabel: 'Describe why the report is being sent back',
        successBanner: 'Incident report $reportReference has been sent back',
      },
      MARK_DUPLICATE: {
        newStatus: 'DUPLICATE',
        label: 'Mark as a duplicate',
        comment: 'optional',
        commentLabel: 'Describe why it is a duplicate report (optional)',
        originalReportReferenceRequired: true,
        successBanner: 'Report $reportReference has been marked as duplicate',
      },
      MARK_NOT_REPORTABLE: {
        newStatus: 'NOT_REPORTABLE',
        label: 'Mark as not reportable',
        comment: 'optional',
        commentLabel: 'Describe why it is not reportable (optional)',
        successBanner: 'Report $reportReference has been marked as not reportable',
      },
    },
    NEEDS_UPDATING: {
      RECALL: { newStatus: 'UPDATED' },
    },
    UPDATED: {
      CLOSE: {
        newStatus: 'CLOSED',
        mustBeValid: true,
        label: 'Close',
        successBanner: 'Incident report $reportReference has been marked as closed',
      },
      REQUEST_CORRECTION: {
        newStatus: 'NEEDS_UPDATING',
        label: 'Send back',
        comment: 'required',
        commentLabel: 'Describe why the report is being sent back',
        successBanner: 'Incident report $reportReference has been sent back',
      },
      HOLD: {
        newStatus: 'ON_HOLD',
        label: 'Put on hold',
        comment: 'required', // TODO: maybe this should be optional?
        commentLabel: 'Describe why the report is being put on hold',
        successBanner: 'Incident report $reportReference has been put on hold',
      },
      MARK_DUPLICATE: {
        newStatus: 'DUPLICATE',
        label: 'Mark as a duplicate',
        comment: 'optional',
        commentLabel: 'Describe why it is a duplicate report (optional)',
        originalReportReferenceRequired: true,
        successBanner: 'Report $reportReference has been marked as duplicate',
      },
      MARK_NOT_REPORTABLE: {
        newStatus: 'NOT_REPORTABLE',
        label: 'Mark as not reportable',
        comment: 'optional',
        commentLabel: 'Describe why it is not reportable (optional)',
        successBanner: 'Report $reportReference has been marked as not reportable',
      },
    },
    CLOSED: {
      RECALL: { newStatus: 'UPDATED' },
    },
    DUPLICATE: {
      RECALL: { newStatus: 'UPDATED' },
    },
    NOT_REPORTABLE: {
      RECALL: { newStatus: 'UPDATED' },
    },
    REOPENED: {
      RECALL: { newStatus: 'WAS_CLOSED' },
    },
    WAS_CLOSED: {
      CLOSE: {
        newStatus: 'CLOSED',
        mustBeValid: true,
        label: 'Close',
        successBanner: 'Incident report $reportReference has been marked as closed',
      },
      REQUEST_CORRECTION: {
        newStatus: 'REOPENED',
        label: 'Send back',
        comment: 'required',
        commentLabel: 'Describe why the report is being sent back',
        successBanner: 'Incident report $reportReference has been sent back',
      },
      MARK_DUPLICATE: {
        newStatus: 'DUPLICATE',
        label: 'Mark as a duplicate',
        comment: 'optional',
        commentLabel: 'Describe why it is a duplicate report (optional)',
        originalReportReferenceRequired: true,
        successBanner: 'Report $reportReference has been marked as duplicate',
      },
      MARK_NOT_REPORTABLE: {
        newStatus: 'NOT_REPORTABLE',
        label: 'Mark as not reportable',
        comment: 'optional',
        commentLabel: 'Describe why it is not reportable (optional)',
        successBanner: 'Report $reportReference has been marked as not reportable',
      },
    },
  },
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
  DATA_WARDEN: {
    DRAFT: {
      EDIT: {},
      CLOSE: { newStatus: 'CLOSED', mustBeValid: true },
      MARK_DUPLICATE: { newStatus: 'DUPLICATE' },
      MARK_NOT_REPORTABLE: { newStatus: 'NOT_REPORTABLE' },
    },
    CLOSED: {
      RECALL: { newStatus: 'DRAFT' },
    },
    DUPLICATE: {
      RECALL: { newStatus: 'DRAFT' },
    },
    NOT_REPORTABLE: {
      RECALL: { newStatus: 'DRAFT' },
    },
  },
}
