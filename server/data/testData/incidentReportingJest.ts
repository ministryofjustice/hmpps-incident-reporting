import { now } from '../../testutils/fakeClock'
import type { Question, Response } from '../incidentReportingApi'

/*
this function cannot go into server/data/testData/incidentReporting.ts because cypress tests import that module
but typescript thinks that jest types are needed
*/

// eslint-disable-next-line import/prefer-default-export
export function makeSimpleQuestion(code: string, question: string, ...responses: [string, string][]): Question {
  return {
    code,
    question,
    label: question,
    additionalInformation: null,
    responses: responses.map(([responseResponse, responseCode]) => {
      const response: Response = {
        response: responseResponse,
        code: responseCode,
        responseDate: null,
        additionalInformation: null,
        recordedBy: 'USER1',
        recordedAt: now,
      }
      return response
    }),
  }
}
