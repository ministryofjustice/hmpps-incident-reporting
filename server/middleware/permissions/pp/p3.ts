import { reportingUser } from '../../../data/testData/users'
import { ReportBasic } from '../../../data/incidentReportingApi'
import { roleApproveReject, roleReadOnly, roleReadWrite } from '../../../data/constants'

interface PermissionConditions {
  user: Express.User | undefined
  location?: string
  report?: ReportBasic
}

class Chain {
  and(chain: Chain) {
    return new Chain()
  }

  or(chain: Chain) {
    return new Chain()
  }
}

function hasAnyRoles(roles: readonly string[]): Chain {
  return new Chain()
}

function canAccessLocation(): Chain {
  return new Chain()
}

const accessService = hasAnyRoles([roleReadOnly, roleReadWrite, roleApproveReject])

const createReport = (
  // aaa
  hasAnyRoles([]).and(canAccessLocation())
)
  .or(
    // bbb
    hasAnyRoles([]).and(canAccessLocation()),
  )

const editReport = hasAnyRoles([]).and(canAccessLocation())
