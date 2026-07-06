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
  familyExpiryDates,
  areTypeFamiliesInactive,
} from '../../reportConfiguration/constants'
import type { PaginatedBasicReports } from '../../data/incidentReportingApi'
import { type Order, orderOptions } from '../../data/offenderSearchApi'
import { pecsRegions } from '../../data/pecsRegions'
import { ApiUserAction, apiUserActions } from '../../middleware/permissions'
import type { HeaderCell } from '../../utils/sortableTable'
import format from '../../utils/format'
import type { GovukErrorSummaryItem, GovukSelectItem } from '../../utils/govukFrontend'
import { hasInvalidValues } from '../../utils/utils'
import { sortableTableHead } from '../../utils/sortableTable'
import { pagination } from '../../utils/pagination'
import { multiCaseloadColumns, singleCaseloadColumns } from './tableColumns'
import { filtersFromUiFilters, readUiFilters, validateUiFilters } from './filters'

export type IncidentStatuses = Status | WorkList

const sortOptions = ['incidentDateAndTime', 'reportReference', 'location', 'type', 'status', 'reportedBy']

interface ListFormData {
  clearFilters?: string
  searchID?: string
  location?: string
  fromDate?: string
  toDate?: string
  typeFamily?: TypeFamily
  incidentStatuses?: IncidentStatuses | IncidentStatuses[]
  latestUserActions?: ApiUserAction | ApiUserAction[] | 'REQUEST_REMOVAL'
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
    const { activeCaseLoad, caseLoads } = res.locals.user
    const userCaseloads = caseLoads ?? []
    const userCaseloadIds = userCaseloads.map(caseload => caseload.caseLoadId)
    const pecsRegionCodes = pecsRegions.map(pecsRegion => pecsRegion.code)

    const uiFilters = readUiFilters(req)

    const { clearFilters }: ListFormData = req.query
    let { incidentStatuses, latestUserActions, sort, order }: ListFormData = req.query

    if (clearFilters && ['All', 'ToDo'].includes(clearFilters)) {
      req.session.dashboardFilters = {}
    }

    if (!sort || !sortOptions.includes(sort)) {
      sort = 'incidentDateAndTime'
    }
    if (!order || !orderOptions.includes(order)) {
      order = 'DESC'
    }

    // Collect errors
    const errors: GovukErrorSummaryItem[] = validateUiFilters(uiFilters)

    // If no filters are supplied from query and no errors generated, check for filters in session
    if (req.url === '/' && req.session.dashboardFilters) {
      incidentStatuses = req.session.dashboardFilters?.incidentStatuses
      latestUserActions = req.session.dashboardFilters?.latestUserActions
      sort = req.session.dashboardFilters?.sort ?? 'incidentDateAndTime'
      order = req.session.dashboardFilters?.order ?? 'DESC'
    }

    const filters = filtersFromUiFilters(uiFilters)

    // Check for supplied filters from session
    let noFiltersSupplied = Boolean(
      !uiFilters.searchID &&
      !uiFilters.location &&
      !filters.fromDate &&
      !filters.toDate &&
      !uiFilters.typeFamily &&
      !incidentStatuses &&
      !latestUserActions,
    )

    // RO: Default work list to 'To do' for an RO when no other filters are applied and when the user arrives on page
    if (permissions.isReportingOfficer && clearFilters === 'ToDo') {
      incidentStatuses = ['toDo']
      noFiltersSupplied = false
    }

    // Ensure incidentStatuses is an array when provided
    if (incidentStatuses && !Array.isArray(incidentStatuses)) {
      incidentStatuses = [incidentStatuses]
    }

    // Ensure incidentStatuses is an array when provided
    if (latestUserActions && !Array.isArray(latestUserActions)) {
      latestUserActions = [latestUserActions]
    }
    // Validate and process user action filter
    let userActionFilter: ApiUserAction[] | undefined
    if (latestUserActions) {
      try {
        userActionFilter = processUserAction(latestUserActions as string[])
      } catch (err) {
        latestUserActions = undefined
        userActionFilter = undefined
        const errorMessage = err instanceof Error ? err.message : err!.toString()
        errors.push({ href: '#latestUserActions-item', text: errorMessage })
      }
    }
    // If an RO opens a link containing filter, remove filter
    if (permissions.isReportingOfficer) {
      userActionFilter = undefined
    }

    let searchStatuses: Status[] | undefined
    try {
      const useWorklists = permissions.isReportingOfficer
      searchStatuses = statusesFromParam(incidentStatuses as IncidentStatuses[], useWorklists)
    } catch (err) {
      incidentStatuses = undefined
      const errorMessage = err instanceof Error ? err.message : err!.toString()
      errors.push({ href: '#incidentStatuses-item', text: errorMessage })
    }

    // Set locations to user’s caseloads by default and PECS regions if allowed
    let searchLocations: string[] = userCaseloadIds
    if (permissions.hasPecsAccess) {
      searchLocations.push(...pecsRegionCodes)
    }
    if (uiFilters.location) {
      if (userCaseloadIds.includes(uiFilters.location)) {
        searchLocations = [uiFilters.location]
      } else if (permissions.hasPecsAccess && pecsRegionCodes.includes(uiFilters.location)) {
        searchLocations = [uiFilters.location]
      } else if (permissions.hasPecsAccess && uiFilters.location === allPecsRegionsFlag) {
        searchLocations = pecsRegionCodes
      } else {
        errors.push({
          href: '#location',
          text: 'Select a location to search',
        })
      }
    }

    // Get reports from API
    let reportsResponse: PaginatedBasicReports | undefined
    // TODO: should probably not search if there are errors, because what’ll show will not match apparent filters
    try {
      reportsResponse = await incidentReportingApi.getReports({
        reference: filters.referenceNumber,
        location: searchLocations,
        incidentDateFrom: filters.fromDate,
        incidentDateUntil: filters.toDate,
        type: filters.type,
        status: searchStatuses,
        involvingPrisonerNumber: filters.prisonerNumber,
        userAction: userActionFilter,
        page: filters.page - 1,
        sort: [`${sort},${order}`],
      })
    } catch (e) {
      logger.error(e, 'Search failed: %j', e)
      errors.push({ href: '#searchID', text: 'Sorry, there was a problem with your request' })
    }

    const formValues: ListFormData = {
      searchID: uiFilters.searchID,
      location: uiFilters.location,
      fromDate: uiFilters.fromDate,
      toDate: uiFilters.toDate,
      typeFamily: uiFilters.typeFamily,
      incidentStatuses,
      latestUserActions,
      sort,
      order,
      page: uiFilters.page,
    }

    const queryString = new URLSearchParams()
    if (uiFilters.searchID) {
      queryString.append('searchID', uiFilters.searchID)
    }
    if (uiFilters.location) {
      queryString.append('location', uiFilters.location)
    }
    if (uiFilters.fromDate) {
      queryString.append('fromDate', uiFilters.fromDate)
    }
    if (uiFilters.toDate) {
      queryString.append('toDate', uiFilters.toDate)
    }
    if (uiFilters.typeFamily) {
      queryString.append('typeFamily', uiFilters.typeFamily)
    }
    if (incidentStatuses) {
      if (Array.isArray(incidentStatuses)) {
        incidentStatuses.forEach(status => queryString.append('incidentStatuses', status))
      } else {
        queryString.append('incidentStatuses', incidentStatuses)
      }
    }
    if (latestUserActions) {
      if (Array.isArray(latestUserActions)) {
        latestUserActions.forEach(userAction => queryString.append('latestUserActions', userAction))
      } else {
        queryString.append('latestUserActions', latestUserActions)
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

    const familyInactiveStatus = areTypeFamiliesInactive(types)
    const activeTypeFamilyItems: GovukSelectItem[] = typeFamilies
      .filter(({ code: someFamilyCode }) => !familyInactiveStatus[someFamilyCode])
      .map(family => ({
        value: family.code,
        text: family.description,
      }))

    const expiredTypeFamilyItems: GovukSelectItem[] = typeFamilies
      .filter(({ code: someFamilyCode }) => familyInactiveStatus[someFamilyCode])
      .map(family => ({
        value: family.code,
        text: `${family.description} (inactive since ${familyExpiryDates[family.code]})`,
      }))

    const typeFamilyItems: GovukSelectItem[] = [...activeTypeFamilyItems, ...expiredTypeFamilyItems]

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

    const columns = showLocationFilter ? multiCaseloadColumns : singleCaseloadColumns
    const tableHead: HeaderCell[] = sortableTableHead({
      columns,
      sortColumn: sort,
      order,
      urlPrefix: tableHeadUrlPrefix,
      destinationFocusId: 'results-table',
    })
    const paginationParams = reportsResponse
      ? pagination(
          filters.page,
          reportsResponse.totalPages,
          urlPrefix,
          'moj',
          reportsResponse.totalElements,
          reportsResponse.size,
        )
      : undefined

    // Gather notification banner entries if they exist
    const banners = req.flash()

    // TODO: Move logic into helper once all filters are in uiFilters
    // Set dashboard filters stored in the session if no errors present
    if (errors.length === 0) {
      req.session.dashboardFilters = {
        searchID: uiFilters.searchID,
        location: uiFilters.location,
        fromDate: uiFilters.fromDate,
        toDate: uiFilters.toDate,
        typeFamily: uiFilters.typeFamily,
        incidentStatuses,
        latestUserActions,
        sort,
        order,
      }
    }

    const todayAsShortDate = format.shortDate(new Date())

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

function processUserAction(userActions: string[]): ApiUserAction[] {
  if (hasInvalidValues(userActions, [...apiUserActions, 'REQUEST_REMOVAL'])) {
    throw new Error('Enter a valid user action')
  } else if (userActions.includes('REQUEST_REMOVAL')) {
    return [
      ...userActions.filter(action => action !== 'REQUEST_REMOVAL'),
      'REQUEST_NOT_REPORTABLE',
      'REQUEST_DUPLICATE',
    ] as ApiUserAction[]
  } else {
    return userActions as ApiUserAction[]
  }
}
