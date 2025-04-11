import type express from 'express'
import FormWizard from 'hmpo-form-wizard'

import logger from '../../../../../logger'
import type { ReportWithDetails } from '../../../../data/incidentReportingApi'
import type { OffenderSearchResult } from '../../../../data/offenderSearchApi'
import { PrisonerInvolvementController } from './controller'
import { fields, type Values } from './fields'
import { steps } from './steps'

class AddPrisonerInvolvementController extends PrisonerInvolvementController {
  protected getAllowedPrisonerRoles(_req: FormWizard.Request<Values>, res: express.Response): Set<string> {
    const report = res.locals.report as ReportWithDetails
    const { reportConfig } = res.locals

    // set of codes allowed by incident type
    const allowedRoleCodes: Set<string> = new Set(
      reportConfig.prisonerRoles.filter(role => role.active).map(role => role.prisonerRole),
    )
    // …less those that are allowed only once and are already used
    report.prisonersInvolved
      .map(involvement => involvement.prisonerRole)
      .forEach(role => {
        const roleConfig = reportConfig.prisonerRoles.find(someRole => someRole.prisonerRole === role)
        if (roleConfig?.onlyOneAllowed) {
          allowedRoleCodes.delete(role)
        }
      })

    return allowedRoleCodes
  }

  protected getPrisonerName(res: express.Response): { firstName: string; lastName: string } {
    return res.locals.prisoner as OffenderSearchResult
  }

  async saveValues(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): Promise<void> {
    const report = res.locals.report as ReportWithDetails
    const prisoner = res.locals.prisoner as OffenderSearchResult
    const allValues = this.getAllValues(req, false)
    try {
      await res.locals.apis.incidentReportingApi.prisonersInvolved.addToReport(report.id, {
        prisonerNumber: prisoner.prisonerNumber,
        firstName: prisoner.firstName,
        lastName: prisoner.lastName,
        prisonerRole: this.coercePrisonerRole(allValues.prisonerRole),
        outcome: report.createdInNomis ? this.coerceOutcome(allValues.outcome) : null,
        comment: allValues.comment ?? '',
      })
      logger.info('Prisoner involvement added to report %s', report.id)
      // clear session since involvement has been saved
      req.journeyModel.reset()
      next()
    } catch (e) {
      logger.error(e, 'Prisoner involvement could not be added to report %s: %j', report.id, e)
      const err = this.convertIntoValidationError(e)
      // TODO: find a different way to report whole-form errors rather than attaching to specific field
      this.errorHandler({ prisonerRole: err }, req, res, next)
    }
  }
}

// eslint-disable-next-line import/prefer-default-export
export const addRouter = FormWizard(steps, fields, {
  name: 'addPrisonerInvolvement',
  journeyName: 'addPrisonerInvolvement',
  checkSession: false,
  csrf: false,
  template: 'pages/prisoners/involvement',
  controller: AddPrisonerInvolvementController,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
addRouter.mergeParams = true
