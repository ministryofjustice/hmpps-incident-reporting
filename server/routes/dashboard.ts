import { RequestHandler, Router } from 'express'
import type { PathParams } from 'express-serve-static-core'
import type { Status, Type } from '../reportConfiguration/constants'
import type { Order } from '../data/offenderSearchApi'
import type { HeaderCell, SortableTableColumns } from '../utils/sortableTable'
import format from '../utils/format'
import type { GovukErrorSummaryItem } from '../utils/govukFrontend'
import { parseDateInput } from '../utils/utils'
import { statuses, types } from '../reportConfiguration/constants'
import { sortableTableHead } from '../utils/sortableTable'
import { pagination } from '../utils/pagination'
import type { Services } from '../services'
import asyncMiddleware from '../middleware/asyncMiddleware'

interface ListFormData {
  location?: string
  fromDate?: string
  toDate?: string
  incidentType?: Type
  reportingOfficer?: string
  incidentStatuses?: Status
  sort?: string
  order?: Order
  page?: string
}

export default function dashboard(service: Services): Router {
  const router = Router({ mergeParams: true })
  const { userService } = service
  const get = (path: PathParams, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    const { incidentReportingApi, prisonApi } = res.locals.apis

    const {
      location,
      fromDate: fromDateInput,
      toDate: toDateInput,
      incidentType,
      reportingOfficer,
      page,
      incidentStatuses,
    }: ListFormData = req.query
    let { sort, order }: ListFormData = req.query

    if (!sort) {
      sort = 'incidentDateAndTime'
    }
    if (!order) {
      order = 'DESC'
    }

    const formValues: ListFormData = {
      location,
      fromDate: fromDateInput,
      toDate: toDateInput,
      incidentType: incidentType as Type,
      reportingOfficer,
      incidentStatuses: incidentStatuses as Status,
      sort,
      order: order as Order,
      page,
    }

    const tableColumns: SortableTableColumns<
      'reportReference' | 'type' | 'incidentDateAndTime' | 'description' | 'status' | 'reportedBy'
    > = [
      { column: 'reportReference', escapedHtml: 'Incident ref', classes: 'app-prisoner-search__cell--incident-ref' },
      {
        column: 'type',
        escapedHtml: 'Incident type',
        classes: 'app-prisoner-search__cell--incident-type',
      },
      {
        column: 'incidentDateAndTime',
        escapedHtml: 'Incident date',
        classes: 'app-prisoner-search__cell--incident-time',
      },
      {
        column: 'description',
        escapedHtml: 'Description',
        classes: 'app-prisoner-search__cell--description',
        unsortable: true,
      },
      {
        column: 'status',
        escapedHtml: 'Status',
        classes: 'app-prisoner-search__cell--status',
      },
      {
        column: 'reportedBy',
        escapedHtml: 'Reported By',
        classes: 'app-prisoner-search__cell--reported-by',
      },
    ]

    // Parse params
    const todayAsShortDate = format.shortDate(new Date())
    const errors: GovukErrorSummaryItem[] = []
    let fromDate: Date | null
    let toDate: Date | null
    try {
      if (fromDateInput) {
        fromDate = parseDateInput(fromDateInput)
      }
    } catch {
      fromDate = null
      errors.push({ href: '#fromDate', text: `Enter a valid from date, for example ${todayAsShortDate}` })
    }
    try {
      if (toDateInput) {
        toDate = parseDateInput(toDateInput)
      }
    } catch {
      toDate = null
      errors.push({ href: '#toDate', text: `Enter a valid to date, for example ${todayAsShortDate}` })
    }

    // Parse page number
    let pageNumber = (page && typeof page === 'string' && parseInt(page, 10)) || 1
    if (pageNumber < 1) {
      pageNumber = 1
    }

    const orderString = order as string
    // Get reports from API
    const reportsResponse = await incidentReportingApi.getReports({
      location,
      incidentDateFrom: fromDate,
      incidentDateUntil: toDate,
      type: incidentType,
      status: incidentStatuses,
      reportedByUsername: reportingOfficer,
      page: pageNumber - 1,
      sort: [`${sort},${orderString}`],
    })

    const queryString = new URLSearchParams()
    if (location) {
      queryString.append('location', location)
    }
    if (fromDateInput) {
      queryString.append('fromDate', fromDateInput)
    }
    if (toDateInput) {
      queryString.append('toDate', toDateInput)
    }
    if (incidentType) {
      queryString.append('incidentType', incidentType)
    }
    if (incidentStatuses) {
      queryString.append('incidentStatuses', incidentStatuses)
    }
    if (reportingOfficer) {
      queryString.append('reportingOfficer', reportingOfficer)
    }
    const tableHeadUrlPrefix = `/incidents?${queryString}&`
    if (sort) {
      queryString.append('sort', sort)
    }
    if (order) {
      queryString.append('order', order)
    }

    const urlPrefix = `/incidents?${queryString}&`

    const noFiltersSupplied = Boolean(
      !location && !fromDate && !toDate && !incidentType && !incidentStatuses && !reportingOfficer,
    )

    const reports = reportsResponse.content
    const usernames = reports.map(report => report.reportedBy)
    const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)
    const prisonsLookup = await prisonApi.getPrisons()
    const reportingOfficers = Object.values(usersLookup).map(user => ({
      value: user.username,
      text: user.name,
    }))
    const prisons = Object.values(prisonsLookup).map(prison => ({
      value: prison.agencyId,
      text: prison.description,
    }))
    const incidentTypes = types.map(incType => ({
      value: incType.code,
      text: incType.description,
    }))
    const statusItems = statuses.map(status => ({
      value: status.code,
      text: status.description,
    }))

    const typesLookup = Object.fromEntries(types.map(type => [type.code, type.description]))
    const statusLookup = Object.fromEntries(statuses.map(status => [status.code, status.description]))

    const tableHead: HeaderCell[] | undefined = sortableTableHead({
      columns: tableColumns.map(column => {
        return {
          ...column,
        }
      }),
      sortColumn: sort,
      order,
      urlPrefix: tableHeadUrlPrefix,
    })
    const paginationParams = pagination(
      pageNumber,
      reportsResponse.totalPages,
      urlPrefix,
      'moj',
      reportsResponse.totalElements,
      reportsResponse.size,
    )

    res.render('pages/dashboard', {
      reports,
      prisons,
      usersLookup,
      reportingOfficers,
      incidentTypes,
      statusItems,
      typesLookup,
      statusLookup,
      formValues,
      errors,
      todayAsShortDate,
      noFiltersSupplied,
      tableHead,
      paginationParams,
    })
  })

  return router
}
