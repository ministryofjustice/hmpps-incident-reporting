import { URLSearchParams } from 'node:url'

import express from 'express'
import FormWizard from 'hmpo-form-wizard'

import { GetBaseController } from '../../../../controllers'
import type { ReportWithDetails } from '../../../../data/incidentReportingApi'
import ManageUsersApiClient from '../../../../data/manageUsersApiClient'
import { pagination } from '../../../../utils/pagination'
import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export class StaffSearchController extends GetBaseController<Values> {
  protected shouldContinueRenderFlowOnSuccess = true

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
