import type { Express } from 'express'
import request from 'supertest'

import { IncidentReportingApi } from '../../data/incidentReportingApi'
import { appWithAllRoutes } from '../testutils/appSetup'

jest.mock('../../data/incidentReportingApi')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>

beforeEach(() => {
  app = appWithAllRoutes({})
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('DPS config downloads', () => {
  it.each([
    { method: 'types' as const },
    { method: 'statuses' as const },
    { method: 'informationSources' as const },
    { method: 'staffInvolvementRoles' as const },
    { method: 'prisonerInvolvementRoles' as const },
    { method: 'prisonerInvolvementOutcomes' as const },
    { method: 'correctionRequestReasons' as const },
    { method: 'errorCodes' as const },
  ])('should work for $method.json', ({ method }) => {
    const constants = [
      { code: 'ASSAULT', description: 'Assault', active: true, nomisCode: 'ASSAULTS3' },
      { code: 'OLD_ASSAULT3', description: 'Assault (from April 2017)', active: false, nomisCode: 'ASSAULTS2' },
    ]

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore because getters cannot be overridden
    incidentReportingApi.constants = {}
    incidentReportingApi.constants[method] = () => Promise.resolve(constants)

    return request(app)
      .get(`/download-report-config/dps/${method}.json`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect('Content-Disposition', /attachment; filename=.*\.json/)
      .expect(res => expect(res.body).toEqual(constants))
  })
})
