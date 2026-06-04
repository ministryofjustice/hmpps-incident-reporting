import type { RequestHandler } from 'express'
import { NotImplemented } from 'http-errors'

import logger from '../../logger'
import type { Status } from '../reportConfiguration/constants'
import { missingLocalsError } from '../errors'

export function redirectIfStatusNot(...statuses: Status[]): RequestHandler {
  if (!statuses.length) {
    throw new NotImplemented('redirectIfStatusNot() requires at least one status')
  }

  return (_req, res, next): void => {
    const { report, reportUrl } = res.locals

    if (!report) {
      next(missingLocalsError('redirectIfStatusNot()', 'res.locals.report'))
      return
    }
    if (!reportUrl) {
      next(missingLocalsError('redirectIfStatusNot()', 'res.locals.reportUrl'))
      return
    }

    if (statuses.includes(report.status)) {
      logger.info('Report %s status is %s but route requires %j', report.id, report.status, statuses)
      next()
    } else {
      res.redirect(reportUrl)
    }
  }
}
