import type { Express } from 'express'
import request from 'supertest'

import { buildArray, convertToTitleCase, datesAsStrings } from '../../utils/utils'
import { PrisonApi, type IncidentTypeConfiguration, type ReferenceCode } from '../../data/prisonApi'
import { appWithAllRoutes } from '../testutils/appSetup'
import { NomisType } from '../../reportConfiguration/constants'

jest.mock('../../data/prisonApi')

let app: Express
let prisonApi: jest.Mocked<PrisonApi>

beforeEach(() => {
  app = appWithAllRoutes({})
  prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

const fileTypes = ['csv', 'json'] as const

describe('NOMIS config downloads', () => {
  describe.each(fileTypes)('should render a %s file of', fileType => {
    const expectedContentType = fileType === 'csv' ? /text\/csv/ : /application\/json/
    const expectedContentDisposition =
      fileType === 'csv' ? /attachment; filename=.*\.csv/ : /attachment; filename=.*\.json/

    it('incident types', () => {
      const nomisData = ['ASSAULTS1', 'DRONE'].map((type: NomisType, index): IncidentTypeConfiguration => {
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
      })
      prisonApi.getIncidentTypeConfiguration.mockResolvedValueOnce(nomisData)

      return request(app)
        .get(`/download-report-config/nomis/incident-types.${fileType}`)
        .expect(200)
        .expect('Content-Type', expectedContentType)
        .expect('Content-Disposition', expectedContentDisposition)
        .expect(res => {
          if (fileType === 'csv') {
            expect(res.text).toContain(
              `
Type,Description,Questionnaire ID,Active,Expired
ASSAULTS1,Assaults1,1,FALSE,20/08/2020
DRONE,Drone,2,FALSE,20/08/2020
              `.trim(),
            )
          } else {
            expect(res.body).toEqual(datesAsStrings(nomisData))
          }
        })
    })

    it('questions and answers for an incident type', () => {
      const nomisData: IncidentTypeConfiguration = {
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
            answers: [
              {
                questionnaireAnsId: 1,
                answerSeq: 1,
                answerDesc: 'POLICE (ENTER DATE)',
                answerListSeq: 1,
                answerActiveFlag: false,
                answerExpiryDate: new Date(2022, 7, 20),
                dateRequiredFlag: true,
                commentRequiredFlag: false,
                nextQuestionnaireQueId: 2,
              },
              {
                questionnaireAnsId: 2,
                answerSeq: 2,
                answerDesc: 'SOMEONE ELSE (ENTER WHO IN COMMENT)',
                answerListSeq: 2,
                answerActiveFlag: false,
                answerExpiryDate: new Date(2022, 7, 20),
                dateRequiredFlag: false,
                commentRequiredFlag: true,
                nextQuestionnaireQueId: 2,
              },
            ],
          },
          {
            questionnaireQueId: 2,
            questionSeq: 2,
            questionDesc: 'WERE THE POLICE INFORMED OF THE INCIDENT',
            questionListSeq: 2,
            questionActiveFlag: true,
            multipleAnswerFlag: false,
            answers: [
              {
                questionnaireAnsId: 3,
                answerSeq: 1,
                answerDesc: 'YES',
                answerListSeq: 1,
                answerActiveFlag: true,
                dateRequiredFlag: false,
                commentRequiredFlag: false,
              },
              {
                questionnaireAnsId: 4,
                answerSeq: 2,
                answerDesc: 'NO',
                answerListSeq: 2,
                answerActiveFlag: true,
                dateRequiredFlag: false,
                commentRequiredFlag: false,
              },
            ],
          },
        ],
        prisonerRoles: [],
        active: true,
      }
      prisonApi.getIncidentTypeConfiguration.mockResolvedValueOnce([nomisData])

      return request(app)
        .get(`/download-report-config/nomis/incident-type/ASSAULT/questions.${fileType}`)
        .expect(200)
        .expect('Content-Type', expectedContentType)
        .expect('Content-Disposition', expectedContentDisposition)
        .expect(res => {
          if (fileType === 'csv') {
            expect(res.text).toContain(
              `
Question ID,Question sequence,Question list sequence,Question,Allows multiple answers?,Question is active,Question expired,Answer ID,Answer sequence,Answer list sequence,Answer,Answer requires comment,Answer requires date,Answer is active,Answer expired,Next question ID
1,1,1,WHO WAS INFORMED OF THE INCIDENT,TRUE,FALSE,20/08/2022,,,,,,,,
,,,,,,,1,1,1,POLICE (ENTER DATE),FALSE,FALSE,TRUE,20/08/2022,2
,,,,,,,2,2,2,SOMEONE ELSE (ENTER WHO IN COMMENT),FALSE,TRUE,FALSE,20/08/2022,2
2,2,2,WERE THE POLICE INFORMED OF THE INCIDENT,FALSE,TRUE,,,,,,,,,
,,,,,,,3,1,1,YES,TRUE,FALSE,FALSE,,None
,,,,,,,4,2,2,NO,TRUE,FALSE,FALSE,,None
              `.trim(),
            )
          } else {
            expect(res.body).toEqual(datesAsStrings(nomisData))
          }
        })
    })

    it('prisoner roles for an incident type', () => {
      const nomisData: ReferenceCode[] = [
        {
          domain: 'IR_OFF_PART',
          code: 'ACTINV',
          description: 'Active Involvement',
          listSeq: 1,
          activeFlag: 'Y',
          systemDataFlag: 'N',
          subCodes: [],
        },
        {
          domain: 'IR_OFF_PART',
          code: 'IMPED',
          description: 'Impeded Staff',
          listSeq: 2,
          activeFlag: 'Y',
          systemDataFlag: 'N',
          subCodes: [],
        },
      ]
      prisonApi.getPrisonerInvolvementRoles.mockResolvedValueOnce(nomisData)
      prisonApi.getIncidentTypeConfiguration.mockResolvedValueOnce([
        {
          incidentType: 'ASSAULT',
          incidentTypeDescription: 'Assault',
          questionnaireId: 1,
          questions: [],
          prisonerRoles: [
            {
              prisonerRole: 'ACTINV',
              singleRole: false,
              active: true,
            },
            {
              prisonerRole: 'IMPED',
              singleRole: false,
              active: false,
              expiryDate: new Date(2022, 7, 20),
            },
            {
              prisonerRole: 'PRESENT',
              singleRole: true,
              active: false,
              expiryDate: new Date(2010, 4, 12),
            },
          ],
          active: true,
        },
      ])

      return request(app)
        .get(`/download-report-config/nomis/incident-type/ASSAULT/prisoner-roles.${fileType}`)
        .expect(200)
        .expect('Content-Type', expectedContentType)
        .expect('Content-Disposition', expectedContentDisposition)
        .expect(res => {
          if (fileType === 'csv') {
            expect(res.text).toContain(
              `
Role,Description (from reference data),Only one prisoner can have this role,Active,Expired
ACTINV,Active Involvement,FALSE,TRUE,
IMPED,Impeded Staff,FALSE,FALSE,20/08/2022
PRESENT,,TRUE,FALSE,12/05/2010
            `.trim(),
            )
          } else {
            expect(res.body).toEqual(nomisData)
          }
        })
    })

    it.each([
      {
        scenario: 'staff involvement roles',
        url: `/download-report-config/nomis/staff-involvement-roles.${fileType}`,
        prisonApiMethod: 'getStaffInvolvementRoles' as const,
      },
      {
        scenario: 'prisoner involvement roles',
        url: `/download-report-config/nomis/prisoner-involvement-roles.${fileType}`,
        prisonApiMethod: 'getPrisonerInvolvementRoles' as const,
      },
      {
        scenario: 'prisoner involvement outcomes',
        url: `/download-report-config/nomis/prisoner-involvement-outcome.${fileType}`,
        prisonApiMethod: 'getPrisonerInvolvementOutcome' as const,
      },
    ])('$scenario', ({ url, prisonApiMethod }) => {
      const nomisData: ReferenceCode[] = buildArray<ReferenceCode>(3, index => ({
        domain: 'SAMPL',
        code: `SAMPL${index + 1}`,
        description: `Sample ${index + 1}`,
        listSeq: index + 1,
        activeFlag: 'Y',
        systemDataFlag: 'N',
        subCodes: [],
      }))
      prisonApi[prisonApiMethod].mockResolvedValueOnce(nomisData)

      return request(app)
        .get(url)
        .expect(200)
        .expect('Content-Type', expectedContentType)
        .expect('Content-Disposition', expectedContentDisposition)
        .expect(res => {
          if (fileType === 'csv') {
            expect(res.text).toContain(
              `
Domain,Code,Description,Sequence,Active,System
SAMPL,SAMPL1,Sample 1,1,TRUE,FALSE
SAMPL,SAMPL2,Sample 2,2,TRUE,FALSE
SAMPL,SAMPL3,Sample 3,3,TRUE,FALSE
              `.trim(),
            )
          } else {
            expect(res.body).toEqual(nomisData)
          }
        })
    })
  })
})
