import type express from 'express'
import FormWizard from 'hmpo-form-wizard'
import { NotFound } from 'http-errors'

import logger from '../../../../../logger'
import type { PrisonerInvolvement, ReportWithDetails } from '../../../../data/incidentReportingApi'
import { fallibleUpdateReportTitle } from '../../../../services/reportTitle'
import { handleReportEdit } from '../../actions/handleReportEdit'
import { PrisonerInvolvementController } from './controller'
import { fields, type Values } from './fields'
import { steps } from './steps'

class EditPrisonerInvolvementController extends PrisonerInvolvementController {
  protected keyField = 'prisonerRole' as const

  middlewareLocals(): void {
    this.use(this.choosePrisonerInvolvement)
    super.middlewareLocals()
  }

  private choosePrisonerInvolvement(
    req: FormWizard.Request<Values>,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    const index = parseInt(req.params.index, 10)
    if (Number.isNaN(index) || index <= 0 || !/^\d+$/.test(req.params.index)) {
      next(new NotFound('Invalid prisoner involvement index'))
      return
    }

    const report = res.locals.report as ReportWithDetails
    const prisonerInvolvement = report.prisonersInvolved[index - 1]
    if (!prisonerInvolvement) {
      next(new NotFound('Prisoner involvement index out of bounds'))
      return
    }

    res.locals.prisonerInvolvement = prisonerInvolvement
    next()
  }

  protected getAllowedPrisonerRoles(req: FormWizard.Request<Values>, res: express.Response): Set<string> {
    const index = parseInt(req.params.index, 10)
    const report = res.locals.report as ReportWithDetails
    const { reportConfig } = res.locals

    // set of codes allowed by incident type
    const allowedRoleCodes: Set<string> = new Set(
      reportConfig.prisonerRoles.filter(role => role.active).map(role => role.prisonerRole),
    )
    // …less those that are allowed only once and are already used in a _different_ involvement
    report.prisonersInvolved
      .filter((_involvement, i) => i !== index - 1)
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
    return res.locals.prisonerInvolvement as PrisonerInvolvement
  }

  getValues(req: FormWizard.Request<Values>, res: express.Response, callback: FormWizard.Callback<Values>): void {
    super.getValues(req, res, (err, values) => {
      if (err) {
        callback(err, values)
        return
      }
      const { prisonerInvolvement } = res.locals
      const formValues = {
        prisonerRole: prisonerInvolvement.prisonerRole,
        outcome: prisonerInvolvement.outcome ?? '',
        comment: prisonerInvolvement.comment ?? '',
        ...values,
      }

      callback(null, formValues)
    })
  }

  async saveValues(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): Promise<void> {
    const { incidentReportingApi } = res.locals.apis
    const { report } = res.locals
    const index = parseInt(req.params.index, 10)
    const allValues = this.getAllValues(req, false)
    try {
      await incidentReportingApi.prisonersInvolved.updateForReport(report.id, index, {
        prisonerRole: this.coercePrisonerRole(allValues.prisonerRole),
        outcome: report.createdInNomis ? this.coerceOutcome(allValues.outcome) : null,
        comment: allValues.comment ?? '',
      })
      logger.info('Prisoner involvement %d updated in report %s', index, report.id)
    } catch (e) {
      logger.error(e, 'Prisoner involvement %d could not be updated in report %s: %j', index, report.id, e)
      this.handleApiError(e, req, res, next)
      return
    }
    // Now look to update the status if necessary
    try {
      await handleReportEdit(res)

      fallibleUpdateReportTitle(res) // NB: errors are logged but ignored!
      // clear session since report has been saved
      res.locals.clearSessionOnSuccess = true

      next()
    } catch (e) {
      logger.error(e, `Report ${res.locals.report.reportReference} status could not be updated: %j`, e)
      this.handleApiError(e, req, res, next)
    }
  }
}

export const editRouter = FormWizard(steps, fields, {
  name: 'editPrisonerInvolvement',
  journeyName: 'editPrisonerInvolvement',
  checkSession: false,
  csrf: false,
  template: 'pages/prisoners/involvement',
  controller: EditPrisonerInvolvementController,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore because express types do not mention this property and form wizard does not allow you to pass in config for it's root router
editRouter.mergeParams = true
