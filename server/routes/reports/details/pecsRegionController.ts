import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { pecsRegions } from '../../../data/pecsRegions'
import { isLocationActiveInService } from '../../../middleware/permissions'
import { BaseController } from '../../../controllers'
import type { PecsRegionFieldNames, PecsRegionValues } from './pecsRegionFields'

/**
 * Controller for selecting an active PECS region for an incident report.
 * The generic V parameter is for specifying all steps’ values, not just this one.
 */
export abstract class BasePecsRegionController<V extends PecsRegionValues> extends BaseController<
  V,
  PecsRegionFieldNames
> {
  protected keyField = 'pecsRegion' as const

  middlewareLocals(): void {
    this.use(this.customiseFields)
    super.middlewareLocals()
  }

  private customiseFields(
    req: FormWizard.Request<V, PecsRegionFieldNames>,
    _res: express.Response,
    next: express.NextFunction,
  ): void {
    const { fields } = req.form.options

    // NB: PECS regions are lazy-loaded so choices are built for every request
    req.form.options.fields = {
      ...fields,
      pecsRegion: {
        ...fields.pecsRegion,
        items: pecsRegions
          .filter(
            pecsRegion =>
              // PECS region must be active
              pecsRegion.active &&
              // and active in the service (though the expectation is that all active regions will be turned on simultaneously)
              isLocationActiveInService(pecsRegion.code),
          )
          .map(
            pecsRegion =>
              ({
                label: pecsRegion.description,
                value: pecsRegion.code,
              }) satisfies FormWizard.FieldItem,
          ),
      },
    }

    next()
  }

  protected errorMessage(
    error: FormWizard.Error,
    req: FormWizard.Request<V, PecsRegionFieldNames>,
    res: express.Response,
  ): string {
    if (error.key === 'pecsRegion') {
      // eslint-disable-next-line no-param-reassign
      error.field = 'pecsRegion-item'
      return 'Select the region where the incident happened'
    }
    return super.errorMessage(error, req, res)
  }
}
