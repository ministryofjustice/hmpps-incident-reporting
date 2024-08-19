import type { RequestHandler } from 'express'
import { NotFound } from 'http-errors'

import format from '../utils/format'
import { pagination } from '../utils/pagination'
import { type ErrorSummaryItem, parseDateInput } from '../utils/utils'
import type { Services } from '../services'
import { IncidentReportingApi } from '../data/incidentReportingApi'
import { OffenderSearchApi } from '../data/offenderSearchApi'

interface ListFormData {
  page?: string
  fromDate?: string
  toDate?: string
}

export default function makeDebugRoutes(services: Services): Record<string, RequestHandler> {
  return {
    async incidentList(req, res) {
      const { page, fromDate: fromDateInput, toDate: toDateInput }: ListFormData = req.query

      const { user } = res.locals
      const systemToken = await services.hmppsAuthClient.getSystemClientToken(user.username)
      const incidentReportingApi = new IncidentReportingApi(systemToken)

      const todayAsShortDate = format.shortDate(new Date())

      // Parse page number
      let pageNumber = (page && typeof page === 'string' && parseInt(page, 10)) || 1
      if (pageNumber < 1) {
        pageNumber = 1
      }

      // Parse dates
      const errors: ErrorSummaryItem[] = []
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

      // Get incidents from API
      const incidentsResponse = await incidentReportingApi.getEvents({
        // prisonId: user.activeCaseLoadId,
        eventDateFrom: fromDate,
        eventDateUntil: toDate,
        page: pageNumber - 1,
        // sort: ['eventDateAndTime,ASC'],
      })

      const urlPrefix = `/incidents?fromDate=${encodeURIComponent(fromDateInput)}&toDate=${encodeURIComponent(toDateInput)}&`
      const paginationParams = pagination(
        pageNumber,
        incidentsResponse.totalPages,
        urlPrefix,
        'moj',
        incidentsResponse.totalElements,
        incidentsResponse.size,
      )
      const formValues: ListFormData = {
        page,
        fromDate: fromDateInput,
        toDate: toDateInput,
      }
      const noFiltersSupplied = Boolean(!fromDate && !toDate)

      const incidents = incidentsResponse.content
      const usernames = incidents.map(incident => incident.modifiedBy)
      const usersLookup = await services.userService.getUsers(systemToken, usernames)

      res.render('pages/debug/incidentList', {
        incidents,
        usersLookup,
        formValues,
        errors,
        todayAsShortDate,
        noFiltersSupplied,
        paginationParams,
      })
    },

    async incidentDetails(req, res) {
      const { id } = req.params
      if (!id) {
        throw new NotFound()
      }

      const { user } = res.locals
      const systemToken = await services.hmppsAuthClient.getSystemClientToken(user.username)
      const incidentReportingApi = new IncidentReportingApi(systemToken)

      const event = await incidentReportingApi.getEventById(id)
      const inputUsernames = event.reports.map(report => report.reportedBy)
      const usersLookup = await services.userService.getUsers(systemToken, inputUsernames)

      res.render('pages/debug/incidentDetails', { event, usersLookup })
    },

    async reportDetails(req, res) {
      const { id } = req.params
      if (!id) {
        throw new NotFound()
      }

      const { user } = res.locals
      const systemToken = await services.hmppsAuthClient.getSystemClientToken(user.username)
      const incidentReportingApi = new IncidentReportingApi(systemToken)
      const offenderSearchApi = new OffenderSearchApi(systemToken)

      const report = await incidentReportingApi.getReportWithDetailsById(id)
      const usersLookup = await services.userService.getUsers(systemToken, [
        ...report.staffInvolved.map(staff => staff.staffUsername),
        report.reportedBy,
      ])
      const prisonerNumbers = report.prisonersInvolved.map(pi => pi.prisonerNumber)
      const prisonersLookup = await offenderSearchApi.getPrisoners(prisonerNumbers)

      res.render('pages/debug/reportDetails', { report, prisonersLookup, usersLookup })
    },
  }
}
