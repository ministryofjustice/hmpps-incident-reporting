import type { RequestHandler } from 'express'
import { NotFound } from 'http-errors'

import format from '../utils/format'
import type { GovukErrorSummaryItem } from '../utils/govukFrontend'
import { pagination } from '../utils/pagination'
import { parseDateInput } from '../utils/utils'
import type { Services } from '../services'
import { type HeaderCell, type SortableTableColumns, sortableTableHead } from '../utils/sortableTable'
import { type Type, types, type Status, statuses } from '../reportConfiguration/constants'
import { type Order } from '../data/offenderSearchApi'

interface ListFormData {
  prisonId?: string
  fromDate?: string
  toDate?: string
  incidentType?: Type
  reportingOfficer?: string
  incidentStatuses?: Status
  sort?: string
  order?: Order
  page?: string
}

export default function makeDebugRoutes(services: Services): Record<string, RequestHandler> {
  const { userService } = services

  return {
    async eventList(req, res) {
      const { incidentReportingApi, prisonApi } = res.locals.apis

      const {
        prisonId,
        fromDate: fromDateInput,
        toDate: toDateInput,
        incidentType,
        reportingOfficer,
        page,
        incidentStatuses,
      }: ListFormData = req.query
      let { sort, order }: ListFormData = req.query

      if (!sort) {
        sort = 'incidentDateAndTime'
      }
      if (!order) {
        order = 'DESC'
      }

      const formValues: ListFormData = {
        prisonId,
        fromDate: fromDateInput,
        toDate: toDateInput,
        incidentType: incidentType as Type,
        reportingOfficer,
        incidentStatuses: incidentStatuses as Status,
        sort,
        order: order as Order,
        page,
      }

      const tableColumns: SortableTableColumns<
        'reportReference' | 'type' | 'incidentDateAndTime' | 'description' | 'status' | 'reportedBy'
      > = [
        { column: 'reportReference', escapedHtml: 'Incident ref', classes: 'app-prisoner-search__cell--incident-ref' },
        {
          column: 'type',
          escapedHtml: 'Incident type',
          classes: 'app-prisoner-search__cell--incident-type',
        },
        {
          column: 'incidentDateAndTime',
          escapedHtml: 'Incident date',
          classes: 'app-prisoner-search__cell--incident-time',
        },
        {
          column: 'description',
          escapedHtml: 'Description',
          classes: 'app-prisoner-search__cell--description',
          unsortable: true,
        },
        {
          column: 'status',
          escapedHtml: 'Status',
          classes: 'app-prisoner-search__cell--status',
        },
        {
          column: 'reportedBy',
          escapedHtml: 'Reported By',
          classes: 'app-prisoner-search__cell--reported-by',
        },
      ]

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

      const orderString = order as string
      // Get reports from API
      const reportsResponse = await incidentReportingApi.getReports({
        prisonId,
        incidentDateFrom: fromDate,
        incidentDateUntil: toDate,
        type: incidentType,
        status: incidentStatuses,
        page: pageNumber - 1,
        size: 5,
        sort: [`${sort},${orderString}`],
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
      if (incidentType) {
        queryString.append('incidentType', incidentType)
      }
      if (incidentStatuses) {
        queryString.append('incidentStatuses', incidentStatuses)
      }
      const tableHeadUrlPrefix = `/incidents?${queryString}&`
      if (sort) {
        queryString.append('sort', sort)
      }
      if (order) {
        queryString.append('order', order)
      }

      const urlPrefix = `/incidents?${queryString}&`

      const noFiltersSupplied = Boolean(!prisonId && !fromDate && !toDate && !incidentType && !incidentStatuses)

      const reports = reportsResponse.content
      const usernames = reports.map(report => report.reportedBy)
      const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)
      const prisonsLookup = await prisonApi.getPrisons()
      const reportingOfficers = Object.values(usersLookup).map(user => ({
        value: user.username,
        text: user.name,
      }))
      const prisons = Object.values(prisonsLookup).map(prison => ({
        value: prison.agencyId,
        text: prison.description,
      }))
      const incidentTypes = Object.values(types).map(incType => ({
        value: incType.code,
        text: incType.description,
      }))
      const statusItems = Object.values(statuses).map(status => ({
        value: status.code,
        text: status.description,
      }))

      let typesLookup = {}
      for (const entry of Object.values(types).map(type => ({ [type.code]: type.description }))) {
        typesLookup = { ...typesLookup, ...entry }
      }
      let statusLookup = {}
      for (const entry of Object.values(statuses).map(status => ({ [status.code]: status.description }))) {
        statusLookup = { ...statusLookup, ...entry }
      }

      const tableHead: HeaderCell[] | undefined = sortableTableHead({
        columns: tableColumns.map(column => {
          return {
            ...column,
          }
        }),
        sortColumn: sort,
        order,
        urlPrefix: tableHeadUrlPrefix,
      })
      const paginationParams = pagination(
        pageNumber,
        reportsResponse.totalPages,
        urlPrefix,
        'moj',
        reportsResponse.totalElements,
        reportsResponse.size,
      )

      res.render('pages/debug/eventList', {
        reports,
        prisons,
        usersLookup,
        reportingOfficers,
        incidentTypes,
        statusItems,
        typesLookup,
        statusLookup,
        formValues,
        errors,
        todayAsShortDate,
        noFiltersSupplied,
        tableHead,
        paginationParams,
      })
    },

    async eventDetails(req, res) {
      const { incidentReportingApi, prisonApi } = res.locals.apis

      const { id } = req.params
      if (!id) {
        throw new NotFound()
      }

      const event = await incidentReportingApi.getEventById(id)
      const usernames = event.reports.map(report => report.reportedBy)
      const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)
      const prisonsLookup = await prisonApi.getPrisons()

      res.render('pages/debug/eventDetails', { event, usersLookup, prisonsLookup })
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
