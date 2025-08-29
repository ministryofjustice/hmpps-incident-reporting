import type { GovukErrorSummaryItem } from '../utils/govukFrontend'
import type { ReportWithDetails } from './incidentReportingApi'
import type { IncidentTypeConfiguration } from './incidentTypeConfiguration/types'
import type { QuestionProgressStep } from './incidentTypeConfiguration/questionProgress'
import { isPecsRegionCode } from './pecsRegions'

/**
 * Is this report ready to be submitted for review?
 *
 * Generates error messages for incomplete reports:
 * - not all questions are complete
 * - prisoner involvements skipped initially
 * - prisoner involvements not added but incident type requires some (unless location is a PECS region)
 * - staff involvements skipped initially
 * - staff involvements not added but incident type requires some (unless location is a PECS region)
 */
export function* validateReport(
  report: ReportWithDetails,
  reportConfig: IncidentTypeConfiguration,
  questionProgressSteps: QuestionProgressStep[],
  reportUrl: string,
): Generator<GovukErrorSummaryItem, void, void> {
  const isPecsReport = isPecsRegionCode(report.location)

  if (!report.prisonerInvolvementDone) {
    // prisoners skipped, so must return
    yield {
      text: 'Please complete the prisoner involvement section',
      href: `${reportUrl}/prisoners`,
    }
  } else if (!isPecsReport && report.prisonersInvolved.length === 0 && reportConfig.requiresPrisoners) {
    // prisoner required
    yield {
      text: 'You need to add a prisoner',
      href: `${reportUrl}/prisoners`,
    }
  }

  if (!report.staffInvolvementDone) {
    // staff skipped, so must return
    yield {
      text: 'Please complete the staff involvement section',
      href: `${reportUrl}/staff`,
    }
  } else if (!isPecsReport && report.staffInvolved.length === 0 && reportConfig.requiresStaff) {
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
