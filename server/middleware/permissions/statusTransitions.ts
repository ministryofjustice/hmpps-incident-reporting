import type { Status } from '../../reportConfiguration/constants'
import type { UserAction } from './userActions'
import type { UserType } from './userType'

export type Transitions = {
  [U in UserType]?: {
    [S in Status]?: {
      [A in UserAction]?: {
        newStatus?: Status
      }
    }
  }
}

export const prisonReportTransitions: Transitions = {
  reportingOfficer: {
    DRAFT: {
      edit: {},
      requestDuplicate: { newStatus: 'AWAITING_REVIEW' },
      requestNotReportable: { newStatus: 'AWAITING_REVIEW' },
      requestReview: { newStatus: 'AWAITING_REVIEW' },
    },
    AWAITING_REVIEW: {
      edit: { newStatus: 'DRAFT' },
      recall: { newStatus: 'DRAFT' },
    },
    NEEDS_UPDATING: {
      edit: {},
      requestDuplicate: { newStatus: 'UPDATED' },
      requestNotReportable: { newStatus: 'UPDATED' },
      requestReview: { newStatus: 'UPDATED' },
    },
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
      requestDuplicate: { newStatus: 'WAS_CLOSED' },
      requestNotReportable: { newStatus: 'WAS_CLOSED' },
      requestReview: { newStatus: 'WAS_CLOSED' },
    },
    WAS_CLOSED: {
      recall: { newStatus: 'DRAFT' },
    },
  },
  dataWarden: {
    AWAITING_REVIEW: {
      requestCorrection: { newStatus: 'NEEDS_UPDATING' },
      close: { newStatus: 'CLOSED' },
      markDuplicate: { newStatus: 'DUPLICATE' },
      markNotReportable: { newStatus: 'NOT_REPORTABLE' },
      hold: { newStatus: 'ON_HOLD' },
    },
    ON_HOLD: {
      requestCorrection: { newStatus: 'NEEDS_UPDATING' },
      close: { newStatus: 'CLOSED' },
      markDuplicate: { newStatus: 'DUPLICATE' },
      markNotReportable: { newStatus: 'NOT_REPORTABLE' },
    },
    NEEDS_UPDATING: {
      recall: { newStatus: 'UPDATED' },
    },
    UPDATED: {
      requestCorrection: { newStatus: 'NEEDS_UPDATING' },
      close: { newStatus: 'CLOSED' },
      markDuplicate: { newStatus: 'DUPLICATE' },
      markNotReportable: { newStatus: 'NOT_REPORTABLE' },
      hold: { newStatus: 'ON_HOLD' },
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
      requestCorrection: { newStatus: 'REOPENED' },
      close: { newStatus: 'CLOSED' },
      markDuplicate: { newStatus: 'DUPLICATE' },
      markNotReportable: { newStatus: 'NOT_REPORTABLE' },
    },
  },
}

export const pecsReportTransitions: Transitions = {
  // TODO: TBC. eg: is on-hold needed?
  dataWarden: {
    DRAFT: {
      close: { newStatus: 'CLOSED' },
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
