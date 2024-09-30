import { Router } from 'express'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import { OffenderSearchApi, type OffenderSearchResults } from '../../data/offenderSearchApi'
import formGetRoute from '../../routes/forms/get'
import { pagination, type LegacyPagination } from '../../utils/pagination'
import { type HeaderCell, type SortableTableColumns, sortableTableHead } from '../../utils/sortableTable'
import PrisonerSearchForm from '../../forms/prisonerSearchForm'

const tableColumns: SortableTableColumns<
  'photo' | 'lastName' | 'prisonerNumber' | 'cellLocation' | 'prisonName' | 'action'
> = [
  {
    column: 'photo',
    escapedHtml: '<span class="govuk-visually-hidden">Photo</span>',
    classes: 'app-prisoner-search__cell--photo',
    unsortable: true,
  },
  { column: 'lastName', escapedHtml: 'Name', classes: 'app-prisoner-search__cell--name' },
  {
    column: 'prisonerNumber',
    escapedHtml: 'Prison number',
    classes: 'app-prisoner-search__cell--prisoner-number',
    unsortable: true,
  },
  { column: 'cellLocation', escapedHtml: 'Location', classes: 'app-prisoner-search__cell--location' },
  {
    column: 'prisonName',
    escapedHtml: 'Establishment',
    classes: 'app-prisoner-search__cell--prison-name',
    unsortable: true,
  },
  {
    column: 'action',
    escapedHtml: '<span class="govuk-visually-hidden">Actions</span>',
    classes: 'app-prisoner-search__cell--actions',
    unsortable: true,
  },
]

export default function prisonerSearchRoutes(): Router {
  const router = Router({ mergeParams: true })

  const formId = 'search' as const
  formGetRoute(
    router,
    '/',
    {
      [formId]: () => new PrisonerSearchForm(),
    },
    asyncMiddleware(async (req, res) => {
      const { user } = res.locals

      const { incidentReportingApi, offenderSearchApi, prisonApi } = res.locals.apis
      const [activePrison, involvedPrisoners] = await Promise.all([
        prisonApi.getPrison(user.activeCaseLoadId),
        incidentReportingApi.prisonersInvolved.listForReport(req.params.id),
      ])
      // TODO: ensure that user.activeCaseLoadId was defined and activePrison is not null
      const { agencyId: prisonId, description: prisonName } = activePrison
      const involvedPrisonerNumbers = involvedPrisoners.map(prisoner => prisoner.prisonerNumber)

      const form: PrisonerSearchForm | null = res.locals.submittedForm

      let searchResults: OffenderSearchResults | undefined
      let tableHead: HeaderCell[] | undefined
      let paginationParams: LegacyPagination | undefined

      if (form && !form.hasErrors) {
        const page = form.fields.page.value
        const scope = form.fields.scope.value
        const searchTerms = form.fields.q.value
        const sort = form.fields.sort.value
        const order = form.fields.order.value

        let response: OffenderSearchResults
        const globalSearch = scope === 'global'
        if (globalSearch) {
          const filters: Parameters<OffenderSearchApi['searchGlobally']>[0] = {
            location: 'ALL',
            includeAliases: true,
          }
          if (/\d/.test(searchTerms)) {
            // DPS global search assumes the whole query is a prisoner identifier if it contains numbers
            filters.prisonerIdentifier = searchTerms.toUpperCase()
          } else {
            // DPS global search assumes that up to 2 words are entered, being the last and first name in that order
            const [lastName, firstName] = searchTerms.split(' ')
            filters.lastName = lastName
            if (firstName?.length) {
              filters.firstName = firstName
            }
          }
          response = await offenderSearchApi.searchGlobally(filters, page - 1)
        } else {
          response = await offenderSearchApi.searchInPrison(prisonId, searchTerms, page - 1, sort, order)
        }

        if (response.totalElements > 0) {
          const pageCount = Math.ceil(response.totalElements / OffenderSearchApi.PAGE_SIZE)
          const paginationUrlPrefixParams = Object.entries(
            globalSearch
              ? {
                  scope: 'global',
                  q: searchTerms,
                  formId,
                }
              : {
                  q: searchTerms,
                  formId,
                  sort,
                  order,
                },
          ).map(([param, value]) => {
            return `${param}=${encodeURIComponent(value)}`
          })
          const paginationUrlPrefix = `?${paginationUrlPrefixParams.join('&')}&`
          paginationParams = pagination(
            page,
            pageCount,
            paginationUrlPrefix,
            'moj',
            response.totalElements,
            OffenderSearchApi.PAGE_SIZE,
          )
          paginationParams.results.text = 'prisoners'

          // NB: there's no way to exclude results in offender search so have to hack it; it shouldn't be noticeable
          response.content = response.content.filter(result => {
            if (involvedPrisonerNumbers.includes(result.prisonerNumber)) {
              response.totalElements -= 1
              return false
            }
            return true
          })
        }

        searchResults = response

        const tableHeadUrlPrefixParams = Object.entries({
          q: searchTerms,
          formId,
          page,
        }).map(([param, value]) => {
          return `${param}=${encodeURIComponent(value)}`
        })
        const tableHeadUrlPrefix = `?${tableHeadUrlPrefixParams.join('&')}&`
        tableHead = sortableTableHead({
          columns: tableColumns.map(column => {
            return {
              ...column,
              unsortable: globalSearch ? true : column?.unsortable,
            }
          }),
          sortColumn: sort,
          order,
          urlPrefix: tableHeadUrlPrefix,
        })
      }

      const incidentId = req.params.id

      res.render('pages/addPrisoner/prisonerSearch.njk', {
        prisonName,
        formId,
        form,
        searchResults,
        tableHead,
        paginationParams,
        incidentId,
      })
    }),
  )

  return router
}
