import type FormWizard from 'hmpo-form-wizard'

import type { UserDetails } from '../../services/userService'
import type { CaseLoad } from '../../data/frontendComponentsClient'
import type { IncidentReportingApi, ReportBasic, ReportWithDetails } from '../../data/incidentReportingApi'
import type { QuestionProgress } from '../../data/incidentTypeConfiguration/questionProgress'
import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'
import type { OffenderSearchApi } from '../../data/offenderSearchApi'
import type { PrisonApi } from '../../data/prisonApi'
import type { Permissions, UserAction } from '../../middleware/permissions'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    /** Used by auth middleware for sign-in */
    returnTo: string
    nowInMinutes: number
  }
}

type BannerTypes = 'information' | 'success' | 'error'

interface Banner {
  title?: string
  content?: string
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
      /** Load flash notification banners */
      flash(): Record<BannerTypes, Banner>
      /** Post flash notification banner */
      flash(type: BannerTypes, message: Banner[] | Banner): number
    }

    // NB: FormWizard.Locals will not be available for all routes so should not be merged in
    interface Locals {
      user: Express.User
      systemToken: string
      /** All routes have permissions checker */
      permissions: Permissions
      /** All routes have api instances */
      apis: {
        userService: UserService
        incidentReportingApi: IncidentReportingApi
        prisonApi: PrisonApi
        offenderSearchApi: OffenderSearchApi
      }
      /** Many routes load a report into locals */
      report?: ReportBasic | ReportWithDetails
      /** URL of current report (if loaded) */
      reportUrl?: string
      /** Build sub-urls referring to current report (if loaded) using this prefix */
      reportSubUrlPrefix?: string
      /** Some routes load incident type config */
      reportConfig?: IncidentTypeConfiguration
      /** Set of actions user can perform on current report (if loaded) */
      allowedActions?: ReadonlySet<UserAction>
      /** Form wizard controllers can reset the journey session on success by setting this to true */
      clearSessionOnSuccess?: boolean
      /** Some routes load question form wizard steps into locals */
      questionSteps?: FormWizard.Steps<FormWizard.MultiValues>
      /** Some routes load question form wizard fields into locals */
      questionFields?: FormWizard.Fields
      /** Some routes load question progress when a report with details is available */
      questionProgress?: QuestionProgress
    }
  }
}
