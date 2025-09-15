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
  statusesDescriptions,
  statusHints,
  types,
  typesDescriptions,
  typeFamilies,
} from '../../reportConfiguration/constants'
import type { PaginatedBasicReports } from '../../data/incidentReportingApi'
import { type Order, orderOptions } from '../../data/offenderSearchApi'
import { pecsRegions } from '../../data/pecsRegions'
import { isLocationActiveInService } from '../../middleware/permissions'
import type { HeaderCell } from '../../utils/sortableTable'
import format from '../../utils/format'
import type { GovukErrorSummaryItem, GovukSelectItem } from '../../utils/govukFrontend'
import { parseDateInput } from '../../utils/parseDateTime'
import { hasInvalidValues } from '../../utils/utils'
import { sortableTableHead } from '../../utils/sortableTable'
import { type LegacyPagination, pagination } from '../../utils/pagination'
import { multiCaseloadColumns, singleCaseloadColumns } from './tableColumns'

export type IncidentStatuses = Status | WorkList

interface ListFormData {
  clearFilters?: string
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
/** Location search filter which is replaced by all active locations when performing search */
const activeLocationsFlag = '.ACTIVE' as const // TODO: remove after rollout

export default function dashboard(): Router {
  const router = Router({ mergeParams: true })

  router.get('/', async (req, res) => {
    const { incidentReportingApi, userService } = res.locals.apis

    const { permissions } = res.locals
    const { activeCaseLoad, caseLoads: userCaseloads } = res.locals.user
    const userCaseloadIds = userCaseloads.map(caseload => caseload.caseLoadId)
    const pecsRegionCodes = pecsRegions.map(pecsRegion => pecsRegion.code)

    const { page, clearFilters }: ListFormData = req.query
    let {
      fromDate: fromDateInput,
      toDate: toDateInput,
      location,
      searchID,
      typeFamily,
      incidentStatuses,
      sort,
      order,
    }: ListFormData = req.query

    if (['All', 'ToDo'].includes(clearFilters)) {
      req.session.dashboardFilters = {}
    }

    if (searchID) {
      searchID = searchID.trim()
    }
    if (!sort) {
      sort = 'incidentDateAndTime'
    }
    if (!orderOptions.includes(order)) {
      order = 'DESC'
    }

    // Collect errors
    const errors: GovukErrorSummaryItem[] = []

    let noFiltersSupplied = Boolean(
      !searchID && !location && !fromDateInput && !toDateInput && !typeFamily && !incidentStatuses,
    )

    // If no filters are supplied from query and no errors generated, check for filters in session
    if (errors.length === 0 && noFiltersSupplied && !['All', 'ToDo'].includes(clearFilters)) {
      location = req.session.dashboardFilters?.location
      fromDateInput = req.session.dashboardFilters?.fromDateInput
      toDateInput = req.session.dashboardFilters?.toDateInput
      searchID = req.session.dashboardFilters?.searchID
      typeFamily = req.session.dashboardFilters?.typeFamily
      incidentStatuses = req.session.dashboardFilters?.incidentStatuses
    }

    // Parse params
    const todayAsShortDate = format.shortDate(new Date())
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

    // Check for supplied filters from session
    noFiltersSupplied = Boolean(!searchID && !location && !fromDate && !toDate && !typeFamily && !incidentStatuses)

    // RO: Default work list to 'To do' for an RO when no other filters are applied and when the user arrives on page
    if (permissions.isReportingOfficer && clearFilters === 'ToDo') {
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
      incidentStatuses = undefined
      errors.push({ href: '#incidentStatuses', text: err.message })
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
    let searchLocations: string[] = userCaseloadIds
    if (permissions.hasPecsAccess) {
      searchLocations.push(...pecsRegionCodes)
    }
    if (location) {
      if (userCaseloadIds.includes(location)) {
        searchLocations = [location]
      } else if (permissions.hasPecsAccess && pecsRegionCodes.includes(location)) {
        searchLocations = [location]
      } else if (permissions.hasPecsAccess && location === allPecsRegionsFlag) {
        searchLocations = pecsRegionCodes
      } else if (location === activeLocationsFlag) {
        // TODO: remove after rollout
        searchLocations = searchLocations.filter(isLocationActiveInService)
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

    const showWorkListFilters = permissions.isReportingOfficer

    /** location choices for auto-complete */
    const allLocations: GovukSelectItem[] = userCaseloads.map(caseload => ({
      value: caseload.caseLoadId,
      text: caseload.description,
    }))
    /** location map for code-to-description display */
    const locationLookup = Object.fromEntries(
      userCaseloads.map(caseload => [caseload.caseLoadId, caseload.description]),
    )
    if (permissions.hasPecsAccess) {
      allLocations.unshift({
        value: allPecsRegionsFlag,
        text: 'All PECS regions',
      })
      allLocations.push(
        ...pecsRegions.map(pecsRegion => ({
          value: pecsRegion.code,
          text: pecsRegion.description,
        })),
      )
      pecsRegions.forEach(pecsRegion => {
        locationLookup[pecsRegion.code] = pecsRegion.description
      })
    }

    const showLocationFilter = allLocations.length > 1
    if (showLocationFilter) {
      // TODO: remove after rollout
      allLocations.unshift({
        value: activeLocationsFlag,
        text: 'All existing active locations in the prison service',
      })
    }

    let tableHead: HeaderCell[] | undefined
    let paginationParams: LegacyPagination
    if (reportsResponse) {
      const columns = showLocationFilter ? multiCaseloadColumns : singleCaseloadColumns
      tableHead = sortableTableHead({
        columns,
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

    // Set dashboard filters stored in the session
    req.session.dashboardFilters = {
      location,
      fromDateInput,
      toDateInput,
      typeFamily,
      incidentStatuses,
    }

    res.render('pages/dashboard/index', {
      activeCaseLoad,
      banners,
      reports,
      showLocationFilter,
      allLocations,
      locationLookup,
      usersLookup,
      typeFamilyItems,
      workLists,
      workListMapping,
      showWorkListFilters,
      statusesDescriptions,
      statusHints,
      typesDescriptions,
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

  // TODO: consider converting between work lists and statuses so that links with filters can be shared between user types

  // Reporting Officer
  if (useWorklists) {
    const hasInvalidWorklist = hasInvalidValues(statusesParam, workListCodes)
    if (hasInvalidWorklist) {
      throw new Error('Select a valid work list')
    }

    const worklists = statusesParam as WorkList[]
    // Map RO worklists to list of statuses
    return worklists.map(worklist => workListMapping[worklist]).flat(1)
  }

  // Data Warden
  const statusCodes = statuses.map(status => status.code)
  const hasInvalidStatus = hasInvalidValues(statusesParam, statusCodes)
  if (hasInvalidStatus) {
    throw new Error('Select a valid status')
  }

  return statusesParam as Status[]
}
