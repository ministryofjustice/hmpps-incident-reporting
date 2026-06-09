import type { NextFunction, Request, Response } from 'express'

import { andrew, ernie } from '../data/testData/offenderSearch'
import { moorland } from '../data/testData/prisonApi'
import { requirePrisonerInCaseload } from './requirePrisonerInCaseload'

function makeRes(locals: Record<string, unknown>): Response {
  return { locals } as unknown as Response
}

const userWithMoorland = { caseLoads: [{ caseLoadId: moorland.agencyId }] }

describe('requirePrisonerInCaseload', () => {
  it('calls next with no error when the prisoner is in one of the user’s caseloads', () => {
    const res = makeRes({ prisoner: andrew, user: userWithMoorland })
    const next: NextFunction = jest.fn()

    requirePrisonerInCaseload()({} as Request, res, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('responds 404 when the prisoner is not in the user’s caseloads', () => {
    const res = makeRes({ prisoner: andrew, user: { caseLoads: [{ caseLoadId: 'LEI' }] } })
    const next: NextFunction = jest.fn()

    requirePrisonerInCaseload()({} as Request, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }))
  })

  it('responds 404 for an out/transfer prisoner whose prisonId matches no caseload', () => {
    const res = makeRes({ prisoner: ernie, user: userWithMoorland })
    const next: NextFunction = jest.fn()

    requirePrisonerInCaseload()({} as Request, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }))
  })

  it('errors when populatePrisoner has not run', () => {
    const res = makeRes({ user: userWithMoorland })
    const next: NextFunction = jest.fn()

    requirePrisonerInCaseload()({} as Request, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }))
  })
})
