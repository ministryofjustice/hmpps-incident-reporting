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
  searchID?: string
  location?: string
  fromDate?: string
  toDate?: string
  incidentType?: Type
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
    const { incidentReportingApi } = res.locals.apis

    const userCaseloads = res.locals.user.caseLoads
    const userCaseloadIds = userCaseloads.map(caseload => caseload.caseLoadId)

    let showEstablishmentsFilter = false
    if (userCaseloadIds.length > 1) {
      showEstablishmentsFilter = true
    }

    const {
      location,
      fromDate: fromDateInput,
      toDate: toDateInput,
      incidentType,
      page,
      incidentStatuses,
    }: ListFormData = req.query
    let { searchID, sort, order }: ListFormData = req.query

    if (searchID) {
      searchID = searchID.trim()
    }

    if (!sort) {
      sort = 'incidentDateAndTime'
    }
    if (!order) {
      order = 'DESC'
    }

    const formValues: ListFormData = {
      searchID,
      location,
      fromDate: fromDateInput,
      toDate: toDateInput,
      incidentType: incidentType as Type,
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
    let prisonerId: string
    let referenceNumber: string
    if (searchID) {
      // Test if search is for a prisoner ID and use if so
      if (searchID.match(/^[a-zA-Z][0-9]{4}[a-zA-Z]{2}$/)) {
        prisonerId = searchID
      }
      // Test if search is for an incident reference number and use if so
      else if (searchID.match(/^[0-9]+$/)) {
        referenceNumber = searchID
      } else {
        errors.push({
          href: '#searchID',
          text: `Enter a valid incident reference number or offender ID. For example, 12345678 or A0011BB`,
        })
      }
    }

    // Parse page number
    let pageNumber = (page && typeof page === 'string' && parseInt(page, 10)) || 1
    if (pageNumber < 1) {
      pageNumber = 1
    }

    const orderString = order as string

    // Set locations to user's caseload
    let searchLocations: string[] | string = userCaseloadIds
    // Overwrite locations with chosen filter if it exists
    if (location) {
      searchLocations = location
    }

    // Get reports from API
    const reportsResponse = await incidentReportingApi.getReports({
      reference: referenceNumber,
      location: searchLocations,
      incidentDateFrom: fromDate,
      incidentDateUntil: toDate,
      type: incidentType,
      status: incidentStatuses,
      involvingPrisonerNumber: prisonerId,
      page: pageNumber - 1,
      sort: [`${sort},${orderString}`],
    })

    const queryString = new URLSearchParams()
    if (searchID) {
      queryString.append('searchID', searchID)
    }
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
    const tableHeadUrlPrefix = `/reports?${queryString}&`
    if (sort) {
      queryString.append('sort', sort)
    }
    if (order) {
      queryString.append('order', order)
    }

    const urlPrefix = `/reports?${queryString}&`

    const noFiltersSupplied = Boolean(
      !searchID && !location && !fromDate && !toDate && !incidentType && !incidentStatuses,
    )

    const reports = reportsResponse.content
    const usernames = reports.map(report => report.reportedBy)
    const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)
    const reportingOfficers = Object.values(usersLookup).map(user => ({
      value: user.username,
      text: user.name,
    }))
    const incidentTypes = types.map(incType => ({
      value: incType.code,
      text: incType.description,
    }))
    const statusItems = statuses.map(status => ({
      value: status.code,
      text: status.description,
    }))
    const establishments = userCaseloads.map(caseload => ({
      value: caseload.caseLoadId,
      text: caseload.description,
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
      establishments,
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
      showEstablishmentsFilter,
    })
  })

  return router
}
