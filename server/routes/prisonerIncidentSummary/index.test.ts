import type { Express } from 'express'
import request from 'supertest'

import { appWithAllRoutes } from '../testutils/appSetup'
import {
  IncidentReportingApi,
  type Page,
  type ReportBasic,
  type ReportWithDetails,
} from '../../data/incidentReportingApi'
import { OffenderSearchApi } from '../../data/offenderSearchApi'
import { PrisonApi } from '../../data/prisonApi'
import { convertReportDates } from '../../data/incidentReportingApiUtils'
import { mockReport } from '../../data/testData/incidentReporting'
import type { Type } from '../../reportConfiguration/constants'
import { andrew, ernie } from '../../data/testData/offenderSearch'

jest.mock('../../data/incidentReportingApi')
jest.mock('../../data/offenderSearchApi')
jest.mock('../../data/prisonApi')

const incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
const offenderSearchApi = OffenderSearchApi.prototype as jest.Mocked<OffenderSearchApi>
const prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>

function basicReport(id: string, type: Type): ReportBasic {
  return { id, type } as ReportBasic
}

function page(content: ReportBasic[]): Page<ReportBasic> {
  return {
    content,
    number: 0,
    size: content.length,
    numberOfElements: content.length,
    totalElements: content.length,
    totalPages: 1,
    sort: [],
  }
}

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /prisoner/:prisonerNumber/incident-summary', () => {
  it('renders the summary for a prisoner in the user’s caseload', () => {
    offenderSearchApi.getPrisoner.mockResolvedValue(andrew) // MDI, in the reporting officer’s caseload
    incidentReportingApi.getReports.mockResolvedValue(page([basicReport('1', 'FIRE_1'), basicReport('2', 'FIRE_1')]))

    return request(app)
      .get(`/prisoner/${andrew.prisonerNumber}/incident-summary`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Incident summary')
        expect(res.text).toContain('Fire')
        expect(res.text).toContain('view-all-incidents')
        expect(res.text).toContain(`/prisoner/${andrew.prisonerNumber}/incident-summary/incidents`)
        expect(incidentReportingApi.getReports).toHaveBeenCalled()
      })
  })

  it('renders a breadcrumb linking back to the prisoner’s DPS profile', () => {
    offenderSearchApi.getPrisoner.mockResolvedValue(andrew)
    incidentReportingApi.getReports.mockResolvedValue(page([]))

    return request(app)
      .get(`/prisoner/${andrew.prisonerNumber}/incident-summary`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('govuk-breadcrumbs')
        expect(res.text).toContain('Arnold, Andrew')
        expect(res.text).toContain(`/prisoner/${andrew.prisonerNumber}`)
      })
  })

  it('renders an empty state when there are no incidents', () => {
    offenderSearchApi.getPrisoner.mockResolvedValue(andrew)
    incidentReportingApi.getReports.mockResolvedValue(page([]))

    return request(app)
      .get(`/prisoner/${andrew.prisonerNumber}/incident-summary`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('been involved in any recorded incident')
      })
  })

  it('returns 404 when the prisoner is not in the user’s caseload', () => {
    offenderSearchApi.getPrisoner.mockResolvedValue(ernie) // outside, not in caseload

    return request(app)
      .get(`/prisoner/${ernie.prisonerNumber}/incident-summary`)
      .expect(404)
      .expect(() => {
        expect(incidentReportingApi.getReports).not.toHaveBeenCalled()
      })
  })
})

describe('GET /prisoner/:prisonerNumber/incident-summary/incidents', () => {
  function reportWithDetails(reportReference: string, type: Type): ReportWithDetails {
    const report = convertReportDates(
      mockReport({
        reportReference,
        type,
        status: 'AWAITING_REVIEW',
        reportDateAndTime: new Date('2025-06-01T10:15:00Z'),
        withDetails: true,
      }),
    )
    report.prisonersInvolved = [
      {
        prisonerNumber: andrew.prisonerNumber,
        firstName: 'ANDREW',
        lastName: 'ARNOLD',
        prisonerRole: 'PERPETRATOR',
        outcome: null,
        comment: null,
      },
    ]
    report.questions = []
    return report
  }

  it('renders the incident list with a breadcrumb back to the summary', () => {
    offenderSearchApi.getPrisoner.mockResolvedValue(andrew)
    incidentReportingApi.getReports.mockResolvedValue(page([basicReport('1', 'FIRE_1')]))
    incidentReportingApi.getReportWithDetailsById.mockResolvedValue(reportWithDetails('6001', 'FIRE_1'))
    prisonApi.getAgency.mockResolvedValue({ agencyId: 'MDI', description: 'Moorland (HMP)' } as never)

    return request(app)
      .get(`/prisoner/${andrew.prisonerNumber}/incident-summary/incidents`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('govuk-breadcrumbs')
        expect(res.text).toContain('Incident summary')
        expect(res.text).toContain(`/prisoner/${andrew.prisonerNumber}/incident-summary`)
        expect(res.text).toContain('6001') // report reference
        expect(res.text).toContain('Perpetrator')
        expect(res.text).toContain('Moorland (HMP)')
      })
  })

  it('returns 404 when the prisoner is not in the user’s caseload', () => {
    offenderSearchApi.getPrisoner.mockResolvedValue(ernie)

    return request(app)
      .get(`/prisoner/${ernie.prisonerNumber}/incident-summary/incidents`)
      .expect(404)
      .expect(() => {
        expect(incidentReportingApi.getReports).not.toHaveBeenCalled()
      })
  })
})
