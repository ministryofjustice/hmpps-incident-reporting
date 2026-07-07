import { URLSearchParams } from 'node:url'

import { Router } from 'express'

import logger from '../../../logger'
import {
  type TypeFamily,
  workLists,
  workListMapping,
  statusesDescriptions,
  statusHints,
  types,
  typesDescriptions,
  typeFamilies,
  familyExpiryDates,
  areTypeFamiliesInactive,
} from '../../reportConfiguration/constants'
import type { PaginatedBasicReports } from '../../data/incidentReportingApi'
import { type Order } from '../../data/offenderSearchApi'
import { pecsRegions } from '../../data/pecsRegions'
import { ApiUserAction, apiUserActions } from '../../middleware/permissions'
import type { HeaderCell } from '../../utils/sortableTable'
import format from '../../utils/format'
import type { GovukSelectItem } from '../../utils/govukFrontend'
import { hasInvalidValues } from '../../utils/utils'
import { sortableTableHead } from '../../utils/sortableTable'
import { pagination } from '../../utils/pagination'
import { multiCaseloadColumns, singleCaseloadColumns } from './tableColumns'
import {
  type IncidentStatuses,
  fillInDefaults,
  filtersFromUiFilters,
  readUiFilters,
  validateUiFilters,
} from './filters'

interface ListFormData {
  clearFilters?: string
  searchID?: string
  location?: string
  fromDate?: string
  toDate?: string
  typeFamily?: TypeFamily
  incidentStatuses?: IncidentStatuses[]
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

    const useWorklists = permissions.isReportingOfficer

    const uiFilters = readUiFilters(req)
    fillInDefaults(uiFilters, useWorklists)
    const errors = validateUiFilters(uiFilters, useWorklists)
    const filters = filtersFromUiFilters(uiFilters, useWorklists)

    let { latestUserActions }: ListFormData = req.query

    if (uiFilters.clearFilters && ['All', 'ToDo'].includes(uiFilters.clearFilters)) {
      req.session.dashboardFilters = {}
    }

    // If no filters are supplied from query and no errors generated, check for filters in session
    if (req.url === '/' && req.session.dashboardFilters) {
      latestUserActions = req.session.dashboardFilters?.latestUserActions
    }

    // Ensure latestUserActions is an array when provided
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
        status: filters.status,
        involvingPrisonerNumber: filters.prisonerNumber,
        userAction: userActionFilter,
        page: filters.page - 1,
        sort: filters.sort,
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
      incidentStatuses: uiFilters.incidentStatuses,
      latestUserActions,
      sort: uiFilters.sort,
      order: uiFilters.order,
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
    if (uiFilters.incidentStatuses) {
      uiFilters.incidentStatuses.forEach(status => queryString.append('incidentStatuses', status))
    }
    if (latestUserActions) {
      if (Array.isArray(latestUserActions)) {
        latestUserActions.forEach(userAction => queryString.append('latestUserActions', userAction))
      } else {
        queryString.append('latestUserActions', latestUserActions)
      }
    }
    const tableHeadUrlPrefix = `/reports?${queryString}&`
    if (uiFilters.sort) {
      queryString.append('sort', uiFilters.sort)
    }
    if (uiFilters.order) {
      queryString.append('order', uiFilters.order)
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
      sortColumn: uiFilters.sort,
      order: uiFilters.order,
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
        incidentStatuses: uiFilters.incidentStatuses,
        latestUserActions,
        sort: uiFilters.sort,
        order: uiFilters.order,
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
      tableHead,
      paginationParams,
    })
  })

  return router
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
