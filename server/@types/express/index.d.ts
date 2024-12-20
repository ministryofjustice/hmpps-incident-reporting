import type { UserDetails } from '../../services/userService'
import type { CaseLoad } from '../../data/frontendComponentsClient'
import type { IncidentReportingApi } from '../../data/incidentReportingApi'
import type { OffenderSearchApi } from '../../data/offenderSearchApi'
import type { PrisonApi } from '../../data/prisonApi'
import type { Permissions } from '../../middleware/permissions'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    /** Used by auth middleware for sign-in */
    returnTo: string
    nowInMinutes: number
  }
}

export declare global {
  namespace Express {
    interface User extends Partial<UserDetails> {
      token: string
      authSource: string
      activeCaseLoad?: CaseLoad
      caseLoads?: CaseLoad[]
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }

    // NB: FormWizard.Locals will not be available for all routes so should not be merged in
    interface Locals {
      user: Express.User
      systemToken: string
      permissions: Permissions
      apis: {
        incidentReportingApi: IncidentReportingApi
        prisonApi: PrisonApi
        offenderSearchApi: OffenderSearchApi
      }
    }
  }
}
