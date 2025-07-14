import nock from 'nock'

import config from '../config'
import {
  PrisonApi,
  type ActiveAgency,
  type Agency,
  type IncidentTypeConfiguration,
  type ReferenceCode,
} from './prisonApi'
import { brixton, leeds, moorland, pecsNorth, pecsSouth, staffMary } from './testData/prisonApi'

describe('prisonApi', () => {
  const accessToken = 'token'
  let fakeApiClient: nock.Scope
  let apiClient: PrisonApi

  beforeEach(() => {
    fakeApiClient = nock(config.apis.hmppsPrisonApi.url)
    apiClient = new PrisonApi(accessToken)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getPrison', () => {
    const { agencyId: prisonId } = moorland

    it('should return an object', async () => {
      fakeApiClient
        .get(`/api/agencies/${prisonId}`)
        .query(true)
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(200, moorland)

      const response = await apiClient.getPrison(prisonId)
      expect(response).toEqual(moorland)
    })

    it('should return null if not found', async () => {
      fakeApiClient
        .get(`/api/agencies/${prisonId}`)
        .query(true)
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(404)

      const response = await apiClient.getPrison(prisonId)
      expect(response).toBeNull()
    })

    it('should throw when it receives another error', async () => {
      fakeApiClient
        .get(`/api/agencies/${prisonId}`)
        .query(true)
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .thrice()
        .reply(500)

      await expect(apiClient.getPrison(prisonId)).rejects.toThrow('Internal Server Error')
    })
  })

  describe('getPrisons', () => {
    it('should create a map of prisons from api', async () => {
      fakeApiClient
        .get('/api/agencies/prisons')
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(200, [moorland, leeds] satisfies Agency[])

      await expect(apiClient.getPrisons()).resolves.toEqual<Record<string, Agency>>({
        LEI: leeds,
        MDI: moorland,
      })
    })
  })

  describe('getAgenciesSwitchedOn', () => {
    it('returns the list of prisons where INCIDENTS service is active', async () => {
      const expectedResponse = [
        { agencyId: moorland.agencyId, name: moorland.description },
        { agencyId: brixton.agencyId, name: brixton.description },
      ]
      const expectedActiveAgencies = [moorland.agencyId, brixton.agencyId]
      // Mock API request **once**
      fakeApiClient
        .get('/api/agency-switches/INCIDENTS')
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(200, expectedResponse satisfies ActiveAgency[])

      const activeAgenciesMiss = await apiClient.getAgenciesSwitchedOn()
      expect(activeAgenciesMiss).toEqual(expectedActiveAgencies)
    })
  })

  describe('getPecsRegions', () => {
    it('should create a map of PECS regions from api', async () => {
      fakeApiClient
        .get('/api/agencies/type/PECS')
        .query({ activeOnly: 'true' })
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(200, [pecsNorth, pecsSouth] satisfies Agency[])

      await expect(apiClient.getPecsRegions()).resolves.toEqual<Record<string, Agency>>({
        NORTH: pecsNorth,
        SOUTH: pecsSouth,
      })
    })
  })

  describe('getPhoto', () => {
    const prisonerNumber = 'A1234BC'

    it('should return an image', async () => {
      const imageData = Buffer.from('image data')
      fakeApiClient
        .get(`/api/bookings/offenderNo/${prisonerNumber}/image/data`)
        .query({ fullSizeImage: 'false' })
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(200, imageData, { 'Content-Type': 'image/jpeg' })

      const response = await apiClient.getPhoto(prisonerNumber)
      expect(response).toEqual(imageData)
    })

    it('should return null if not found', async () => {
      fakeApiClient
        .get(`/api/bookings/offenderNo/${prisonerNumber}/image/data`)
        .query({ fullSizeImage: 'false' })
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(404)

      const response = await apiClient.getPhoto(prisonerNumber)
      expect(response).toBeNull()
    })

    it('should return null if unauthorised', async () => {
      fakeApiClient
        .get(`/api/bookings/offenderNo/${prisonerNumber}/image/data`)
        .query({ fullSizeImage: 'false' })
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .thrice()
        .reply(403)

      const response = await apiClient.getPhoto(prisonerNumber)
      expect(response).toBeNull()
    })

    it('should throw when it receives another error', async () => {
      fakeApiClient
        .get(`/api/bookings/offenderNo/${prisonerNumber}/image/data`)
        .query({ fullSizeImage: 'false' })
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .thrice()
        .reply(500)

      await expect(apiClient.getPhoto(prisonerNumber)).rejects.toThrow('Internal Server Error')
    })
  })

  describe('getStaffDetails', () => {
    const { username } = staffMary

    it('should return an object', async () => {
      fakeApiClient
        .get(`/api/users/${username}`)
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(200, staffMary)

      const response = await apiClient.getStaffDetails(username)
      expect(response).toEqual(staffMary)
    })

    it('should return null if not found', async () => {
      fakeApiClient.get(`/api/users/${username}`).matchHeader('authorization', `Bearer ${accessToken}`).reply(404)

      const response = await apiClient.getStaffDetails(username)
      expect(response).toBeNull()
    })

    it('should throw when it receives another error', async () => {
      fakeApiClient
        .get(`/api/users/${username}`)
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .thrice()
        .reply(500)

      await expect(apiClient.getStaffDetails(username)).rejects.toThrow('Internal Server Error')
    })
  })

  describe('getIncidentTypeConfiguration', () => {
    describe('conversion of date fields', () => {
      it('should work for absent fields', async () => {
        fakeApiClient
          .get('/api/incidents/configuration')
          .query(true)
          .matchHeader('authorization', `Bearer ${accessToken}`)
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
          .matchHeader('authorization', `Bearer ${accessToken}`)
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

  describe('getReferenceCodes', () => {
    it('should convert date fields', async () => {
      fakeApiClient
        .get('/api/reference-domains/domains/DOM1/codes')
        .query(true)
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(200, [
          {
            domain: 'DOM1',
            code: 'SAMPL',
            description: 'Sample',
            listSeq: 1,
            activeFlag: 'N',
            expiredDate: '2022-08-20',
            systemDataFlag: 'N',
            subCodes: [
              {
                domain: 'DOM1',
                code: 'SUBSAMP',
                description: 'Sub-sample',
                listSeq: 1,
                activeFlag: 'N',
                expiredDate: '2022-08-20',
                systemDataFlag: 'N',
                subCodes: [],
              },
            ],
          },
        ] satisfies DatesAsStrings<ReferenceCode[]>)

      const codes = await apiClient.getReferenceCodes('DOM1')
      expect(codes).toHaveLength(1)
      const code = codes[0]
      expect(code.expiredDate).toBeInstanceOf(Date)
      expect(code.subCodes).toHaveLength(1)
      const subCode = code.subCodes[0]
      expect(subCode.expiredDate).toBeInstanceOf(Date)
    })

    it.each([
      { method: 'getIncidentTypes' as const, domain: 'IR_TYPE' },
      { method: 'getStaffInvolvementRoles' as const, domain: 'IR_STF_PART' },
      { method: 'getPrisonerInvolvementRoles' as const, domain: 'IR_OFF_PART' },
      { method: 'getPrisonerInvolvementOutcome' as const, domain: 'IR_OUTCOME' },
    ])('$method should sort codes', async ({ method, domain }) => {
      fakeApiClient
        .get(`/api/reference-domains/domains/${domain}/codes`)
        .query(true)
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(200, [
          {
            domain,
            code: 'SAMPL2',
            description: 'Sample 2',
            listSeq: 2,
            activeFlag: 'Y',
            systemDataFlag: 'N',
            subCodes: [],
          },
          {
            domain,
            code: 'SAMPL3',
            description: 'Sample 3',
            listSeq: undefined,
            activeFlag: 'Y',
            systemDataFlag: 'N',
            subCodes: [],
          },
          {
            domain,
            code: 'SAMPL1',
            description: 'Sample 1',
            listSeq: 1,
            activeFlag: 'Y',
            systemDataFlag: 'N',
            subCodes: [],
          },
        ] satisfies DatesAsStrings<ReferenceCode[]>)

      await expect(apiClient[method].call(apiClient)).resolves.toMatchObject([
        { code: 'SAMPL1', description: 'Sample 1' },
        { code: 'SAMPL2', description: 'Sample 2' },
        { code: 'SAMPL3', description: 'Sample 3' },
      ])
    })
  })
})
