import { URLSearchParams } from 'node:url'

import { Router } from 'express'

import logger from '../../../logger'
import {
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
import { pecsRegions } from '../../data/pecsRegions'
import type { HeaderCell } from '../../utils/sortableTable'
import format from '../../utils/format'
import type { GovukSelectItem } from '../../utils/govukFrontend'
import { sortableTableHead } from '../../utils/sortableTable'
import { pagination } from '../../utils/pagination'
import { multiCaseloadColumns, singleCaseloadColumns } from './tableColumns'
import {
  type UiFilters,
  ALL_PECS_REGIONS_FLAG,
  fillInDefaults,
  filtersFromUiFilters,
  readUiFilters,
  validateUiFilters,
} from './filters'
import { type CaseLoad } from '../../data/frontendComponentsClient'

export default function dashboard(): Router {
  const router = Router({ mergeParams: true })

  router.get('/', async (req, res) => {
    const { incidentReportingApi, userService } = res.locals.apis

    const { permissions } = res.locals
    const { activeCaseLoad, caseLoads } = res.locals.user
    const userCaseloads = caseLoads ?? []
    const userCaseloadIds = userCaseloads.map(caseload => caseload.caseLoadId)

    const useWorkLists = permissions.isReportingOfficer

    const uiFilters = readUiFilters(req)
    fillInDefaults(uiFilters, useWorkLists)
    const errors = validateUiFilters({ uiFilters, useWorkLists, permissions, userCaseloadIds })
    const filters = filtersFromUiFilters({ uiFilters, useWorkLists, permissions, userCaseloadIds })

    if (uiFilters.clearFilters && ['All', 'ToDo'].includes(uiFilters.clearFilters)) {
      req.session.dashboardFilters = {}
    }

    // Get reports from API
    let reportsResponse: PaginatedBasicReports | undefined
    // TODO: should probably not search if there are errors, because what’ll show will not match apparent filters
    try {
      reportsResponse = await incidentReportingApi.getReports({
        reference: filters.reference,
        location: filters.location,
        incidentDateFrom: filters.incidentDateFrom,
        incidentDateUntil: filters.incidentDateUntil,
        type: filters.type,
        status: filters.status,
        involvingPrisonerNumber: filters.involvingPrisonerNumber,
        userAction: filters.userAction,
        // API page starts at 0
        page: filters.page - 1,
        sort: filters.sort,
      })
    } catch (e) {
      logger.error(e, 'Search failed: %j', e)
      errors.push({ href: '#searchID', text: 'Sorry, there was a problem with your request' })
    }

    const reports = reportsResponse?.content ?? []

    const usernames = reports.map(report => report.reportedBy)
    const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)

    /** location choices for auto-complete */
    const allLocations = allLocationsItems(userCaseloads, permissions.hasPecsAccess)
    const showLocationFilter = allLocations.length > 1

    const { paginationUrlPrefix, tableHeadUrlPrefix } = urlPrefixes(uiFilters)
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
          // UI page starts at 1
          filters.page,
          reportsResponse.totalPages,
          paginationUrlPrefix,
          'moj',
          reportsResponse.totalElements,
          reportsResponse.size,
        )
      : undefined

    // Set dashboard filters stored in the session if no errors present
    if (errors.length === 0) {
      req.session.dashboardFilters = uiFilters
    }

    res.render('pages/dashboard/index', {
      activeCaseLoad,
      banners: req.flash,
      reports,
      showLocationFilter,
      allLocations,
      locationLookup: locationLookupFromCaseloads(userCaseloads, permissions.hasPecsAccess),
      usersLookup,
      typeFamilyItems: typeFamilyItems(),
      workLists,
      workListMapping,
      showWorkListFilters: permissions.isReportingOfficer,
      statusesDescriptions,
      statusHints,
      typesDescriptions,
      formValues: uiFilters,
      errors,
      todayAsShortDate: format.shortDate(new Date()),
      tableHead,
      paginationParams,
    })
  })

  return router
}

function locationLookupFromCaseloads(userCaseloads: CaseLoad[], hasPecsAccess: boolean): Record<string, string> {
  const locationLookup = Object.fromEntries(userCaseloads.map(caseload => [caseload.caseLoadId, caseload.description]))

  if (hasPecsAccess) {
    pecsRegions.forEach(pecsRegion => {
      locationLookup[pecsRegion.code] = pecsRegion.description
    })
  }

  return locationLookup
}

function allLocationsItems(userCaseloads: CaseLoad[], hasPecsAccess: boolean): GovukSelectItem[] {
  const allLocations: GovukSelectItem[] = userCaseloads.map(caseload => ({
    value: caseload.caseLoadId,
    text: caseload.description,
  }))

  if (hasPecsAccess) {
    allLocations.unshift({
      value: ALL_PECS_REGIONS_FLAG,
      text: 'All PECS regions',
    })
    allLocations.push(
      ...pecsRegions.map(pecsRegion => ({
        value: pecsRegion.code,
        text: pecsRegion.description,
      })),
    )
  }

  return allLocations
}

/**
 * List of type families. Sorted alphabeticaly. Inactive ones at the end and display inactive date
 */
function typeFamilyItems(): GovukSelectItem[] {
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

  return [...activeTypeFamilyItems, ...expiredTypeFamilyItems]
}

function urlPrefixes(uiFilters: UiFilters): { paginationUrlPrefix: string; tableHeadUrlPrefix: string } {
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
  uiFilters.incidentStatuses?.forEach(status => queryString.append('incidentStatuses', status))
  uiFilters.latestUserActions?.forEach(userAction => queryString.append('latestUserActions', userAction))

  // sort/order *not* in query string, they're added by `sortableTableHead()`
  const tableHeadUrlPrefix = `/reports?${queryString}&`

  if (uiFilters.sort) {
    queryString.append('sort', uiFilters.sort)
  }
  if (uiFilters.order) {
    queryString.append('order', uiFilters.order)
  }

  // `paginationUrlPrefix` also include sort/order query params
  const paginationUrlPrefix = `/reports?${queryString}&`

  return { tableHeadUrlPrefix, paginationUrlPrefix }
}
