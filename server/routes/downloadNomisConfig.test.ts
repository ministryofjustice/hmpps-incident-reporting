import type { Express } from 'express'
import request from 'supertest'

import { buildArray } from '../utils/utils'
import { PrisonApi, type ReferenceCode } from '../data/prisonApi'
import { appWithAllRoutes } from './testutils/appSetup'

jest.mock('../data/prisonApi')

let app: Express
let prisonApi: jest.Mocked<PrisonApi>

beforeEach(() => {
  app = appWithAllRoutes({})
  prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('NOMIS config downloads', () => {
  it.each([
    {
      scenario: 'incident types',
      url: '/nomis-report-config/incident-types.csv',
      prisonApiMethod: 'getIncidentTypes' as const,
    },
    {
      scenario: 'staff involvement roles',
      url: '/nomis-report-config/staff-involvement-roles.csv',
      prisonApiMethod: 'getStaffInvolvementRoles' as const,
    },
    {
      scenario: 'prisoner involvement roles',
      url: '/nomis-report-config/prisoner-involvement-roles.csv',
      prisonApiMethod: 'getPrisonerInvolvementRoles' as const,
    },
    {
      scenario: 'prisoner involvement outcomes',
      url: '/nomis-report-config/prisoner-involvement-outcome.csv',
      prisonApiMethod: 'getPrisonerInvolvementOutcome' as const,
    },
  ])('should render a CSV file of $scenario', ({ url, prisonApiMethod }) => {
    prisonApi[prisonApiMethod].mockResolvedValueOnce(
      buildArray<ReferenceCode>(3, index => ({
        domain: 'SAMPL',
        code: `SAMPL${index + 1}`,
        description: `Sample ${index + 1}`,
        listSeq: index + 1,
        activeFlag: 'Y',
        systemDataFlag: 'N',
        subCodes: [],
      })),
    )

    return request(app)
      .get(url)
      .expect(200)
      .expect('Content-Type', /text\/csv/)
      .expect('Content-Disposition', /attachment; filename=/)
      .expect(res => {
        expect(res.text).toContain('Sample 2')
      })
  })
})
