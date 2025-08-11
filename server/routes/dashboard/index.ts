import { URLSearchParams } from 'node:url'

import { Router } from 'express'

import logger from '../../../logger'
import {
  type Status,
  type TypeFamily,
  type WorkList,
  workLists,
  workListCodes,
  workListMapping,
  statuses,
  types,
  typeFamilies,
} from '../../reportConfiguration/constants'
import type { PaginatedBasicReports } from '../../data/incidentReportingApi'
import { type Order, orderOptions } from '../../data/offenderSearchApi'
import { pecsRegions } from '../../data/pecsRegions'
import type { HeaderCell } from '../../utils/sortableTable'
import format from '../../utils/format'
import type { GovukCheckboxesItem, GovukErrorSummaryItem, GovukSelectItem } from '../../utils/govukFrontend'
import { parseDateInput } from '../../utils/parseDateTime'
import { hasInvalidValues } from '../../utils/utils'
import { sortableTableHead } from '../../utils/sortableTable'
import { type LegacyPagination, pagination } from '../../utils/pagination'
import { type ColumnEntry, multiCaseloadColumns, singleCaseloadColumns } from './tableColumns'

export type IncidentStatuses = Status | WorkList

interface ListFormData {
  searchID?: string
  location?: string
  fromDate?: string
  toDate?: string
  typeFamily?: TypeFamily
  incidentStatuses?: IncidentStatuses | IncidentStatuses[]
  sort?: string
  order?: Order
  page?: string
}

/** Location search filter which is replaced by all PECS regions when performing search */
const allPecsRegionsFlag = '.PECS' as const

export default function dashboard(): Router {
  const router = Router({ mergeParams: true })

  router.get('/', async (req, res) => {
    const { incidentReportingApi, userService } = res.locals.apis

    const { permissions } = res.locals
    const { activeCaseLoad, caseLoads: userCaseloads } = res.locals.user
    const userCaseloadIds = userCaseloads.map(caseload => caseload.caseLoadId)

    const showLocationFilter = userCaseloadIds.length > 1 || permissions.hasPecsAccess

    const { location, fromDate: fromDateInput, toDate: toDateInput, page }: ListFormData = req.query
    let { searchID, typeFamily, incidentStatuses, sort, order }: ListFormData = req.query

    if (searchID) {
      searchID = searchID.trim()
    }

    if (!sort) {
      sort = 'incidentDateAndTime'
    }
    if (!orderOptions.includes(order)) {
      order = 'DESC'
    }

    // Select relevant table columns
    let tableColumns: ColumnEntry[]
    if (showLocationFilter) {
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
    if (typeFamily && !(typeFamily in familyToType)) {
      typeFamily = undefined
      errors.push({ href: '#typeFamily', text: 'Select a valid incident type' })
    }

    let noFiltersSupplied = Boolean(!searchID && !location && !fromDate && !toDate && !typeFamily && !incidentStatuses)

    // RO: Default work list to 'To do' for an RO when no other filters are applied and when the user arrives on page
    if (
      permissions.isReportingOfficer &&
      !('incidentStatuses' in req.query) &&
      !('sort' in req.query || 'page' in req.query) &&
      noFiltersSupplied
    ) {
      incidentStatuses = ['toDo']
      noFiltersSupplied = false
    }

    // Ensure incidentStatuses is an array when provided
    if (incidentStatuses && !Array.isArray(incidentStatuses)) {
      incidentStatuses = [incidentStatuses]
    }

    let searchStatuses: Status[] | undefined
    try {
      const useWorklists = permissions.isReportingOfficer
      searchStatuses = statusesFromParam(incidentStatuses as IncidentStatuses[], useWorklists)
    } catch (err) {
      let errorMessage
      if (err.message === 'Invalid status') {
        errorMessage = 'Status filter submitted contains invalid values'
      } else {
        errorMessage = 'Work list filter submitted contains invalid values'
      }

      incidentStatuses = undefined
      errors.push({ href: '#incidentStatuses', text: errorMessage })
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
          text: `Enter a valid incident number or offender ID. For example, 12345678 or A0011BB`,
        })
      }
    }

    // Parse page number
    let pageNumber = (page && typeof page === 'string' && parseInt(page, 10)) || 1
    if (pageNumber < 1) {
      pageNumber = 1
    }

    // Set locations to user’s caseloads by default and PECS regions if allowed
    let searchLocations: string[] | string = userCaseloadIds
    if (permissions.hasPecsAccess) {
      searchLocations.push(...pecsRegions.map(pecsRegion => pecsRegion.code))
    }
    if (location) {
      if (userCaseloadIds.includes(location)) {
        searchLocations = location
      } else if (location === allPecsRegionsFlag && permissions.hasPecsAccess) {
        searchLocations = pecsRegions.map(pecsRegion => pecsRegion.code)
      } else {
        errors.push({
          href: '#location',
          text: 'Select a location to search',
        })
      }
    }

    // Get reports from API
    let reportsResponse: PaginatedBasicReports
    // TODO: should probably not search if there are errors, because what’ll show will not match apparent filters
    try {
      reportsResponse = await incidentReportingApi.getReports({
        reference: referenceNumber,
        location: searchLocations,
        incidentDateFrom: fromDate,
        incidentDateUntil: toDate,
        type: typeFamily && familyToType[typeFamily],
        status: searchStatuses,
        involvingPrisonerNumber: prisonerId,
        page: pageNumber - 1,
        sort: [`${sort},${order}`],
      })
    } catch (e) {
      logger.error(e, 'Search failed: %j', e)
      errors.push({ href: '#searchID', text: 'Sorry, there was a problem with your request' })
    }

    const formValues: ListFormData = {
      searchID,
      location,
      fromDate: fromDateInput,
      toDate: toDateInput,
      typeFamily,
      incidentStatuses: incidentStatuses as IncidentStatuses,
      sort,
      order,
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
    if (typeFamily) {
      queryString.append('typeFamily', typeFamily)
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
    const typeFamilyItems: GovukSelectItem[] = typeFamilies.map(family => ({
      value: family.code,
      text: family.description,
    }))
    let statusItems: GovukCheckboxesItem[]
    let statusCheckboxLabel: string
    if (permissions.isReportingOfficer) {
      statusItems = workLists.map(workListValue => ({
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
    const allLocations: GovukSelectItem[] = userCaseloads.map(caseload => ({
      value: caseload.caseLoadId,
      text: caseload.description,
    }))
    if (permissions.hasPecsAccess) {
      allLocations.unshift({
        value: allPecsRegionsFlag,
        text: 'PECS',
      })
    }

    const typesLookup = Object.fromEntries(types.map(type => [type.code, type.description]))
    const statusLookup = Object.fromEntries(statuses.map(status => [status.code, status.description]))
    const locationLookup = Object.fromEntries(
      userCaseloads.map(caseload => [caseload.caseLoadId, caseload.description]),
    )
    if (permissions.hasPecsAccess) {
      pecsRegions.forEach(pecsRegion => {
        locationLookup[pecsRegion.code] = pecsRegion.description
      })
    }

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
      showLocationFilter,
      allLocations,
      locationLookup,
      usersLookup,
      typeFamilyItems,
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
    })
  })

  return router
}

/** Given a family code, list type codes belonging to the family */
const familyToType = Object.fromEntries(
  Object.values(typeFamilies).map(({ code: familyCode }) => [
    familyCode,
    Object.values(types)
      .filter(({ familyCode: someFamilyCode }) => someFamilyCode === familyCode)
      .map(({ code }) => code),
  ]),
)

/** Converts the `incidentStatuses` query param into a list of statuses */
function statusesFromParam(statusesParam: IncidentStatuses[] | undefined, useWorklists: boolean): Status[] | undefined {
  if (!statusesParam) {
    return undefined
  }

  // Reporting Officer
  if (useWorklists) {
    const hasInvalidWorklist = hasInvalidValues(statusesParam, workListCodes)
    if (hasInvalidWorklist) {
      throw new Error('Invalid worklist')
    }

    const worklists = statusesParam as WorkList[]
    // Map RO worklists to list of statuses
    return worklists.map(worklist => workListMapping[worklist]).flat(1)
  }

  // Data Warden
  const statusCodes = statuses.map(status => status.code)
  const hasInvalidStatus = hasInvalidValues(statusesParam, statusCodes)
  if (hasInvalidStatus) {
    throw new Error('Invalid status')
  }
  return statusesParam as Status[]
}
