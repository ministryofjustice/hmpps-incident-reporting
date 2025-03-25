import type { NextFunction, Request, Response } from 'express'

import { convertReportDates, reportHasDetails } from '../data/incidentReportingApiUtils'
import { QuestionProgress } from '../data/incidentTypeConfiguration/questionProgress'
import { mockReport } from '../data/testData/incidentReporting'
import type { Type } from '../reportConfiguration/constants'
import { now } from '../testutils/fakeClock'
import { populateReportConfiguration } from './populateReportConfiguration'

describe('Middleware to load report configuration and progress', () => {
  const basicReport = convertReportDates(
    mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: false }),
  )
  const reportWithDetails = convertReportDates(
    mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
  )

  it.each([
    { reportType: 'basic report', report: basicReport },
    { reportType: 'report with details', report: reportWithDetails },
  ])('should load configuration for $reportType and call next request handler', async ({ report }) => {
    const req = {} as unknown as Request
    const res = { locals: { report } } as unknown as Response
    const next: NextFunction = jest.fn()

    await populateReportConfiguration()(req, res, next)

    expect(res.locals.reportConfig.incidentType).toEqual(report.type)
    expect(res.locals.questionFields).toBeInstanceOf(Object)
    expect(res.locals.questionSteps).toBeInstanceOf(Object)
    if (reportHasDetails(report)) {
      expect(res.locals.questionProgress).toBeInstanceOf(QuestionProgress)
    } else {
      expect(res.locals.questionProgress).toBeUndefined()
    }
    expect(next).toHaveBeenCalledWith()
  })

  it.each([
    { reportType: 'basic report', report: basicReport },
    { reportType: 'report with details', report: reportWithDetails },
  ])('should allow skipping question steps and fields for $reportType', async ({ report }) => {
    const req = {} as unknown as Request
    const res = { locals: { report } } as unknown as Response
    const next: NextFunction = jest.fn()

    await populateReportConfiguration(false)(req, res, next)

    expect(res.locals.reportConfig.incidentType).toEqual(report.type)
    expect(res.locals.questionFields).toBeUndefined()
    expect(res.locals.questionSteps).toBeUndefined()
    expect(res.locals.questionProgress).toBeUndefined()
    expect(next).toHaveBeenCalledWith()
  })

  it('should forward error if configuration cannot be loaded', async () => {
    const report = convertReportDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    report.type = 'UNKNOWN' as Type

    const req = {} as unknown as Request
    const res = { locals: { report } } as unknown as Response
    const next: NextFunction = jest.fn()

    await populateReportConfiguration()(req, res, next)

    expect(res.locals.reportConfig).toBeUndefined()
    expect(res.locals.questionFields).toBeUndefined()
    expect(res.locals.questionSteps).toBeUndefined()
    expect(res.locals.questionProgress).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 'MODULE_NOT_FOUND' }))
  })

  it('should fail if report local is not supplied', async () => {
    const req = {} as unknown as Request
    const res = { locals: {} } as unknown as Response
    const next: NextFunction = jest.fn()

    await populateReportConfiguration()(req, res, next)

    expect(res.locals.reportConfig).toBeUndefined()
    expect(res.locals.questionFields).toBeUndefined()
    expect(res.locals.questionSteps).toBeUndefined()
    expect(res.locals.questionProgress).toBeUndefined()
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'populateReportConfiguration() requires res.locals.report', status: 501 }),
    )
  })
})
