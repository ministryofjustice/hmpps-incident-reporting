import type { NextFunction, Request, Response } from 'express'
import nock from 'nock'

import config from '../config'
import { mockReport } from '../data/testData/incidentReporting'
import { populateReport } from './populateReport'
import { IncidentReportingApi } from '../data/incidentReportingApi'

describe('report-loading middleware', () => {
  // 2023-12-05T12:34:56.000Z
  const now = new Date(2023, 11, 5, 12, 34, 56)
  const basicReport = mockReport({ reportReference: '6543', reportDateAndTime: now })

  let fakeApi: nock.Scope

  beforeEach(() => {
    fakeApi = nock(config.apis.hmppsIncidentReportingApi.url)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  it('should call next request handler if report can be loaded', async () => {
    fakeApi.get(`/incident-reports/${basicReport.id}`).reply(200, basicReport)

    const req = { params: { id: basicReport.id } } as unknown as Request
    const res = { locals: { apis: { incidentReportingApi: new IncidentReportingApi('token') } } } as Response
    const next: NextFunction = jest.fn()
    await populateReport()(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(res.locals.incident.reportReference).toEqual(basicReport.reportReference)
  })

  it('should forward error if report cannot be loaded', async () => {
    fakeApi.get(`/incident-reports/${basicReport.id}`).reply(404)

    const req = { params: { id: basicReport.id } } as unknown as Request
    const res = { locals: { apis: { incidentReportingApi: new IncidentReportingApi('token') } } } as Response
    const next: NextFunction = jest.fn()
    await populateReport()(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not Found', status: 404 }))
    expect(res.locals.incident).toBeUndefined()
  })
})
