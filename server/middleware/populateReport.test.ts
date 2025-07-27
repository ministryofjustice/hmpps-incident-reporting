import type { NextFunction, Request, Response } from 'express'
import nock from 'nock'

import config from '../config'
import { IncidentReportingApi } from '../data/incidentReportingApi'
import { mockReport } from '../data/testData/incidentReporting'
import { now } from '../testutils/fakeClock'
import { Permissions } from './permissions'
import { populateReport } from './populateReport'

describe('report-loading middleware', () => {
  let fakeApi: nock.Scope

  const permissions = jest.mocked(new Permissions(undefined))
  permissions.allowedActionsOnReport = jest.fn()

  beforeEach(() => {
    fakeApi = nock(config.apis.hmppsIncidentReportingApi.url)
    permissions.allowedActionsOnReport.mockReturnValue(new Set(['VIEW']))
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

    const req = { params: { reportId: report.id } } as unknown as Request
    const res = {
      locals: {
        apis: { incidentReportingApi: new IncidentReportingApi('token') },
        permissions,
      },
    } as unknown as Response
    const next: NextFunction = jest.fn()

    await populateReport(withDetails)(req, res, next)

    expect(res.locals.report.reportReference).toEqual(report.reportReference)
    expect(res.locals.reportUrl).toEqual(`/reports/${report.id}`)
    expect(res.locals.reportSubUrlPrefix).toEqual(`/reports/${report.id}`)
    expect(res.locals.allowedActions).toEqual(new Set(['VIEW']))
    expect(next).toHaveBeenCalledWith()
  })

  it('should forward error if report cannot be loaded', async () => {
    const reportId = '01852368-477f-72e9-a239-265ad6e9ec56'
    fakeApi.get(`/incident-reports/${reportId}`).reply(404)
    fakeApi.get(`/incident-reports/${reportId}/with-details`).reply(404)

    const req = { params: { reportId } } as unknown as Request
    const res = {
      locals: {
        apis: { incidentReportingApi: new IncidentReportingApi('token') },
        permissions,
      },
    } as unknown as Response
    const next: NextFunction = jest.fn()

    await populateReport(true)(req, res, next)
    await populateReport(false)(req, res, next)

    expect(permissions.allowedActionsOnReport).not.toHaveBeenCalled()
    expect(res.locals.report).toBeUndefined()
    expect(res.locals.reportUrl).toBeUndefined()
    expect(res.locals.reportSubUrlPrefix).toBeUndefined()
    expect(res.locals.allowedActions).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not Found', responseStatus: 404 }))
  })

  it('should rewrite the status of a 400 bad request error into a 404 not found', async () => {
    const reportId = '10000012' // would not parse as uuid
    fakeApi.get(`/incident-reports/${reportId}`).reply(400)
    fakeApi.get(`/incident-reports/${reportId}/with-details`).reply(400)

    const req = { params: { reportId } } as unknown as Request
    const res = {
      locals: {
        apis: { incidentReportingApi: new IncidentReportingApi('token') },
        permissions,
      },
    } as unknown as Response
    const next: NextFunction = jest.fn()

    await populateReport(true)(req, res, next)
    await populateReport(false)(req, res, next)

    expect(permissions.allowedActionsOnReport).not.toHaveBeenCalled()
    expect(res.locals.report).toBeUndefined()
    expect(res.locals.reportUrl).toBeUndefined()
    expect(res.locals.reportSubUrlPrefix).toBeUndefined()
    expect(res.locals.allowedActions).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Bad Request', responseStatus: 404 }))
  })

  it('should fail if report ID parameter is not supplied', async () => {
    const getReportWithDetailsById = jest.fn()

    const req = { params: {} } as unknown as Request
    const res = {
      locals: {
        apis: { incidentReportingApi: { getReportWithDetailsById } },
        permissions,
      },
    } as unknown as Response
    const next: NextFunction = jest.fn()

    await populateReport(true)(req, res, next)

    expect(getReportWithDetailsById).not.toHaveBeenCalled()
    expect(permissions.allowedActionsOnReport).not.toHaveBeenCalled()
    expect(res.locals.report).toBeUndefined()
    expect(res.locals.reportUrl).toBeUndefined()
    expect(res.locals.reportSubUrlPrefix).toBeUndefined()
    expect(res.locals.allowedActions).toBeUndefined()
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'populateReport() requires req.params.reportId', status: 501 }),
    )
  })

  it('should fail if permissions middleware skipped', async () => {
    const reportId = '01852368-477f-72e9-a239-265ad6e9ec56'
    const getReportWithDetailsById = jest.fn()
    const req = { params: { reportId } } as unknown as Request
    const res = {
      locals: {
        apis: { incidentReportingApi: { getReportWithDetailsById } },
      },
    } as unknown as Response
    const next: NextFunction = jest.fn()

    await populateReport(true)(req, res, next)

    expect(getReportWithDetailsById).not.toHaveBeenCalled()
    expect(res.locals.report).toBeUndefined()
    expect(res.locals.reportUrl).toBeUndefined()
    expect(res.locals.reportSubUrlPrefix).toBeUndefined()
    expect(res.locals.allowedActions).toBeUndefined()
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'populateReport() requires permissions middleware', status: 501 }),
    )
  })
})
