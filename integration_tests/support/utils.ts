import type { Question } from '../../server/data/incidentReportingApi'

/**
 * Generates a question with responses.
 * Similar to `makeSimpleQuestion`, but dates are string as would be returned by IRS api.
 */
export function apiQuestionResponse(
  code: string,
  question: string,
  label: string,
  responseCode: string,
  response: string,
  responseLabel: string,
  responseDate: string | null = null,
  additionalInformation: string | null = null,
): DatesAsStrings<Question> {
  return {
    code,
    question,
    label,
    additionalInformation: null,
    responses: [
      {
        code: responseCode,
        response,
        label: responseLabel,
        responseDate,
        additionalInformation,
        recordedBy: 'user1',
        recordedAt: '2023-12-05T12:34:56',
      },
    ],
  }
}
