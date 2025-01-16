import type { NextFunction, Request, Response } from 'express'
import { NotImplemented } from 'http-errors'

import logger from '../../logger'
import { getIncidentTypeConfiguration } from '../reportConfiguration/types'
import { generateFields, generateSteps } from '../data/incidentTypeConfiguration/formWizard'

/**
 * Loads report configuration for a report in `res.locals.report`
 */
// eslint-disable-next-line import/prefer-default-export
export function populateReportConfiguration(generateQuestionSteps = true) {
  return async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { report } = res.locals
    if (!report) {
      // expect to always be used after populateReport() middleware
      next(new NotImplemented('populateReportConfiguration() requires req.locals.report'))
      return
    }

    try {
      res.locals.reportConfig = await getIncidentTypeConfiguration(report.type)

      if (generateQuestionSteps) {
        res.locals.questionSteps = generateSteps(res.locals.reportConfig)
        res.locals.questionFields = generateFields(res.locals.reportConfig)
      }

      next()
    } catch (error) {
      logger.error(error, `Failed to load configuration for report ${res.locals.report.id} (${res.locals.report.type})`)
      next(error)
    }
  }
}
