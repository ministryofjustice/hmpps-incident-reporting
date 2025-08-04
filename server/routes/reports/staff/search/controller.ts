import { URLSearchParams } from 'node:url'

import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import logger from '../../../../../logger'
import { GetBaseController } from '../../../../controllers'
import ManageUsersApiClient, { type UsersSearchResponse } from '../../../../data/manageUsersApiClient'
import { pagination } from '../../../../utils/pagination'
import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export class StaffSearchController extends GetBaseController<Values> {
  protected keyField = 'q' as const

  protected shouldContinueRenderFlowOnSuccess = true

  locals(req: FormWizard.Request<Values>, res: express.Response): Partial<FormWizard.Locals<Values>> {
    let pageTitle = 'Search for a member of staff'
    if (res.locals.searchResults?.totalElements === 0) {
      const { q } = this.getAllValues(req)
      pageTitle = `‘${q}’ cannot be found`
    } else if (res.locals.searchResults?.totalElements > 0) {
      pageTitle = 'Select the member of staff'
    }

    return {
      ...super.locals(req, res),
      pageTitle,
    }
  }

  protected errorMessage(error: FormWizard.Error, req: FormWizard.Request<Values>, res: express.Response): string {
    if (error.key === 'q') {
      return 'Enter a member of staff’s name'
    }
    if (error.key === 'page') {
      // NB: this will not show in practice
      return 'Page is not valid'
    }
    return super.errorMessage(error, req, res)
  }

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    return `${res.locals.reportSubUrlPrefix}/staff`
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
    const { q, page: pageStr } = this.getAllValues(req)
    const page = parseInt(pageStr, 10) || 1

    let searchResults: UsersSearchResponse
    try {
      searchResults = await new ManageUsersApiClient().searchUsers(res.locals.systemToken, q, page - 1)
      // just in case, because we refer to users by username in the next step
      searchResults.content = searchResults.content.filter(item => item.username)
    } catch (e) {
      logger.error(e, 'Staff search failed: %j', e)
      const err = this.convertIntoValidationError(e)
      this.setErrors({ q: err }, req, res)
      next()
      return
    }

    res.locals.searchResults = searchResults

    const totalResultCount = searchResults.totalElements
    if (totalResultCount > 0) {
      const pageCount = Math.ceil(totalResultCount / ManageUsersApiClient.PAGE_SIZE)
      const searchParams = new URLSearchParams()
      searchParams.append('q', q)
      if (page > pageCount) {
        searchParams.append('page', `${pageCount}`)
        res.redirect(`${res.locals.reportSubUrlPrefix}/staff/search?${searchParams.toString()}`)
        return
      }

      const paginationParams = pagination(
        page,
        pageCount,
        `search?${searchParams.toString()}&`,
        'moj',
        totalResultCount,
        ManageUsersApiClient.PAGE_SIZE,
      )
      paginationParams.results.text = 'members of staff'
      res.locals.paginationParams = paginationParams
    }

    next()
  }
}
