import express from 'express'
import request from 'supertest'

import { AuditService } from '@ministryofjustice/hmpps-audit-client'

import auditPageView from './auditPageView'

jest.mock('@ministryofjustice/hmpps-audit-client')

let auditService: jest.Mocked<AuditService>

const renderedHtml = '<html lang="en">page</html>'

/**
 * Minimal app mirroring app.ts’ ordering: user first, then the audit middleware, then routes.
 *
 * `res.render` is stubbed *before* the audit middleware so that the middleware wraps the stub,
 * exactly as it wraps the real nunjucks renderer in the running app.
 */
function appWithAuditing({
  user = { username: 'user1' } as Express.User,
  renderFails = false,
}: { user?: Express.User | null; renderFails?: boolean } = {}): express.Express {
  const app = express()

  app.use((req, res, next) => {
    req.id = 'request123'
    res.locals.user = (user ?? undefined) as Express.User
    res.render = ((_view: string, options?: unknown, callback?: (err: Error, html: string) => void) => {
      const done = typeof options === 'function' ? options : callback
      const error = renderFails ? new Error('render failed') : null
      if (done) {
        done(error, renderedHtml)
      } else if (error) {
        next(error)
      } else {
        res.send(renderedHtml)
      }
    }) as typeof res.render
    next()
  })

  app.get('*any', auditPageView(auditService))

  app.get('/', (_req, res) => res.render('pages/index'))
  app.get('/prisoner/:prisonerNumber/photo.jpeg', (_req, res) => res.send('image'))
  app.get('/prisoner/:prisonerNumber/incident-summary', (_req, res) => res.render('pages/prisonerIncidentSummary'))
  app.get('/reports', (_req, res) => res.render('pages/dashboard'))
  app.get('/reports/:reportId', (_req, res) => res.render('pages/reports/view'))
  app.get('/reports/:reportId/prisoners/add/:prisonerNumber', (_req, res) => res.render('pages/reports/prisoners/add'))
  app.get('/reports/:reportId/prisoners/search', (_req, res) => res.render('pages/reports/prisoners/search'))
  app.get('/download-report-config/nomis/:type.json', (_req, res) => res.json({}))
  app.get('/inspect-session', (_req, res) => res.json({}))
  app.get('/broken', (_req, _res, next) => next(new Error('broken')))
  app.get('/forbidden', (_req, res) => res.status(403).render('pages/forbidden'))
  app.get('/rendered-for-email', (_req, res) => {
    res.render('emails/template', {}, (_err: Error, html: string) => res.send(`wrapped ${html}`))
  })

  app.use((_error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).render('pages/error')
  })

  return app
}

/** audit events logged, in the order the audit service saw them */
function loggedEvents() {
  return auditService.logAuditEvent.mock.calls.map(([event]) => ({
    subject: { subjectType: event.subjectType, subjectId: event.subjectId },
    what: event.what,
  }))
}

const forPrisoner = { subjectType: 'PRISONER_ID', subjectId: 'A1234BC' }
const reportId = '01234567-89ab-cdef-0123-456789abcdef'

beforeEach(() => {
  auditService = new AuditService(null as never) as jest.Mocked<AuditService>
  auditService.logAuditEvent.mockResolvedValue(undefined)
})

describe('auditPageView', () => {
  it('logs a page view and an access attempt when a page renders', async () => {
    await request(appWithAuditing()).get('/prisoner/A1234BC/incident-summary').expect(200).expect(renderedHtml)

    expect(loggedEvents()).toEqual([
      { subject: forPrisoner, what: 'PAGE_VIEW' },
      { subject: forPrisoner, what: 'PAGE_VIEW_ACCESS_ATTEMPT' },
    ])
  })

  it('passes the username, correlation id and page url to the audit service without throwing on failure', async () => {
    await request(appWithAuditing()).get('/prisoner/A1234BC/incident-summary').expect(200)

    expect(auditService.logAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        who: 'user1',
        correlationId: 'request123',
        details: { pageUrl: '/prisoner/A1234BC/incident-summary' },
      }),
      { throwOnError: false, logOnError: true },
    )
  })

  it('takes the prisoner from the path when adding a prisoner to a report', async () => {
    await request(appWithAuditing()).get(`/reports/${reportId}/prisoners/add/A1234BC`).expect(200)

    expect(loggedEvents()[0].subject).toEqual(forPrisoner)
  })

  it.each([
    ['a prisoner search', `/reports/${reportId}/prisoners/search?q=Smith`, 'Smith'],
    ['a dashboard search', '/reports?searchID=A1234BC', 'A1234BC'],
  ])('records the search term for %s', async (_name, url, searchTerm) => {
    await request(appWithAuditing()).get(url).expect(200)

    expect(loggedEvents()[0].subject).toEqual({ subjectType: 'SEARCH_TERM', subjectId: searchTerm })
  })

  it('truncates long search terms', async () => {
    await request(appWithAuditing())
      .get(`/reports?searchID=${'x'.repeat(100)}`)
      .expect(200)

    expect(loggedEvents()[0].subject.subjectId).toHaveLength(80)
  })

  it.each([
    ['the home page', '/'],
    ['a report', `/reports/${reportId}`],
    ['the dashboard with an empty search', '/reports?searchID='],
  ])('has no subject for %s', async (_name, url) => {
    await request(appWithAuditing()).get(url).expect(200)

    expect(loggedEvents()[0].subject).toEqual({ subjectType: 'NOT_APPLICABLE', subjectId: undefined })
  })

  it('logs only an attempt when a request does not render a page', async () => {
    await request(appWithAuditing()).get('/prisoner/A1234BC/missing').expect(404)

    expect(loggedEvents()).toEqual([{ subject: forPrisoner, what: 'PAGE_VIEW_ACCESS_ATTEMPT' }])
  })

  it('logs only an attempt for a forbidden page', async () => {
    await request(appWithAuditing()).get('/forbidden').expect(403)

    expect(loggedEvents().map(event => event.what)).toEqual(['PAGE_VIEW_ACCESS_ATTEMPT'])
  })

  it('logs only an attempt when the error page is shown', async () => {
    await request(appWithAuditing()).get('/broken').expect(500).expect(renderedHtml)

    expect(loggedEvents().map(event => event.what)).toEqual(['PAGE_VIEW_ACCESS_ATTEMPT'])
  })

  it('passes render errors to the error handler rather than swallowing them', async () => {
    await request(appWithAuditing({ renderFails: true }))
      .get('/prisoner/A1234BC/incident-summary')
      .expect(500)

    expect(loggedEvents().map(event => event.what)).toEqual(['PAGE_VIEW_ACCESS_ATTEMPT'])
  })

  it('leaves renders that pass their own callback alone', async () => {
    await request(appWithAuditing()).get('/rendered-for-email').expect(200).expect(`wrapped ${renderedHtml}`)

    expect(loggedEvents()).toEqual([
      { subject: { subjectType: 'NOT_APPLICABLE', subjectId: undefined }, what: 'PAGE_VIEW_ACCESS_ATTEMPT' },
    ])
  })

  it.each([
    ['a prisoner photo', '/prisoner/A1234BC/photo.jpeg'],
    ['a report configuration download', '/download-report-config/nomis/ASSAULT.json'],
    ['the session inspector', '/inspect-session'],
  ])('does not audit %s', async (_name, url) => {
    await request(appWithAuditing()).get(url)

    expect(auditService.logAuditEvent).not.toHaveBeenCalled()
  })

  it('does not audit when there is no signed-in user', async () => {
    await request(appWithAuditing({ user: null }))
      .get('/prisoner/A1234BC/incident-summary')
      .expect(200)

    expect(auditService.logAuditEvent).not.toHaveBeenCalled()
  })

  it('still serves the page when auditing fails', async () => {
    auditService.logAuditEvent.mockRejectedValue(new Error('SQS is down'))

    await request(appWithAuditing()).get('/prisoner/A1234BC/incident-summary').expect(200).expect(renderedHtml)
  })
})
