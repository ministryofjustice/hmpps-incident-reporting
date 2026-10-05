import type { Request, Response } from 'express'

import { mockReportingOfficer } from '../data/testData/users'
import userTelemetry from './userTelemetry'

// the telemetry library sets attributes on the active OpenTelemetry span; it brings @opentelemetry/api as a peer dependency
const { trace } = jest.requireActual<typeof import('@opentelemetry/api')>('@opentelemetry/api')

describe('userTelemetry', () => {
  const setAttribute = jest.fn()
  const next = jest.fn()

  beforeEach(() => {
    jest
      .spyOn(trace, 'getActiveSpan')
      .mockReturnValue({ setAttribute } as unknown as ReturnType<typeof trace.getActiveSpan>)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
  })

  function recordedAttributes(user: Express.User | undefined): Record<string, unknown> {
    const res = { locals: { user } } as unknown as Response
    userTelemetry()({} as Request, res, next)
    expect(next).toHaveBeenCalled()
    return Object.fromEntries(setAttribute.mock.calls)
  }

  it('records the username, user ids and active caseload of the signed-in user', () => {
    expect(recordedAttributes(mockReportingOfficer)).toEqual({
      username: 'user1',
      userId: 'id',
      userUuid: '11111111-1111-1111-1111-111111111111',
      activeCaseLoadId: 'MDI',
    })
  })

  it('falls back to the active caseload id when the caseload has not been loaded', () => {
    expect(recordedAttributes({ ...mockReportingOfficer, activeCaseLoad: undefined })).toEqual(
      expect.objectContaining({ activeCaseLoadId: 'MDI' }),
    )
  })

  it('leaves out details the user does not have', () => {
    expect(
      recordedAttributes({
        ...mockReportingOfficer,
        userId: undefined,
        userUuid: undefined,
        activeCaseLoad: undefined,
        activeCaseLoadId: undefined,
      }),
    ).toEqual({ username: 'user1' })
  })

  it('records nothing when there is no user', () => {
    expect(recordedAttributes(undefined)).toEqual({})
  })
})
