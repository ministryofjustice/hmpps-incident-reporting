import type { Express, NextFunction, Request, Response } from 'express'

import { convertReportDates } from '../data/incidentReportingApiUtils'
import { mockReport } from '../data/testData/incidentReporting'
import { mockPecsRegions } from '../data/testData/pecsRegions'
import { mockDataWarden, mockReportingOfficer } from '../data/testData/users'
import { now } from '../testutils/fakeClock'
import type { Status } from '../reportConfiguration/constants'
import { Permissions } from './permissions'
import { correctPecsReportStatus } from './correctPecsReportStatus'

describe('Middleware to auto-correct PECS report statuses', () => {
  const report = convertReportDates(mockReport({ reportReference: '6543', reportDateAndTime: now }))

  beforeAll(() => {
    mockPecsRegions()
  })

  function makeMockRequest(
    user: Express.User,
    reportLocation: string,
    status: Status,
  ): { req: Request; res: Response; next: NextFunction } {
    return {
      req: { originalUrl: '/some/path' } as unknown as Request,
      res: {
        locals: {
          apis: { incidentReportingApi: { changeReportStatus: jest.fn() } },
          permissions: new Permissions(user),
          report: { ...report, location: reportLocation, status },
        },
        redirect: jest.fn(),
      } as unknown as Response,
      next: jest.fn(),
    }
  }

  it('should ignore prison reports', async () => {
    const { req, res, next } = makeMockRequest(mockDataWarden, 'MDI', 'AWAITING_REVIEW')
    await correctPecsReportStatus()(req, res, next)

    expect(res.locals.apis.incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith()
  })

  it('should ignore PECS reports if user is not a data warden', async () => {
    const { req, res, next } = makeMockRequest(mockReportingOfficer, 'NORTH', 'AWAITING_REVIEW')
    await correctPecsReportStatus()(req, res, next)

    expect(res.locals.apis.incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith()
  })

  it.each(['DRAFT', 'CLOSED', 'DUPLICATE', 'NOT_REPORTABLE', 'REOPENED'] as const)(
    'should ignore a %s PECS report since status does not need correction',
    async status => {
      const { req, res, next } = makeMockRequest(mockDataWarden, 'NORTH', status)
      await correctPecsReportStatus()(req, res, next)

      expect(res.locals.apis.incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
      expect(res.redirect).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith()
    },
  )

  it.each([
    { status: 'AWAITING_REVIEW', correctedTo: 'DRAFT' },
    { status: 'UPDATED', correctedTo: 'REOPENED' },
    { status: 'ON_HOLD', correctedTo: 'REOPENED' },
    { status: 'NEEDS_UPDATING', correctedTo: 'REOPENED' },
    { status: 'WAS_CLOSED', correctedTo: 'REOPENED' },
  ] as const)('should correct a $status PECS report to $correctedTo', async ({ status, correctedTo }) => {
    const { req, res, next } = makeMockRequest(mockDataWarden, 'NORTH', status)
    await correctPecsReportStatus()(req, res, next)

    expect(res.locals.apis.incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(report.id, {
      newStatus: correctedTo,
    })
    expect(res.redirect).toHaveBeenCalledWith('/some/path')
    expect(next).not.toHaveBeenCalled()
  })

  it.each(['report', 'permissions'] as const)('should fail if %s local is not supplied', async property => {
    const { req, res, next } = makeMockRequest(mockDataWarden, 'NORTH', 'AWAITING_REVIEW')
    delete res.locals[property]
    await correctPecsReportStatus()(req, res, next)

    expect(res.locals.apis.incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('correctPecsReportStatus() requires'), status: 501 }),
    )
  })
})
