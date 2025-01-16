import type { NextFunction, Request, Response } from 'express'
import nock from 'nock'

import config from '../config'
import { IncidentReportingApi } from '../data/incidentReportingApi'
import { mockReport } from '../data/testData/incidentReporting'
import { now } from '../testutils/fakeClock'
import { populateReport } from './populateReport'

describe('report-loading middleware', () => {
  let fakeApi: nock.Scope

  beforeEach(() => {
    fakeApi = nock(config.apis.hmppsIncidentReportingApi.url)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  it.each([
    { reportType: 'report with details', withDetails: true },
    { reportType: 'basic report', withDetails: false },
  ])('should load $reportType and call next request handler', async ({ withDetails }) => {
    const report = mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails })
    if (withDetails) {
      fakeApi.get(`/incident-reports/${report.id}/with-details`).reply(200, report)
    } else {
      fakeApi.get(`/incident-reports/${report.id}`).reply(200, report)
    }

    const req = { params: { id: report.id } } as unknown as Request
    const res = { locals: { apis: { incidentReportingApi: new IncidentReportingApi('token') } } } as Response
    const next: NextFunction = jest.fn()

    await populateReport(withDetails)(req, res, next)

    expect(res.locals.report.reportReference).toEqual(report.reportReference)
    expect(next).toHaveBeenCalledWith()
  })

  it('should forward error if report cannot be loaded', async () => {
    const reportId = mockReport({ reportReference: '6543', reportDateAndTime: now }).id
    fakeApi.get(`/incident-reports/${reportId}`).reply(404)
    fakeApi.get(`/incident-reports/${reportId}/with-details`).reply(404)

    const req = { params: { id: reportId } } as unknown as Request
    const res = { locals: { apis: { incidentReportingApi: new IncidentReportingApi('token') } } } as Response
    const next: NextFunction = jest.fn()

    await populateReport()(req, res, next)
    await populateReport(false)(req, res, next)

    expect(res.locals.report).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not Found', status: 404 }))
  })

  it('should fail if report ID parameter is not supplied', async () => {
    const getReportWithDetailsById = jest.fn()
    const req = { params: {} } as unknown as Request
    const res = { locals: { apis: { incidentReportingApi: { getReportWithDetailsById } } } } as unknown as Response
    const next: NextFunction = jest.fn()

    await populateReport()(req, res, next)

    expect(getReportWithDetailsById).not.toHaveBeenCalled()
    expect(res.locals.report).toBeUndefined()
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'populateReport() requires req.params.id', status: 501 }),
    )
  })
})
