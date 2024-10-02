import type { UserDetails } from '../../services/userService'
import type { IncidentReportingApi } from '../../data/incidentReportingApi'
import type { OffenderSearchApi } from '../../data/offenderSearchApi'
import type { PrisonApi } from '../../data/prisonApi'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    referrerUrl: string
  }
}

export declare global {
  namespace Express {
    interface User extends Partial<UserDetails> {
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }

    interface Locals {
      user: Express.User
      systemToken: string
      apis: {
        incidentReportingApi: IncidentReportingApi
        prisonApi: PrisonApi
        offenderSearchApi: OffenderSearchApi
      }
    }
  }
}
