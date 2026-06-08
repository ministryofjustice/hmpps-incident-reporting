import type { RequestHandler } from 'express'

import logger from '../../logger'
import { getIncidentTypeConfiguration } from '../reportConfiguration/types'
import { reportHasDetails } from '../data/incidentReportingApiUtils'
import generateFields, { generateSteps } from '../data/incidentTypeConfiguration/formWizard'
import { QuestionProgress } from '../data/incidentTypeConfiguration/questionProgress'
import config from '../config'
import { missingLocalsError } from '../errors'

/**
 * Loads report configuration for a report in `res.locals.report`.
 * Must come after populateReport() middleware.
 */
export function populateReportConfiguration(generateQuestionSteps = true): RequestHandler {
  return async (_req, res, next): Promise<void> => {
    const { report } = res.locals
    if (!report) {
      next(missingLocalsError('populateReportConfiguration()', 'res.locals.report'))
      return
    }

    try {
      res.locals.reportConfig = await getIncidentTypeConfiguration(report.type)

      if (generateQuestionSteps) {
        if (res.locals.reportConfig.active || config.incidentTypesOverride.has(report.type)) {
          res.locals.questionSteps = generateSteps(res.locals.reportConfig)
          res.locals.questionFields = generateFields(res.locals.reportConfig)
        } else {
          // The type's config is inactive: its questions or response options have often been made
          // inactive, so steps cannot be generated properly. NB: this is the registry `active`
          // boolean, not date-based activation — a date-retired but still-active type keeps a
          // complete, editable config (see questions/index.ts and typeFields.ts).
          res.locals.questionSteps = generateSteps(res.locals.reportConfig, true)
          res.locals.questionFields = {} // ignore fields as they will not be used
        }
        if (reportHasDetails(report)) {
          res.locals.questionProgress = new QuestionProgress(res.locals.reportConfig, res.locals.questionSteps, report)
        }
      }

      next()
    } catch (error) {
      logger.error(error, `Failed to load configuration for report ${report.id} (${report.type})`)
      next(error)
    }
  }
}
