import { reportingUser } from '../../../data/testData/users'
import { ReportBasic } from '../../../data/incidentReportingApi'

export enum Action {
  AccessService = 'access',
}

export enum ReportAction {
  /** View all details */
  View = 'view',
  /** Change basic details, involvements and respond to questions */
  Edit = 'edit',
  /** Review a report */
  Review = 'review',
}

export function canPerform(user: Express.User | undefined, action: Action | ReportAction) {
  if (!user) {
    return false
  }
  if (action === Action.AccessService) {
    return 1
  }
  if (action === ReportAction.View) {
    return 2
  }
  return false
}

console.dir([canPerform(reportingUser, Action.AccessService), canPerform(reportingUser, ReportAction.View)])
