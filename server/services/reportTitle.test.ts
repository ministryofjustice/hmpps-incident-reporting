import { setImmediate } from 'node:timers/promises'

import type express from 'express'

import { convertReportDates } from '../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../data/testData/incidentReporting'
import { andrew } from '../data/testData/offenderSearch'
import { moorland } from '../data/testData/prisonApi'
import { mockThrownError } from '../data/testData/thrownErrors'
import { fallibleUpdateReportTitle, newReportTitle, regenerateTitleForReport, updateReportTitle } from './reportTitle'

describe('Report titles', () => {
  describe('Generation', () => {
    it('should make a title for a new report from an incident type and location description', () => {
      let title = newReportTitle('FIND_6', 'Moorland (HMP & YOI)')
      expect(title).toEqual('Find of illicit items (Moorland (HMP & YOI))')

      title = newReportTitle('MISCELLANEOUS_1', 'Leeds (HMP)')
      expect(title).toEqual('Miscellaneous (Leeds (HMP))')

      title = newReportTitle('ATTEMPTED_ESCAPE_FROM_PRISON_1', 'PECS South')
      expect(title).toEqual('Attempted escape from establishment (PECS South)')
    })

    it('should make a title from an existing report without prisoner involvements', () => {
      const report = convertReportDates(
        mockReport({
          type: 'FIND_6',
          reportReference: '6544',
          reportDateAndTime: new Date(),
          withDetails: true,
        }),
      )
      report.prisonersInvolved = []
      const title = regenerateTitleForReport(report, 'Moorland (HMP & YOI)')
      expect(title).toEqual('Find of illicit items (Moorland (HMP & YOI))')
    })

    it('should make a title from an existing report with prisoner involvements', () => {
      const report = convertReportDates(
        mockReport({
          type: 'MISCELLANEOUS_1',
          location: 'LEI',
          reportReference: '6544',
          reportDateAndTime: new Date(),
          withDetails: true,
        }),
      )
      report.prisonersInvolved = [
        {
          prisonerNumber: andrew.prisonerNumber,
          firstName: andrew.firstName,
          lastName: andrew.lastName,
          prisonerRole: 'IMPEDED_STAFF',
          outcome: 'LOCAL_INVESTIGATION',
          comment: 'Some comments',
        },
      ]
      const title = regenerateTitleForReport(report, 'Leeds (HMP)')
      expect(title).toEqual('Miscellaneous: Arnold A1111AA (Leeds (HMP))')
    })
  })

  describe('Updates', () => {
    const report = convertReportDates(
      mockReport({
        type: 'FIND_6',
        reportReference: '6544',
        reportDateAndTime: new Date(),
        withDetails: true,
      }),
    )
    report.prisonersInvolved = []
    Object.freeze(report)

    const updateReport = jest.fn()
    const getAgency = jest.fn()

    function mockResponse(): express.Response {
      return {
        locals: {
          report,
          apis: {
            incidentReportingApi: { updateReport },
            prisonApi: { getAgency },
          },
        },
      } as unknown as express.Response
    }

    afterEach(() => {
      jest.resetAllMocks()
    })

    const updateFunctions = [
      // if update fails, promise is rejected
      { type: 'infallible', updateFunction: updateReportTitle, fallible: false },
      // no promise is returned and failing update throws no error
      { type: 'fallible', updateFunction: fallibleUpdateReportTitle, fallible: true },
    ] as const

    it.each(updateFunctions)('should be saved successfully with $type update', async ({ updateFunction }) => {
      getAgency.mockResolvedValueOnce(moorland)
      updateReport.mockResolvedValueOnce(report) // NB: response is ignored

      const res = mockResponse()
      await updateFunction(res)

      await setImmediate() // await asynchronous function (ie. fallible one)
      expect(getAgency).toHaveBeenCalledWith('MDI', false, 'INST', false)
      expect(updateReport).toHaveBeenCalledWith(report.id, { title: 'Find of illicit items (Moorland (HMP & YOI))' })
    })

    it.each(updateFunctions)(
      'should be saved successfully with $type update when location is not found',
      async ({ updateFunction }) => {
        getAgency.mockResolvedValueOnce(null)
        updateReport.mockResolvedValueOnce(report) // NB: response is ignored

        const res = mockResponse()
        await updateFunction(res)

        await setImmediate() // await asynchronous function (ie. fallible one)
        expect(getAgency).toHaveBeenCalledWith('MDI', false, 'INST', false)
        expect(updateReport).toHaveBeenCalledWith(report.id, { title: 'Find of illicit items (MDI)' })
      },
    )

    it.each(updateFunctions)(
      'should be saved successfully with $type update when location lookup fails',
      async ({ updateFunction }) => {
        const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
        getAgency.mockRejectedValueOnce(error)
        updateReport.mockResolvedValueOnce(report) // NB: response is ignored

        const res = mockResponse()
        await updateFunction(res)

        await setImmediate() // await asynchronous function (ie. fallible one)
        expect(getAgency).toHaveBeenCalledWith('MDI', false, 'INST', false)
        expect(updateReport).toHaveBeenCalledWith(report.id, { title: 'Find of illicit items (MDI)' })
      },
    )

    it('should fail on infallible update if title cannot be saved', async () => {
      getAgency.mockResolvedValueOnce(moorland)
      const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
      updateReport.mockRejectedValueOnce(error)

      const res = mockResponse()
      await expect(updateReportTitle(res)).rejects.toThrow()

      expect(getAgency).toHaveBeenCalledWith('MDI', false, 'INST', false)
      expect(updateReport).toHaveBeenCalledWith(report.id, { title: 'Find of illicit items (Moorland (HMP & YOI))' })
    })

    it('should still proceed on fallible update if title cannot be saved', async () => {
      getAgency.mockResolvedValueOnce(moorland)
      const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
      updateReport.mockRejectedValueOnce(error)

      const res = mockResponse()
      fallibleUpdateReportTitle(res) // note no error is thrown

      await setImmediate() // await asynchronous function
      expect(getAgency).toHaveBeenCalledWith('MDI', false, 'INST', false)
      expect(updateReport).toHaveBeenCalledWith(report.id, { title: 'Find of illicit items (Moorland (HMP & YOI))' })
    })
  })
})
