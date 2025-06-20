import { approverUser, reportingUser } from '../../../data/testData/users'
import { ReportBasic } from '../../../data/incidentReportingApi'
import { roleApproveReject, roleReadOnly, roleReadWrite } from '../../../data/constants'
import { convertReportDates } from '../../../data/incidentReportingApiUtils'
import { mockReport } from '../../../data/testData/incidentReporting'
import { now } from '../../../testutils/fakeClock'

const basicReport = convertReportDates(
  mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: false }),
)

// interface IP {
//   (user: Express.User): boolean
// }
//
// interface IRP {
//   (user: Express.User, report: Pick<ReportBasic, 'location' | 'status'>): boolean
// }

class P {
  constructor(x: object) {}

  evaluateFor(user: Express.User): boolean {
    return false
  }
}

class RP {
  constructor(x: object) {}

  evaluateFor(user: Express.User, report: Pick<ReportBasic, 'location' | 'status'>): boolean {
    return false
  }
}

const accessService = new P({ requiresAnyRole: [roleReadOnly, roleReadWrite, roleApproveReject] })
const edit = new RP({ requiresAnyRole: [roleReadOnly, roleReadWrite, roleApproveReject] })

const permissions = {
  /** X */
  accessService,
  /** X */
  edit,
} as const satisfies Record<string, P | RP>

type Permission = keyof typeof permissions

permissions.accessService.evaluateFor(reportingUser)
permissions.edit.evaluateFor(approverUser, basicReport)
