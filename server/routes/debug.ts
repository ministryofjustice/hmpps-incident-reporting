import type { RequestHandler } from 'express'
import { NotFound } from 'http-errors'

import type {
  EventWithBasicReports,
  PrisonerInvolvement,
  ReportBasic,
  StaffInvolvement,
} from '../data/incidentReportingApi'
import format from '../utils/format'
import { pagination } from '../utils/pagination'
import { type ErrorSummaryItem, parseDateInput } from '../utils/utils'
import type { Services } from '../services'

interface ListFormData {
  page?: string
  fromDate?: string
  toDate?: string
}

export default function makeDebugRoutes(services: Services): Record<string, RequestHandler> {
  return {
    async incidentList(req, res) {
      const { userService } = services
      const { incidentReportingApi } = res.locals.apis

      const { page, fromDate: fromDateInput, toDate: toDateInput }: ListFormData = req.query
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
      const usernames = incidents.map((incident: EventWithBasicReports) => incident.modifiedBy)
      const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)

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
      const { userService } = services
      const { incidentReportingApi, prisonApi } = res.locals.apis

      const { id } = req.params
      if (!id) {
        throw new NotFound()
      }

      const event = await incidentReportingApi.getEventById(id)
      const usernames = event.reports.map((report: ReportBasic) => report.reportedBy)
      const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)
      const prisonsLookup = await prisonApi.getPrisons()

      res.render('pages/debug/incidentDetails', { event, usersLookup, prisonsLookup })
    },

    async reportDetails(req, res) {
      const { userService } = services
      const { incidentReportingApi, prisonApi, offenderSearchApi } = res.locals.apis

      const { id } = req.params
      if (!id) {
        throw new NotFound()
      }

      const report = await incidentReportingApi.getReportWithDetailsById(id)
      const usersLookup = await userService.getUsers(res.locals.systemToken, [
        ...report.staffInvolved.map((staff: StaffInvolvement) => staff.staffUsername),
        report.reportedBy,
      ])
      const prisonerNumbers = report.prisonersInvolved.map((pi: PrisonerInvolvement) => pi.prisonerNumber)
      const prisonersLookup = await offenderSearchApi.getPrisoners(prisonerNumbers)
      const prisonsLookup = await prisonApi.getPrisons()

      res.render('pages/debug/reportDetails', { report, prisonersLookup, usersLookup, prisonsLookup })
    },
  }
}
