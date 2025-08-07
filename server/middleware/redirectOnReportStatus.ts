import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { NotImplemented } from 'http-errors'

import logger from '../../logger'
import type { Status } from '../reportConfiguration/constants'

export function redirectIfStatusNot(...statuses: Status[]): RequestHandler {
  if (!statuses.length) {
    throw new NotImplemented('redirectIfStatusNot() requires at least one status')
  }

  return (_req: Request, res: Response, next: NextFunction): void => {
    const { report } = res.locals
    if (!report) {
      // expect to always be used after populateReport() middleware
      next(new NotImplemented('redirectIfStatusNot() requires res.locals.report'))
      return
    }

    if (statuses.includes(report.status)) {
      logger.info('Report %s status is %s but route requires %j', report.id, report.status, statuses)
      next()
    } else {
      res.redirect(res.locals.reportUrl)
    }
  }
}
