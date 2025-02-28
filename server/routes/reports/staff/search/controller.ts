import { URLSearchParams } from 'node:url'

import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { GetBaseController } from '../../../../controllers'
import type { ReportWithDetails } from '../../../../data/incidentReportingApi'
import ManageUsersApiClient from '../../../../data/manageUsersApiClient'
import { pagination } from '../../../../utils/pagination'
import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export class StaffSearchController extends GetBaseController<Values> {
  protected shouldContinueRenderFlowOnSuccess = true

  locals(req: FormWizard.Request<Values>, res: express.Response): Partial<FormWizard.Locals<Values>> {
    const pageTitle =
      res.locals.searchResults?.totalElements > 0
        ? 'Select the member of staff you want to add'
        : 'Search for a member of staff involved in the incident'

    return {
      ...super.locals(req, res),
      pageTitle,
    }
  }

  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'q') {
      return 'Enter a name'
    }
    if (error.key === 'page') {
      // NB: this will not show in practice
      return 'Page is not valid'
    }
    return super.errorMessage(error)
  }

  getBackLink(_req: FormWizard.Request<Values>, res: express.Response): string {
    const report = res.locals.report as ReportWithDetails
    return `/reports/${report.id}/staff`
  }

  async successHandler(
    req: FormWizard.Request<Values>,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const report = res.locals.report as ReportWithDetails
    const { q, page: pageStr } = this.getAllValues(req)
    const page = parseInt(pageStr, 10) || 1

    const searchResults = await new ManageUsersApiClient().searchUsers(res.locals.systemToken, q, page - 1)
    // just in case, because we refer to users by username in the next step
    searchResults.content = searchResults.content.filter(item => item.username)

    res.locals.searchResults = searchResults

    const totalResultCount = searchResults.totalElements
    if (totalResultCount > 0) {
      const pageCount = Math.ceil(totalResultCount / ManageUsersApiClient.PAGE_SIZE)
      const searchParams = new URLSearchParams()
      searchParams.append('q', q)
      if (page > pageCount) {
        searchParams.append('page', `${pageCount}`)
        res.redirect(`/reports/${report.id}/staff/search?${searchParams.toString()}`)
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
