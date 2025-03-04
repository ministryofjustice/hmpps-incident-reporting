import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import logger from '../../../logger'
import type { ReportWithDetails } from '../../data/incidentReportingApi'
import { Values as PrisonersValues } from '../../routes/reports/prisoners/summary/fields'
import { Values as StaffValues } from '../../routes/reports/staff/summary/fields'
import { BaseController } from '../base'

type Values = PrisonersValues | StaffValues

// eslint-disable-next-line import/prefer-default-export
export abstract class InvolvementSummary extends BaseController<Values> {
  /** Used as URL and template slug */
  protected abstract type: 'prisoners' | 'staff'

  protected abstract involvementField: 'prisonersInvolved' | 'staffInvolved'

  protected abstract involvementDoneField: 'prisonerInvolvementDone' | 'staffInvolvementDone'

  protected abstract labelOnceInvolvementDone: string

  protected abstract pageTitleBeforeInvolvementDone: string

  protected abstract pageTitleOnceInvolvementDone: string

  protected abstract confirmError: string

  middlewareLocals(): void {
    this.use(this.customiseFields)
    super.middlewareLocals()
  }

  private customiseFields(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): void {
    const report = res.locals.report as ReportWithDetails

    const involvementDone = report[this.involvementField].length > 0 || report[this.involvementDoneField]

    const { fields } = req.form.options

    const customisedFields = { ...fields }
    if (involvementDone) {
      customisedFields.confirmAdd = {
        ...customisedFields.confirmAdd,
        label: this.labelOnceInvolvementDone,
        items: customisedFields.confirmAdd.items.filter(item => item.value !== 'skip'),
      }
    }
    req.form.options.fields = customisedFields

    res.locals.involvementDone = involvementDone

    next()
  }

  locals(req: FormWizard.Request<Values>, res: express.Response): Partial<FormWizard.Locals<Values>> {
    const pageTitle = res.locals.involvementDone
      ? this.pageTitleOnceInvolvementDone
      : this.pageTitleBeforeInvolvementDone

    // Gather notification banner entries if they exist
    const banners = req.flash()

    return {
      ...super.locals(req, res),
      ...this.localsForLookups(),
      pageTitle,
      banners,
    }
  }

  protected abstract localsForLookups(): Record<string, unknown>

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    return res.locals.reportUrl
  }

  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'confirmAdd') {
      return this.confirmError
    }
    return super.errorMessage(error)
  }

  render(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): void {
    if (res.locals.involvementDone) {
      req.form.options.template = `pages/${this.type}/summary`
    } else {
      req.form.options.template = `pages/${this.type}/request`
    }

    super.render(req, res, next)
  }

  async successHandler(
    req: FormWizard.Request<Values>,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const reportId = res.locals.report.id
    const { confirmAdd } = req.form.values

    req.journeyModel.reset()
    req.sessionModel.reset()

    if (confirmAdd === 'yes') {
      res.redirect(`${res.locals.reportSubUrlPrefix}/${this.type}/search`)
    } else {
      if (confirmAdd === 'no') {
        try {
          await res.locals.apis.incidentReportingApi.updateReport(reportId, {
            [this.involvementDoneField]: true,
          })
          logger.info(`Report updated to flag %s involved as done`, this.type)
        } catch (error) {
          logger.error(error, `Report could not be updated to flag %s involved as done: %j`, this.type, error)
          const err = this.convertIntoValidationError(error)
          this.errorHandler({ confirmAdd: err }, req, res, next)
        }
      }
      res.redirect(res.locals.reportUrl)
    }
  }
}
