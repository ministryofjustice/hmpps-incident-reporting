import type { AuditService, SubjectType } from '@ministryofjustice/hmpps-audit-client'
import type { Request, RequestHandler } from 'express'

import logger from '../../logger'

/**
 * Requests that are not page views: the prisoner photo asset, report configuration downloads and the
 * non-production session inspector. Health checks and static resources are mounted earlier in app.ts
 * so never reach here.
 */
const notPageViews = [
  /^\/prisoner\/[^/]+\/photo\.jpeg(?:\?.*)?$/,
  /^\/download-report-config\//,
  /^\/inspect-session(?:[/?].*)?$/,
]

/** Prisoner numbers appear in the path of prisoner pages and when adding a prisoner to a report */
const prisonerNumberInPath = /\/(?:prisoner|prisoners\/add)\/([A-Z][0-9]{4}[A-Z]{2})\b/

/** Query parameters holding something a user searched for: prisoner and staff searches, and the dashboard search */
const searchParameters = ['q', 'searchID']

/** HMPPS Audit rejects subject ids longer than this */
const maxSubjectIdLength = 80

type Subject = { subjectType: SubjectType; subjectId?: string }

type RenderCallback = (err: Error, html: string) => void
type ResRender = (view: string, options?: object | RenderCallback, callback?: RenderCallback) => void

/**
 * Audits page views to HMPPS Audit.
 *
 * Emits PAGE_VIEW_ACCESS_ATTEMPT once the response closes – covering redirects, errors and
 * requests refused downstream by the authorisation middleware – and PAGE_VIEW when a page
 * renders successfully.
 *
 * Mount after authentication but before authorisation, so that refused requests are still
 * recorded as attempts.
 */
export default function auditPageView(auditService: AuditService): RequestHandler {
  return (req, res, next) => {
    const who = res.locals.user?.username
    if (!who || notPageViews.some(pattern => pattern.test(req.originalUrl))) {
      next()
      return
    }

    res.locals.auditEvent = {
      who,
      correlationId: req.id,
      details: { pageUrl: req.originalUrl },
      ...subjectOfRequest(req),
    }

    res.prependOnceListener('close', () => {
      logPageView(auditService, res.locals.auditEvent, true)
    })

    const resRender = res.render.bind(res) as ResRender
    res.render = ((view: string, options?: object | RenderCallback, callback?: RenderCallback) => {
      if (typeof options === 'function' || callback) {
        // the caller handles the rendered html itself, so this is not a page being sent to the user
        resRender(view, options, callback)
        return
      }
      resRender(view, options, (err: Error, html: string) => {
        if (err) {
          next(err)
          return
        }
        // send the page first: auditing must never delay or break rendering
        res.send(html)
        // error and forbidden pages are rendered too, but are not successful views
        if (res.statusCode < 400) {
          logPageView(auditService, res.locals.auditEvent)
        }
      })
    }) as typeof res.render

    next()
  }
}

function subjectOfRequest(req: Request): Subject {
  const prisonerNumber = req.originalUrl.match(prisonerNumberInPath)?.[1]
  if (prisonerNumber) {
    return { subjectType: 'PRISONER_ID', subjectId: prisonerNumber }
  }
  const searchTerm = searchParameters
    .map(parameter => req.query?.[parameter])
    .find((value): value is string => typeof value === 'string' && value.trim() !== '')
  if (searchTerm) {
    return { subjectType: 'SEARCH_TERM', subjectId: searchTerm.trim().substring(0, maxSubjectIdLength) }
  }
  return { subjectType: 'NOT_APPLICABLE' }
}

function logPageView(auditService: AuditService, auditEvent: Express.Locals['auditEvent'], isAttempt = false): void {
  if (!auditEvent) return
  // auditing must not be able to break page rendering, so never throw
  auditService
    .logAuditEvent(
      { ...auditEvent, what: isAttempt ? 'PAGE_VIEW_ACCESS_ATTEMPT' : 'PAGE_VIEW' },
      { throwOnError: false, logOnError: true },
    )
    .catch(error => {
      logger.error(error, 'Failed to audit page view')
    })
}
