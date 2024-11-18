import type { NextFunction, Request, Response } from 'express'
import nock from 'nock'

import config from '../config'
import { mockReport } from '../data/testData/incidentReporting'
import { populateReport } from './populateReport'
import { IncidentReportingApi } from '../data/incidentReportingApi'
import { type Type } from '../reportConfiguration/constants'

describe('report-loading middleware', () => {
  // 2023-12-05T12:34:56.000Z
  const now = new Date(2023, 11, 5, 12, 34, 56)
  const report = mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true })

  let fakeApi: nock.Scope

  beforeEach(() => {
    fakeApi = nock(config.apis.hmppsIncidentReportingApi.url)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  it('calls next request handler if report can be loaded', async () => {
    fakeApi.get(`/incident-reports/${report.id}/with-details`).reply(200, report)

    const req = { params: { id: report.id } } as unknown as Request
    const res = { locals: { apis: { incidentReportingApi: new IncidentReportingApi('token') } } } as Response
    const next: NextFunction = jest.fn()
    await populateReport()(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(res.locals.report.reportReference).toEqual(report.reportReference)
    expect(res.locals.reportConfig.incidentType).toEqual(report.type)
  })

  it('forwards error if report cannot be loaded', async () => {
    fakeApi.get(`/incident-reports/${report.id}/with-details`).reply(404)

    const req = { params: { id: report.id } } as unknown as Request
    const res = { locals: { apis: { incidentReportingApi: new IncidentReportingApi('token') } } } as Response
    const next: NextFunction = jest.fn()
    await populateReport()(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not Found', status: 404 }))
    expect(res.locals.report).toBeUndefined()
    expect(res.locals.reportConfig).toBeUndefined()
  })

  it('forwards error if report config cannot be loaded', async () => {
    report.type = 'UNKNOWN' as Type
    fakeApi.get(`/incident-reports/${report.id}/with-details`).reply(200, report)

    const req = { params: { id: report.id } } as unknown as Request
    const res = { locals: { apis: { incidentReportingApi: new IncidentReportingApi('token') } } } as Response
    const next: NextFunction = jest.fn()
    await populateReport()(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 'MODULE_NOT_FOUND' }))
    expect(res.locals.report.reportReference).toEqual(report.reportReference)
    expect(res.locals.reportConfig).toBeUndefined()
  })
})
