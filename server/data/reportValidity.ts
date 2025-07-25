import type { GovukErrorSummaryItem } from '../utils/govukFrontend'
import type { ReportWithDetails } from './incidentReportingApi'
import type { IncidentTypeConfiguration } from './incidentTypeConfiguration/types'
import type { QuestionProgressStep } from './incidentTypeConfiguration/questionProgress'

/**
 * Is this report ready to be submitted for review?
 *
 * Generates error messages for incomplete reports:
 * - not all questions are complete
 * - prisoner involvements skipped initially
 * - prisoner involvements not added but incident type requires some
 * - staff involvements skipped initially
 * - staff involvements not added but incident type requires some
 *
 * TODO: adapt for PECS reports
 */
// eslint-disable-next-line import/prefer-default-export
export function* validateReport(
  report: ReportWithDetails,
  reportConfig: IncidentTypeConfiguration,
  questionProgressSteps: QuestionProgressStep[],
  reportUrl: string,
): Generator<GovukErrorSummaryItem, void, void> {
  // TODO: involvement rules differ for PECS
  if (!report.prisonerInvolvementDone) {
    // prisoners skipped, so must return
    yield {
      text: 'Please complete the prisoner involvement section',
      href: `${reportUrl}/prisoners`,
    }
  } else if (report.prisonersInvolved.length === 0 && reportConfig.requiresPrisoners) {
    // prisoner required
    yield {
      text: 'You need to add a prisoner',
      href: `${reportUrl}/prisoners`,
    }
  }

  // TODO: involvement rules differ for PECS
  if (!report.staffInvolvementDone) {
    // staff skipped, so must return
    yield {
      text: 'Please complete the staff involvement section',
      href: `${reportUrl}/staff`,
    }
  } else if (report.staffInvolved.length === 0 && reportConfig.requiresStaff) {
    // staff required
    yield {
      text: 'You need to add a member of staff',
      href: `${reportUrl}/staff`,
    }
  }

  const lastQuestion = questionProgressSteps.at(-1)
  if (!lastQuestion.isComplete) {
    // last question is incomplete
    yield {
      text: `You must answer question ${lastQuestion.questionNumber}`,
      href: `${reportUrl}/questions${lastQuestion.urlSuffix}`,
    }
  }
}
