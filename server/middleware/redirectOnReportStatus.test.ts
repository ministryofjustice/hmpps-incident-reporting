import type { NextFunction, Request, Response } from 'express'

import { convertReportDates } from '../data/incidentReportingApiUtils'
import { mockReport } from '../data/testData/incidentReporting'
import { now } from '../testutils/fakeClock'
import { redirectIfStatusNot } from './redirectOnReportStatus'

describe('Middleware to redirect to report view depending on status', () => {
  const mockedReport = convertReportDates(
    mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: false }),
  )
  const reportUrl = `/reports/${mockedReport.id}`

  it('should redirect to report view page when the status is not listed', async () => {
    mockedReport.status = 'AWAITING_REVIEW'
    const req = {} as unknown as Request
    const res = { locals: { report: mockedReport, reportUrl }, redirect: jest.fn() } as unknown as Response
    const next: NextFunction = jest.fn()

    await redirectIfStatusNot('DRAFT', 'NEEDS_UPDATING')(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(reportUrl)
  })

  it('should call next handler when the status is listed', async () => {
    mockedReport.status = 'DRAFT'
    const req = {} as unknown as Request
    const res = { locals: { report: mockedReport, reportUrl }, redirect: jest.fn() } as unknown as Response
    const next: NextFunction = jest.fn()

    await redirectIfStatusNot('DRAFT', 'NEEDS_UPDATING')(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should fail if report local is not supplied', async () => {
    const req = {} as unknown as Request
    const res = { locals: {}, redirect: jest.fn() } as unknown as Response
    const next: NextFunction = jest.fn()

    await redirectIfStatusNot('DRAFT', 'NEEDS_UPDATING')(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'redirectIfStatusNot() requires res.locals.report', status: 501 }),
    )
    expect(res.redirect).not.toHaveBeenCalled()
  })
})
