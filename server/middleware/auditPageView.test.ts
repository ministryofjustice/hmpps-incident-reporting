import type { Express, Request, Response } from 'express'
import request from 'supertest'

import { AuditService } from '@ministryofjustice/hmpps-audit-client'

import auditPageView from './auditPageView'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import { IncidentReportingApi, type Page, type ReportBasic } from '../data/incidentReportingApi'
import { OffenderSearchApi } from '../data/offenderSearchApi'
import { andrew } from '../data/testData/offenderSearch'
import { mockPecsRegions, resetPecsRegions } from '../data/testData/pecsRegions'
import { mockReportingOfficer, mockUnauthorisedUser } from '../data/testData/users'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../data/incidentReportingApi')
jest.mock('../data/offenderSearchApi')
jest.mock('../data/prisonApi')

const incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
const offenderSearchApi = OffenderSearchApi.prototype as jest.Mocked<OffenderSearchApi>

let auditService: jest.Mocked<AuditService>

function appWithAuditing(userSupplier: () => Express.User = () => mockReportingOfficer): Express {
  return appWithAllRoutes({ services: { auditService }, userSupplier })
}

/** audit events logged, in the order the audit service saw them */
function loggedEvents() {
  return auditService.logAuditEvent.mock.calls.map(([event]) => ({
    subject: { subjectType: event.subjectType, subjectId: event.subjectId },
    what: event.what,
  }))
}

/** the access attempt is logged for every audited request, whether or not the page rendered */
function attemptSubject() {
  return loggedEvents().find(event => event.what === 'PAGE_VIEW_ACCESS_ATTEMPT')?.subject
}

const noSubject = { subjectType: 'NOT_APPLICABLE', subjectId: undefined }
const forPrisoner = { subjectType: 'PRISONER_ID', subjectId: andrew.prisonerNumber }
const reportId = '01234567-89ab-cdef-0123-456789abcdef'

const emptyPage: Page<ReportBasic> = {
  content: [],
  number: 0,
  size: 0,
  numberOfElements: 0,
  totalElements: 0,
  totalPages: 0,
  sort: [],
}

beforeAll(() => {
  mockPecsRegions()
})

afterAll(() => {
  resetPecsRegions()
})

beforeEach(() => {
  auditService = new AuditService(null as never) as jest.Mocked<AuditService>
  auditService.logAuditEvent.mockResolvedValue(undefined)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('auditPageView', () => {
  it('logs a page view and an access attempt when a page renders', async () => {
    offenderSearchApi.getPrisoner.mockResolvedValue(andrew)
    incidentReportingApi.getReports.mockResolvedValue(emptyPage)

    await request(appWithAuditing()).get(`/prisoner/${andrew.prisonerNumber}/incident-summary`).expect(200)

    expect(loggedEvents()).toEqual([
      { subject: forPrisoner, what: 'PAGE_VIEW' },
      { subject: forPrisoner, what: 'PAGE_VIEW_ACCESS_ATTEMPT' },
    ])
  })

  it('passes the username, correlation id and page url to the audit service without throwing on failure', async () => {
    await request(appWithAuditing()).get('/').expect(200)

    expect(auditService.logAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        who: mockReportingOfficer.username,
        correlationId: expect.any(String),
        details: { pageUrl: '/' },
      }),
      { throwOnError: false, logOnError: true },
    )
  })

  it('takes the prisoner from the path when adding a prisoner to a report', async () => {
    await request(appWithAuditing()).get(`/reports/${reportId}/prisoners/add/${andrew.prisonerNumber}`)

    expect(attemptSubject()).toEqual(forPrisoner)
  })

  it.each([
    ['a prisoner search', `/reports/${reportId}/prisoners/search?q=Smith`, 'Smith'],
    ['a dashboard search', '/reports?searchID=A1234BC', 'A1234BC'],
  ])('records the search term for %s', async (_name, url, searchTerm) => {
    await request(appWithAuditing()).get(url)

    expect(attemptSubject()).toEqual({ subjectType: 'SEARCH_TERM', subjectId: searchTerm })
  })

  it('truncates long search terms', async () => {
    await request(appWithAuditing()).get(`/reports?searchID=${'x'.repeat(100)}`)

    expect(attemptSubject()?.subjectId).toHaveLength(80)
  })

  it.each([
    ['the home page', '/'],
    ['a report', `/reports/${reportId}`],
    ['the dashboard with an empty search', '/reports?searchID='],
  ])('has no subject for %s', async (_name, url) => {
    await request(appWithAuditing()).get(url)

    expect(attemptSubject()).toEqual(noSubject)
  })

  it('logs only an attempt when the page is not found', async () => {
    await request(appWithAuditing()).get(`/prisoner/${andrew.prisonerNumber}/missing`).expect(404)

    expect(loggedEvents()).toEqual([{ subject: forPrisoner, what: 'PAGE_VIEW_ACCESS_ATTEMPT' }])
  })

  it('logs only an attempt when the user is refused and signed out', async () => {
    await request(appWithAuditing(() => mockUnauthorisedUser))
      .get('/')
      .expect(302)
      .expect('Location', '/sign-out')

    expect(loggedEvents()).toEqual([{ subject: noSubject, what: 'PAGE_VIEW_ACCESS_ATTEMPT' }])
  })

  it('logs only an attempt when the error page is shown', async () => {
    incidentReportingApi.getReportWithDetailsById.mockRejectedValue(new Error('API is down'))

    await request(appWithAuditing()).get(`/reports/${reportId}`).expect(500)

    expect(loggedEvents()).toEqual([{ subject: noSubject, what: 'PAGE_VIEW_ACCESS_ATTEMPT' }])
  })

  it('passes render errors to the error handler rather than swallowing them', async () => {
    const app = appWithAuditing()
    // fail the home page template only; the error page then renders as normal
    jest
      .spyOn(app, 'render')
      .mockImplementationOnce(((_view: string, _options: object, callback: (err: Error) => void) =>
        callback(new Error('render failed'))) as typeof app.render)

    await request(app).get('/').expect(500)

    expect(loggedEvents()).toEqual([{ subject: noSubject, what: 'PAGE_VIEW_ACCESS_ATTEMPT' }])
  })

  it.each([
    ['a prisoner photo', `/prisoner/${andrew.prisonerNumber}/photo.jpeg`],
    ['a report configuration download', '/download-report-config/nomis/incident-types.json'],
    ['the session inspector', '/inspect-session'],
  ])('does not audit %s', async (_name, url) => {
    await request(appWithAuditing()).get(url)

    expect(auditService.logAuditEvent).not.toHaveBeenCalled()
  })

  it('does not audit when there is no signed-in user', async () => {
    await request(appWithAuditing(() => undefined as unknown as Express.User)).get('/')

    expect(auditService.logAuditEvent).not.toHaveBeenCalled()
  })

  it('still serves the page when auditing fails', async () => {
    auditService.logAuditEvent.mockRejectedValue(new Error('SQS is down'))

    await request(appWithAuditing()).get('/').expect(200)
  })

  // no page in the service renders this way, so this calls the middleware directly
  it('leaves renders that pass their own callback alone', () => {
    const render = jest.fn()
    const req = { originalUrl: '/', query: {} } as Request
    const res = {
      locals: { user: { username: 'user1' } },
      render,
      prependOnceListener: jest.fn(),
    } as unknown as Response
    auditPageView(auditService)(req, res, jest.fn())

    const callback = jest.fn()
    res.render('emails/template', {}, callback)

    expect(render).toHaveBeenCalledWith('emails/template', {}, callback)
    expect(auditService.logAuditEvent).not.toHaveBeenCalled()
  })
})
