import type { Express } from 'express'
import request from 'supertest'

import { buildArray, convertToTitleCase } from '../utils/utils'
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
  it('should render a CSV file of incident types', () => {
    prisonApi.getIncidentTypeConfiguration.mockResolvedValueOnce(
      ['ASSAULT1', 'DRONE'].map((type, index) => {
        const index1 = index + 1
        return {
          incidentType: type,
          incidentTypeDescription: convertToTitleCase(type),
          questionnaireId: index1,
          questions: [
            {
              questionnaireQueId: index1,
              questionSeq: 1,
              questionDesc: 'WAS THE POLICE INVOLVED',
              questionListSeq: 1,
              questionActiveFlag: true,
              multipleAnswerFlag: false,
              answers: [],
            },
          ],
          prisonerRoles: [],
          active: false,
          expiryDate: new Date(2020, 7, 20),
        }
      }),
    )

    return request(app)
      .get('/nomis-report-config/incident-types.csv')
      .expect(200)
      .expect('Content-Type', /text\/csv/)
      .expect('Content-Disposition', /attachment; filename=/)
      .expect(res => {
        expect(res.text).toContain(
          `
Type,Description,Questionnaire ID,Active,Expired
ASSAULT1,Assault1,1,FALSE,20/08/2020
DRONE,Drone,2,FALSE,20/08/2020
        `.trim(),
        )
      })
  })

  it('should render a CSV file of questions for an incident type', () => {
    prisonApi.getIncidentTypeConfiguration.mockResolvedValueOnce([
      {
        incidentType: 'ASSAULT',
        incidentTypeDescription: 'Assault',
        questionnaireId: 1,
        questions: [
          {
            questionnaireQueId: 1,
            questionSeq: 1,
            questionDesc: 'WHO WAS INFORMED OF THE INCIDENT',
            questionListSeq: 1,
            questionActiveFlag: false,
            questionExpiryDate: new Date(2022, 7, 20),
            multipleAnswerFlag: true,
            answers: [],
          },
          {
            questionnaireQueId: 2,
            questionSeq: 2,
            questionDesc: 'WERE THE POLICE INFORMED OF THE INCIDENT',
            questionListSeq: 2,
            questionActiveFlag: true,
            multipleAnswerFlag: false,
            answers: [],
          },
        ],
        prisonerRoles: [],
        active: true,
      },
    ])

    return request(app)
      .get('/nomis-report-config/incident-type/ASSAULT/questions.csv')
      .expect(200)
      .expect('Content-Type', /text\/csv/)
      .expect('Content-Disposition', /attachment; filename=/)
      .expect(res => {
        expect(res.text).toContain(
          `
Question ID,Sequence,List sequence,Question,Allows multiple answers,Active,Expired
1,1,1,WHO WAS INFORMED OF THE INCIDENT,TRUE,FALSE,20/08/2022
2,2,2,WERE THE POLICE INFORMED OF THE INCIDENT,FALSE,TRUE,
        `.trim(),
        )
      })
  })

  it.each([
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
        expect(res.text).toContain(
          `
Domain,Code,Description,Sequence,Active,System
SAMPL,SAMPL1,Sample 1,1,TRUE,FALSE
SAMPL,SAMPL2,Sample 2,2,TRUE,FALSE
SAMPL,SAMPL3,Sample 3,3,TRUE,FALSE
          `.trim(),
        )
      })
  })
})
