import nock from 'nock'

import config from '../config'
import { type IncidentTypeConfiguration, PrisonApi } from './prisonApi'

describe('prisonApi', () => {
  const systemToken = 'token'
  let fakeApiClient: nock.Scope
  let apiClient: PrisonApi

  beforeEach(() => {
    fakeApiClient = nock(config.apis.hmppsPrisonApi.url)
    apiClient = new PrisonApi(systemToken)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getPhoto', () => {
    const prisonerNumber = 'A1234BC'

    it('should return an image', async () => {
      const imageData = Buffer.from('image data')
      fakeApiClient
        .get(`/api/bookings/offenderNo/${prisonerNumber}/image/data`)
        .query({ fullSizeImage: 'false' })
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, imageData, { 'Content-Type': 'image/jpeg' })

      const response = await apiClient.getPhoto(prisonerNumber)
      expect(response).toEqual(imageData)
    })

    it('should return null if not found', async () => {
      fakeApiClient
        .get(`/api/bookings/offenderNo/${prisonerNumber}/image/data`)
        .query({ fullSizeImage: 'false' })
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404)

      const response = await apiClient.getPhoto(prisonerNumber)
      expect(response).toBeNull()
    })

    it('should return null if unauthorised', async () => {
      fakeApiClient
        .get(`/api/bookings/offenderNo/${prisonerNumber}/image/data`)
        .query({ fullSizeImage: 'false' })
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(403)

      const response = await apiClient.getPhoto(prisonerNumber)
      expect(response).toBeNull()
    })

    it('should throw when it receives another error', async () => {
      fakeApiClient
        .get(`/api/bookings/offenderNo/${prisonerNumber}/image/data`)
        .query({ fullSizeImage: 'false' })
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500)

      await expect(apiClient.getPhoto(prisonerNumber)).rejects.toThrow('Internal Server Error')
    })
  })

  describe('getIncidentTypeConfiguration', () => {
    describe('conversion of date fields', () => {
      it('should work for absent fields', async () => {
        fakeApiClient
          .get('/api/incidents/configuration')
          .query(true)
          .matchHeader('authorization', `Bearer ${systemToken}`)
          .reply(200, [
            {
              incidentType: 'ASSAULT',
              incidentTypeDescription: 'Assaults',
              questionnaireId: 1,
              questions: [
                {
                  questionnaireQueId: 2,
                  questionSeq: 1,
                  questionDesc: 'WERE THE POLICE INFORMED OF THE INCIDENT',
                  questionListSeq: 1,
                  questionActiveFlag: true,
                  multipleAnswerFlag: false,
                  answers: [
                    {
                      questionnaireAnsId: 3,
                      answerSeq: 1,
                      answerDesc: 'YES (ENTER DATE)',
                      answerListSeq: 1,
                      answerActiveFlag: true,
                      dateRequiredFlag: true,
                      commentRequiredFlag: false,
                      nextQuestionnaireQueId: 4,
                    },
                  ],
                },
              ],
              prisonerRoles: [
                {
                  prisonerRole: 'PRESENT',
                  singleRole: false,
                  active: true,
                },
              ],
              active: true,
            },
          ] satisfies DatesAsStrings<IncidentTypeConfiguration[]>)

        const incidentTypes = await apiClient.getIncidentTypeConfiguration()
        expect(incidentTypes).toHaveLength(1)
        const incidentType = incidentTypes[0]
        expect(incidentType.questions).toHaveLength(1)
        const question = incidentType.questions[0]
        expect(question.answers).toHaveLength(1)
        const answer = question.answers[0]
        expect(incidentType.prisonerRoles).toHaveLength(1)
        const prisonerRole = incidentType.prisonerRoles[0]

        expect(incidentType.expiryDate).toBeUndefined()
        expect(question.questionExpiryDate).toBeUndefined()
        expect(answer.answerExpiryDate).toBeUndefined()
        expect(prisonerRole.expiryDate).toBeUndefined()
      })

      it('should work for present, nested date fields', async () => {
        fakeApiClient
          .get('/api/incidents/configuration')
          .query(true)
          .matchHeader('authorization', `Bearer ${systemToken}`)
          .reply(200, [
            {
              incidentType: 'ASSAULT',
              incidentTypeDescription: 'Assaults',
              questionnaireId: 1,
              questions: [
                {
                  questionnaireQueId: 2,
                  questionSeq: 1,
                  questionDesc: 'WERE THE POLICE INFORMED OF THE INCIDENT',
                  questionListSeq: 1,
                  questionActiveFlag: false,
                  questionExpiryDate: '2022-08-20',
                  multipleAnswerFlag: false,
                  answers: [
                    {
                      questionnaireAnsId: 3,
                      answerSeq: 1,
                      answerDesc: 'YES (ENTER DATE)',
                      answerListSeq: 1,
                      answerActiveFlag: false,
                      answerExpiryDate: '2022-08-20',
                      dateRequiredFlag: true,
                      commentRequiredFlag: false,
                      nextQuestionnaireQueId: 4,
                    },
                  ],
                },
              ],
              prisonerRoles: [
                {
                  prisonerRole: 'PRESENT',
                  singleRole: false,
                  active: false,
                  expiryDate: '2022-08-20',
                },
              ],
              active: false,
              expiryDate: '2022-08-20',
            },
          ] satisfies DatesAsStrings<IncidentTypeConfiguration[]>)

        const incidentTypes = await apiClient.getIncidentTypeConfiguration()
        expect(incidentTypes).toHaveLength(1)
        const incidentType = incidentTypes[0]
        expect(incidentType.questions).toHaveLength(1)
        const question = incidentType.questions[0]
        expect(question.answers).toHaveLength(1)
        const answer = question.answers[0]
        expect(incidentType.prisonerRoles).toHaveLength(1)
        const prisonerRole = incidentType.prisonerRoles[0]

        expect(incidentType.expiryDate).toBeInstanceOf(Date)
        expect(question.questionExpiryDate).toBeInstanceOf(Date)
        expect(answer.answerExpiryDate).toBeInstanceOf(Date)
        expect(prisonerRole.expiryDate).toBeInstanceOf(Date)
      })
    })
  })
})
