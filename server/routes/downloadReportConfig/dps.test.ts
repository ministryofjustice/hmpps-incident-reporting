import type { Express } from 'express'
import request from 'supertest'

import type {
  Constant,
  TypeConstant,
  StaffRoleConstant,
  PrisonerRoleConstant,
  PrisonerOutcomeConstant,
} from '../../data/incidentReportingApi'
import { IncidentReportingApi } from '../../data/incidentReportingApi'
import { appWithAllRoutes } from '../testutils/appSetup'
import { PrisonApi } from '../../data/prisonApi'

jest.mock('../../data/incidentReportingApi')

let app: Express
let prisonApi: jest.Mocked<PrisonApi>
let incidentReportingApi: jest.Mocked<IncidentReportingApi>

beforeEach(() => {
  app = appWithAllRoutes()

  prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>
  prisonApi.getServicePrisonIds = jest.fn().mockResolvedValue(['MDI'])

  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('DPS config downloads', () => {
  it.each([
    { method: 'types' as const },
    { method: 'typeFamilies' as const },
    { method: 'statuses' as const },
    { method: 'informationSources' as const },
    { method: 'staffInvolvementRoles' as const },
    { method: 'prisonerInvolvementRoles' as const },
    { method: 'prisonerInvolvementOutcomes' as const },
    { method: 'errorCodes' as const },
  ])('should work for $method.json', ({ method }) => {
    // cheat by making a constant that is the union of all possible types
    const constant: Constant & TypeConstant & StaffRoleConstant & PrisonerRoleConstant & PrisonerOutcomeConstant = {
      familyCode: 'CODE',
      code: 'CODE_1',
      description: 'Description',
      active: true,
      nomisCode: 'C1',
      nomisCodes: ['C1', 'C2'],
    }
    const constants = [constant]

    const mockedApiCall = jest.fn(() => Promise.resolve(constants))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore because getters cannot be overridden
    incidentReportingApi.constants = {}
    incidentReportingApi.constants[method] = mockedApiCall

    return request(app)
      .get(`/download-report-config/dps/${method}.json`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect('Content-Disposition', /attachment; filename=.*\.json/)
      .expect(res => {
        expect(res.body).toEqual(constants)
        expect(mockedApiCall).toHaveBeenCalled()
      })
  })
})
