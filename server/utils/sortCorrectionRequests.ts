import type { CorrectionRequest } from '../data/incidentReportingApi'

// eslint-disable-next-line import/prefer-default-export
export function sortCorrectionRequests(correctionRequests: CorrectionRequest[]): CorrectionRequest[] {
  return correctionRequests.toSorted((request1, request2) => {
    if (request1.correctionRequestedAt > request2.correctionRequestedAt) {
      return -1
    }
    if (request1.correctionRequestedAt < request2.correctionRequestedAt) {
      return 1
    }
    return 0
  })
}
