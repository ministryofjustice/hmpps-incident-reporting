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
import { fillInDefaults, filtersFromUiFilters, readUiFilters, validateUiFilters } from './filters'

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
    const filters = filtersFromUiFilters(uiFilters, useWorklists, permissions)

    if (uiFilters.clearFilters && ['All', 'ToDo'].includes(uiFilters.clearFilters)) {
      req.session.dashboardFilters = {}
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
        userAction: filters.userAction,
        page: filters.page - 1,
        sort: filters.sort,
      })
    } catch (e) {
      logger.error(e, 'Search failed: %j', e)
      errors.push({ href: '#searchID', text: 'Sorry, there was a problem with your request' })
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
    uiFilters.incidentStatuses?.forEach(status => queryString.append('incidentStatuses', status))
    uiFilters.latestUserActions?.forEach(userAction => queryString.append('latestUserActions', userAction))

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

    // Set dashboard filters stored in the session if no errors present
    if (errors.length === 0) {
      req.session.dashboardFilters = uiFilters
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
      formValues: uiFilters,
      errors,
      todayAsShortDate,
      tableHead,
      paginationParams,
    })
  })

  return router
}
