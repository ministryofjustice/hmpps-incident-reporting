import { URLSearchParams } from 'node:url'

import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import logger from '../../../../../logger'
import { GetBaseController } from '../../../../controllers'
import { OffenderSearchApi, type OffenderSearchResults } from '../../../../data/offenderSearchApi'
import { pagination } from '../../../../utils/pagination'
import type { Values } from './fields'

type OffenderSearchFilters = Parameters<OffenderSearchApi['searchGlobally']>[0]

// eslint-disable-next-line import/prefer-default-export
export class PrisonerSearchController extends GetBaseController<Values> {
  middlewareLocals(): void {
    this.use(this.customiseFields)
    super.middlewareLocals()
  }

  private customiseFields(req: FormWizard.Request<Values>, res: express.Response, next: express.NextFunction): void {
    const { fields } = req.form.options

    fields.global = {
      ...fields.global,
      items: [...fields.global.items],
    }

    // label local search with active caseload
    const activeCaseload = res.locals.user?.activeCaseLoad
    if (activeCaseload) {
      fields.global.items[0] = {
        ...fields.global.items[0],
        label: `In ${activeCaseload.description}`,
      }
    }

    next()
  }

  protected shouldContinueRenderFlowOnSuccess = true

  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'q') {
      return "Enter the prisoner's name or prison number"
    }
    if (error.key === 'global') {
      return 'Choose where to search'
    }
    if (error.key === 'page') {
      // NB: this will not show in practice
      return 'Page is not valid'
    }
    return super.errorMessage(error)
  }

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    return `${res.locals.reportSubUrlPrefix}/prisoners`
  }

  render(req: FormWizard.Request<Values, keyof Values>, res: express.Response, next: express.NextFunction) {
    super.render(req, res, next)

    if (res.locals.searchResults) {
      // clear session after rendering page since search was successfully performed and session would leak otherwise
      req.journeyModel.reset()
    }
  }

  async successHandler(
    req: FormWizard.Request<Values>,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const { q, global, page: pageStr } = this.getAllValues(req)
    const page = parseInt(pageStr, 10) || 1

    const { offenderSearchApi } = res.locals.apis
    let searchResults: OffenderSearchResults
    try {
      if (global === 'yes') {
        searchResults = await offenderSearchApi.searchGlobally(this.globalSearchFilters(q), page - 1)
      } else {
        const activeCaseload = res.locals.user.activeCaseLoad
        searchResults = await offenderSearchApi.searchInPrison(activeCaseload.caseLoadId, q, page - 1)
      }
      res.locals.searchResults = searchResults
    } catch (e) {
      logger.error(e, 'Prisoner search failed: %j', e)
      const err = this.convertIntoValidationError(e)
      // TODO: find a different way to report whole-form errors rather than attaching to specific field
      this.setErrors({ q: err }, req, res)
      next()
      return
    }

    const totalResultCount = searchResults.totalElements
    if (totalResultCount > 0) {
      const pageCount = Math.ceil(totalResultCount / OffenderSearchApi.PAGE_SIZE)
      const searchParams = new URLSearchParams()
      searchParams.append('q', q)
      if (global === 'yes') {
        searchParams.append('global', 'yes')
      } else {
        searchParams.append('global', 'no')
      }
      if (page > pageCount) {
        searchParams.append('page', `${pageCount}`)
        res.redirect(`${res.locals.reportSubUrlPrefix}/prisoners/search?${searchParams.toString()}`)
        return
      }

      const paginationParams = pagination(
        page,
        pageCount,
        `search?${searchParams.toString()}&`,
        'moj',
        totalResultCount,
        OffenderSearchApi.PAGE_SIZE,
      )
      paginationParams.results.text = 'prisoners'
      res.locals.paginationParams = paginationParams
    }

    next()
  }

  private globalSearchFilters(q: string): OffenderSearchFilters {
    const filters: OffenderSearchFilters = {
      location: 'ALL',
      includeAliases: true,
    }

    if (/\d/.test(q)) {
      // DPS global search assumes the whole query is a prisoner identifier if it contains numbers
      filters.prisonerIdentifier = q.toUpperCase()
    } else {
      // DPS global search assumes that up to 2 words are entered, being the last and first name in that order
      const [lastName, firstName] = q.split(' ')
      filters.lastName = lastName
      if (firstName?.length) {
        filters.firstName = firstName
      }
    }

    return filters
  }
}
