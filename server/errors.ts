import { InternalServerError } from 'http-errors'

const middlewareMapping = {
  'res.locals.permissions': 'Permissions.middleware()',
  'res.locals.prisoner': 'populatePrisoner()',
  'res.locals.report': 'populateReport()',
  'res.locals.report (with details)': 'populateReport(withDetails=true)',
  'res.locals.reportUrl': 'populateReport()',
  'res.locals.reportSubUrlPrefix': 'populateReport()',
  'res.locals.allowedActions': 'populateReport()',
  'res.locals.possibleTransitions': 'populateReport()',
  'res.locals.reportConfig': 'populateReportConfiguration()',
  'res.locals.questionSteps': 'populateReportConfiguration(generateQuestionSteps=true)',
  'res.locals.questionFields': 'populateReportConfiguration(generateQuestionSteps=true)',
  'res.locals.questionProgress': 'populateReportConfiguration()',
}

type MissingLocal = keyof typeof middlewareMapping

export function missingLocalsError(
  currentLocation: string,
  missingLocal: MissingLocal,
): ReturnType<typeof InternalServerError> {
  const middlewareNotExecuted = middlewareMapping[missingLocal]
  return new InternalServerError(
    `Middleware configuration error: ${currentLocation} requires ${missingLocal}: ${middlewareNotExecuted} was not executed first`,
  )
}
