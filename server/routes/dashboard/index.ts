import { URLSearchParams } from 'node:url'

import { RequestHandler, Router } from 'express'
import type { PathParams } from 'express-serve-static-core'

import logger from '../../../logger'
import {
  type Status,
  type Type,
  type WorkList,
  workListMapping,
  workListStatusMapping,
  statuses,
  types,
  workListCodes,
} from '../../reportConfiguration/constants'
import { roleApproveReject, roleReadWrite } from '../../data/constants'
import type { PaginatedBasicReports } from '../../data/incidentReportingApi'
import type { Order } from '../../data/offenderSearchApi'
import type { HeaderCell } from '../../utils/sortableTable'
import format from '../../utils/format'
import type { GovukCheckboxesItem, GovukErrorSummaryItem, GovukSelectItem } from '../../utils/govukFrontend'
import { parseDateInput } from '../../utils/parseDateTime'
import { checkForOutliers } from '../../utils/utils'
import { sortableTableHead } from '../../utils/sortableTable'
import { type LegacyPagination, pagination } from '../../utils/pagination'
import type { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { type ColumnEntry, multiCaseloadColumns, singleCaseloadColumns } from './tableColumns'

export type IncidentStatuses = Status | WorkList

interface ListFormData {
  searchID?: string
  location?: string
  fromDate?: string
  toDate?: string
  incidentType?: Type
  incidentStatuses?: IncidentStatuses | IncidentStatuses[]
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

    const userRoles: string[] = res.locals.user.roles

    const { activeCaseLoad, caseLoads: userCaseloads } = res.locals.user
    const userCaseloadIds = userCaseloads.map(caseload => caseload.caseLoadId)

    let showEstablishmentsFilter = false
    // TODO: PECS
    if (userCaseloadIds.length > 1) {
      showEstablishmentsFilter = true
    }

    const { location, fromDate: fromDateInput, toDate: toDateInput, incidentType, page }: ListFormData = req.query
    let { searchID, incidentStatuses, sort, order }: ListFormData = req.query

    if (searchID) {
      searchID = searchID.trim()
    }

    if (!sort) {
      sort = 'incidentDateAndTime'
    }
    if (!order) {
      order = 'DESC'
    }

    // Select relevant table columns
    let tableColumns: ColumnEntry[]
    if (showEstablishmentsFilter) {
      tableColumns = multiCaseloadColumns
    } else {
      tableColumns = singleCaseloadColumns
    }

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
    if (fromDate && toDate && toDate < fromDate) {
      fromDate = null
      toDate = null
      errors.push({ href: '#toDate', text: 'Enter a date after from date' })
    }

    let noFiltersSupplied = Boolean(
      !searchID && !location && !fromDate && !toDate && !incidentType && !incidentStatuses,
    )

    // Check for invalid work list filter options submitted via the url query
    if (
      userRoles.includes(roleReadWrite) &&
      !userRoles.includes(roleApproveReject) &&
      incidentStatuses &&
      checkForOutliers(incidentStatuses, workListCodes)
    ) {
      incidentStatuses = undefined
      errors.push({ href: '#incidentStatuses', text: 'Work list filter submitted contains invalid values' })
    }
    // Check for invalid status filter options submitted via the url query
    if (
      !userRoles.includes(roleReadWrite) &&
      userRoles.includes(roleApproveReject) &&
      incidentStatuses &&
      checkForOutliers(
        incidentStatuses,
        statuses.map(status => status.code),
      )
    ) {
      incidentStatuses = undefined
      errors.push({ href: '#incidentStatuses', text: 'Status filter submitted contains invalid values' })
    }
    // Default work list to 'To do' for an RO when no other filters are applied and when the user arrives on page
    if (
      userRoles.includes(roleReadWrite) &&
      !userRoles.includes(roleApproveReject) &&
      !('incidentStatuses' in req.query) &&
      !('sort' in req.query || 'page' in req.query) &&
      noFiltersSupplied
    ) {
      incidentStatuses = 'toDo'
      noFiltersSupplied = false
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

    // Set locations to user's caseload by default
    let searchLocations: string[] | string = userCaseloadIds
    // Overwrite locations with chosen filter if it exists and location is in user's caseload
    if (location && userCaseloadIds.includes(location)) {
      searchLocations = location
    }
    // Show error message when user tries to select an establishment outside their caseload via the url query
    if (location && !userCaseloadIds.includes(location)) {
      errors.push({
        href: '#location',
        text: "Establishments can only be selected if they exist in the user's caseload",
      })
    }

    let searchStatuses: Status | Status[]
    // Replace status mappings if RO viewing page
    if (userRoles.includes(roleReadWrite) && !userRoles.includes(roleApproveReject)) {
      if (Array.isArray(incidentStatuses)) {
        searchStatuses = (incidentStatuses as WorkList[])
          .map(incidentStatus => workListStatusMapping[incidentStatus])
          .flat(1)
      } else {
        searchStatuses = workListStatusMapping[incidentStatuses]
      }
    } else {
      searchStatuses = incidentStatuses as Status
    }

    // Get reports from API
    let reportsResponse: PaginatedBasicReports
    try {
      reportsResponse = await incidentReportingApi.getReports({
        reference: referenceNumber,
        location: searchLocations,
        incidentDateFrom: fromDate,
        incidentDateUntil: toDate,
        type: incidentType,
        status: searchStatuses,
        involvingPrisonerNumber: prisonerId,
        page: pageNumber - 1,
        sort: [`${sort},${order}`],
      })
    } catch (e) {
      logger.error(e, 'Search failed: %j', e)
      // TODO: find a different way to report whole-form errors rather than attaching to specific field
      errors.push({ href: '#searchID', text: 'Sorry, there was a problem with your request' })
    }

    const formValues: ListFormData = {
      searchID,
      location,
      fromDate: fromDateInput,
      toDate: toDateInput,
      incidentType: incidentType as Type,
      incidentStatuses: incidentStatuses as IncidentStatuses,
      sort,
      order: order as Order,
      page,
    }

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
      if (Array.isArray(incidentStatuses)) {
        incidentStatuses.forEach(status => queryString.append('incidentStatuses', status))
      } else {
        queryString.append('incidentStatuses', incidentStatuses)
      }
    }
    const tableHeadUrlPrefix = `/reports?${queryString}&`
    if (sort) {
      queryString.append('sort', sort)
    }
    if (order) {
      queryString.append('order', order)
    }

    const urlPrefix = `/reports?${queryString}&`

    const reports = reportsResponse?.content ?? []
    const usernames = reports.map(report => report.reportedBy)
    const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)
    const incidentTypes: GovukSelectItem[] = types.map(incType => ({
      value: incType.code,
      text: incType.description,
    }))
    let statusItems: GovukCheckboxesItem[]
    let statusCheckboxLabel: string
    if (userRoles.includes(roleReadWrite) && !userRoles.includes(roleApproveReject)) {
      statusItems = workListMapping.map(workListValue => ({
        value: workListValue.code,
        text: workListValue.description,
      }))
      statusCheckboxLabel = 'Work list'
    } else {
      statusItems = statuses.map(status => ({
        value: status.code,
        text: status.description,
      }))
      statusCheckboxLabel = 'Status'
    }
    // TODO: PECS
    const establishments: GovukSelectItem[] = userCaseloads.map(caseload => ({
      value: caseload.caseLoadId,
      text: caseload.description,
    }))

    const typesLookup = Object.fromEntries(types.map(type => [type.code, type.description]))
    const statusLookup = Object.fromEntries(statuses.map(status => [status.code, status.description]))
    const establishmentLookup = Object.fromEntries(
      establishments.map(establishment => [establishment.value, establishment.text]),
    )

    let tableHead: HeaderCell[] | undefined
    let paginationParams: LegacyPagination
    if (reportsResponse) {
      tableHead = sortableTableHead({
        columns: tableColumns,
        sortColumn: sort,
        order,
        urlPrefix: tableHeadUrlPrefix,
      })
      paginationParams = pagination(
        pageNumber,
        reportsResponse.totalPages,
        urlPrefix,
        'moj',
        reportsResponse.totalElements,
        reportsResponse.size,
      )
    }

    // Gather notification banner entries if they exist
    const banners = req.flash()

    res.render('pages/dashboard', {
      activeCaseLoad,
      banners,
      reports,
      establishments,
      establishmentLookup,
      usersLookup,
      incidentTypes,
      statusItems,
      typesLookup,
      statusCheckboxLabel,
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
