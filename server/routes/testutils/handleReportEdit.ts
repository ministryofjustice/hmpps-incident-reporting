import { mockThrownError } from '../../data/testData/thrownErrors'
import { mockErrorResponse } from '../../data/testData/incidentReporting'
import * as handleReportEditModule from '../reports/actions/handleReportEdit'

const { handleReportEdit } = handleReportEditModule as jest.Mocked<typeof import('../reports/actions/handleReportEdit')>

export const mockHandleReportEdit = {
  withoutSideEffect(): void {
    handleReportEdit.mockResolvedValueOnce()
  },

  failure(): void {
    handleReportEdit.mockReset()

    const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
    handleReportEdit.mockRejectedValueOnce(error)
  },

  expectCalled(): void {
    expect(handleReportEdit).toHaveBeenCalledWith(
      // looks request-like
      expect.objectContaining({
        req: expect.anything(),
        locals: expect.anything(),
      }),
    )
  },

  expectNotCalled(): void {
    expect(handleReportEdit).not.toHaveBeenCalled()
  },
}
