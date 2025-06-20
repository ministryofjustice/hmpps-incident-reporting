import { reportingUser } from '../../../data/testData/users'
import { ReportBasic } from '../../../data/incidentReportingApi'

interface PermissionConditions {
  user: Express.User | undefined
  location?: string
  report?: ReportBasic
}

abstract class Permission {
  abstract readonly name: string

  constructor(conditions: PermissionConditions) {}
}

export class AccessService extends Permission {
  readonly name: string = 'access'
}

abstract class LocationPermission extends Permission {}

export class Create extends LocationPermission {
  readonly name: string = 'create'
}

abstract class ReportPermission extends LocationPermission {}

export class View extends ReportPermission {
  readonly name: string = 'view'
}
