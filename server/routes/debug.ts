import type { RequestHandler } from 'express'
import { NotFound } from 'http-errors'

import format from '../utils/format'
import type { GovukErrorSummaryItem } from '../utils/govukFrontend'
import { pagination } from '../utils/pagination'
import { parseDateInput } from '../utils/utils'
import type { Services } from '../services'

interface ListFormData {
  prisonId?: string
  fromDate?: string
  toDate?: string
  page?: string
}

export default function makeDebugRoutes(services: Services): Record<string, RequestHandler> {
  const { userService } = services

  return {
    async incidentList(req, res) {
      const { incidentReportingApi, prisonApi } = res.locals.apis

      const { prisonId, fromDate: fromDateInput, toDate: toDateInput, page }: ListFormData = req.query
      const formValues: ListFormData = {
        prisonId,
        fromDate: fromDateInput,
        toDate: toDateInput,
        page,
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

      // Parse page number
      let pageNumber = (page && typeof page === 'string' && parseInt(page, 10)) || 1
      if (pageNumber < 1) {
        pageNumber = 1
      }

      // Get incidents from API
      const incidentsResponse = await incidentReportingApi.getEvents({
        prisonId,
        eventDateFrom: fromDate,
        eventDateUntil: toDate,
        page: pageNumber - 1,
        // sort: ['eventDateAndTime,ASC'],
      })

      const queryString = new URLSearchParams()
      if (prisonId) {
        queryString.append('prisonId', prisonId)
      }
      if (fromDateInput) {
        queryString.append('fromDate', fromDateInput)
      }
      if (toDateInput) {
        queryString.append('toDate', toDateInput)
      }

      const urlPrefix = `/incidents?${queryString}&`
      const paginationParams = pagination(
        pageNumber,
        incidentsResponse.totalPages,
        urlPrefix,
        'moj',
        incidentsResponse.totalElements,
        incidentsResponse.size,
      )
      const noFiltersSupplied = Boolean(!prisonId && !fromDate && !toDate)

      const incidents = incidentsResponse.content
      const usernames = incidents.map(incident => incident.modifiedBy)
      const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)
      const prisonsLookup = await prisonApi.getPrisons()
      const prisons = Object.values(prisonsLookup).map(prison => ({
        value: prison.agencyId,
        text: prison.description,
      }))

      res.render('pages/debug/incidentList', {
        incidents,
        prisons,
        usersLookup,
        formValues,
        errors,
        todayAsShortDate,
        noFiltersSupplied,
        paginationParams,
      })
    },

    async incidentDetails(req, res) {
      const { incidentReportingApi, prisonApi } = res.locals.apis

      const { id } = req.params
      if (!id) {
        throw new NotFound()
      }

      const event = await incidentReportingApi.getEventById(id)
      const usernames = event.reports.map(report => report.reportedBy)
      const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)
      const prisonsLookup = await prisonApi.getPrisons()

      res.render('pages/debug/incidentDetails', { event, usersLookup, prisonsLookup })
    },

    async reportDetails(req, res) {
      const { incidentReportingApi, prisonApi, offenderSearchApi } = res.locals.apis

      const { id } = req.params
      if (!id) {
        throw new NotFound()
      }

      const report = await incidentReportingApi.getReportWithDetailsById(id)
      const usersLookup = await userService.getUsers(res.locals.systemToken, [
        ...report.staffInvolved.map(staff => staff.staffUsername),
        report.reportedBy,
      ])
      const prisonerNumbers = report.prisonersInvolved.map(pi => pi.prisonerNumber)
      const prisonersLookup = await offenderSearchApi.getPrisoners(prisonerNumbers)
      const prisonsLookup = await prisonApi.getPrisons()

      res.render('pages/debug/reportDetails', { report, prisonersLookup, usersLookup, prisonsLookup })
    },
  }
}
