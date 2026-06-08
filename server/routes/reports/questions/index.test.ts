import type { Express } from 'express'
import request, { type Agent } from 'supertest'

import { parseDateInput } from '../../../utils/parseDateTime'
import config from '../../../config'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { now } from '../../../testutils/fakeClock'
import { mockHandleReportEdit } from '../../testutils/handleReportEdit'
import {
  type AddOrUpdateQuestionWithResponsesRequest,
  IncidentReportingApi,
  type Question,
  type ReportWithDetails,
} from '../../../data/incidentReportingApi'
import { convertReportDates } from '../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { makeSimpleQuestion } from '../../../data/testData/incidentReportingJest'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { mockDataWarden, mockReportingOfficer, mockHqViewer, mockUnauthorisedUser } from '../../../data/testData/users'
import { ASSAULT_5 } from '../../../reportConfiguration/types/ASSAULT_5'
import { ATTEMPTED_ESCAPE_FROM_PRISON_1 } from '../../../reportConfiguration/types/ATTEMPTED_ESCAPE_FROM_PRISON_1'
import { DEATH_OTHER_1 } from '../../../reportConfiguration/types/DEATH_OTHER_1'
import { FIND_6 } from '../../../reportConfiguration/types/FIND_6'

jest.mock('../../../data/incidentReportingApi')
jest.mock('../actions/handleReportEdit')

const incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes()

  mockHandleReportEdit.withoutSideEffect()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Displaying questions and responses', () => {
  let agent: Agent

  // Report type/answers updated in each test
  let reportWithDetails: ReportWithDetails

  beforeEach(() => {
    agent = request.agent(app)

    reportWithDetails = convertReportDates(
      mockReport({
        type: 'FIND_6',
        reportReference: '6544',
        reportDateAndTime: now,
        withDetails: true,
      }),
    )
    reportWithDetails.questions = []
    incidentReportingApi.getReportWithDetailsById.mockResolvedValue(reportWithDetails)
  })

  function reportQuestionsUrl(createJourney: boolean): string {
    if (createJourney) {
      return `/create-report/${reportWithDetails.id}/questions`
    }
    return `/reports/${reportWithDetails.id}/questions`
  }

  describe.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])('$scenario', ({ createJourney }) => {
    it('should 404 if report is not found', () => {
      const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
      incidentReportingApi.getReportWithDetailsById.mockReset()
      incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

      return agent
        .get(reportQuestionsUrl(createJourney))
        .redirects(1)
        .expect(404)
        .expect(res => {
          expect(res.text).toContain('Page not found')
        })
    })

    it('should 404 if report’s incident type is inactive', () => {
      reportWithDetails.type = 'DAMAGE_1'
      return agent
        .get(reportQuestionsUrl(createJourney))
        .redirects(1)
        .expect(404)
        .expect(res => {
          expect(res.text).toContain('Page not found')
        })
    })

    it('multiple choices questions display "Select all that apply" hint text if no hint text provided', () => {
      return agent
        .get(reportQuestionsUrl(createJourney))
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(fieldNames(res.text)).toEqual(['67179'])
          expect(res.text).toContain('Select all that apply')
        })
    })

    describe('multiple choices questions, when hint text is defined', () => {
      beforeEach(() => {
        reportWithDetails.type = 'FIND_6'
        FIND_6.questions['67179'].questionHint = 'Bespoke hint text'
      })

      afterEach(() => {
        FIND_6.questions['67179'].questionHint = undefined
      })

      it('display bespoke hint text instead of "Select all that apply"', () => {
        return agent
          .get(reportQuestionsUrl(createJourney))
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(fieldNames(res.text)).toEqual(['67179'])
            expect(res.text).not.toContain('Select all that apply')
            expect(res.text).toContain('Bespoke hint text')
          })
      })
    })

    it('form is prefilled with report answers, including date', () => {
      reportWithDetails.type = 'DEATH_OTHER_1'
      reportWithDetails.questions = [
        {
          code: '45054',
          question: 'WERE THE POLICE INFORMED OF THE INCIDENT',
          label: 'Were the police informed of the incident?',
          additionalInformation: null,
          responses: [
            {
              code: '182204',
              response: 'YES',
              label: 'Yes',
              responseDate: now,
              additionalInformation: null,
              recordedBy: 'USER1',
              recordedAt: new Date(),
            },
          ],
        },
      ]

      return agent
        .get(reportQuestionsUrl(createJourney))
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(fieldNames(res.text)).toEqual(['45054'])
          expect(res.text).not.toContain('There is a problem')
          // 'YES' response to '45054' requires a date, this is displayed
          expect(res.text).toContain('name="45054-182204-date" type="text" value="5/12/2023"')
          expect(res.text).toContain('name="45054" type="radio" value="YES" checked')
        })
    })

    it('form is prefilled with report answers, multiple choices are selected', () => {
      reportWithDetails.type = 'FIND_6'
      reportWithDetails.questions = [
        makeSimpleQuestion(
          '67179',
          'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
          ['BOSS CHAIR', '218686'],
          ['DOG SEARCH', '218688'],
        ),
        makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', ['NO', '218710']),
      ]

      return agent
        .get(reportQuestionsUrl(createJourney))
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(fieldNames(res.text)).toEqual(['67179'])
          expect(res.text).not.toContain('There is a problem')
          expect(res.text).toContain('value="BOSS CHAIR" checked')
          expect(res.text).toContain('value="DOG SEARCH" checked')
        })
    })

    it('form is prefilled with report answers, multiple questions answered', () => {
      reportWithDetails.type = 'ASSAULT_5'
      reportWithDetails.questions = [
        makeSimpleQuestion('61279', 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT', [
          'POLICE REFERRAL',
          '213065',
        ]),
        makeSimpleQuestion('61280', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', ['NO', '213067']),
        makeSimpleQuestion('61281', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', ['NO', '213069']),
        makeSimpleQuestion('61282', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', ['NO', '213071']),
        makeSimpleQuestion('61283', 'IS THE LOCATION OF THE INCDENT KNOWN', ['YES', '213072']),
      ]

      return agent
        .get(reportQuestionsUrl(createJourney))
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('There is a problem')
          expect(fieldNames(res.text)).toEqual(['61279', '61280', '61281', '61282', '61283'])
          expect(res.text).toContain('name="61279" type="radio" value="POLICE REFERRAL" checked')
          expect(res.text).toContain('name="61280" type="radio" value="NO" checked')
          expect(res.text).toContain('name="61281" type="radio" value="NO" checked')
          expect(res.text).toContain('name="61282" type="radio" value="NO" checked')
          expect(res.text).toContain('name="61283" type="radio" value="YES" checked')
        })
    })

    describe('Page titles and question numbering', () => {
      it('should show question numbers on first page', () => {
        reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_PRISON_1'
        return agent
          .get(reportQuestionsUrl(createJourney))
          .redirects(1)
          .expect(res => {
            expect(res.text).toContain('1. Were the police informed of the incident?')
            expect(res.text).toContain('2. The incident is subject to')
            expect(res.text).toContain('3. Is any member of staff facing disciplinary charges?')
            expect(res.text).toContain('4. Is there any media interest in this incident?')
            expect(res.text).toContain('5. Has the prison service press office been informed?')

            if (createJourney) {
              // back link points to staff involvements
              expect(res.text).toContain(`"/create-report/${reportWithDetails.id}/staff"`)
            } else {
              // back link points to report
              expect(res.text).toContain(`"/reports/${reportWithDetails.id}"`)
            }
          })
      })

      it('should show question numbers on second page', async () => {
        const questionsResponse: Question[] = [
          makeSimpleQuestion('44769', 'WERE THE POLICE INFORMED OF THE INCIDENT', ['NO', '181153']),
          makeSimpleQuestion('44919', 'THE INCIDENT IS SUBJECT TO', ['INVESTIGATION INTERNALLY', '181649']),
          makeSimpleQuestion('45033', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', ['NO', '182083']),
          makeSimpleQuestion('44636', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', ['NO', '180711']),
          makeSimpleQuestion('44749', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', ['NO', '181103']),
        ]
        reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_PRISON_1'
        reportWithDetails.questions = questionsResponse
        incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)

        await agent
          .get(reportQuestionsUrl(createJourney))
          .redirects(1)
          .expect(res => {
            expect(res.redirects.at(-1)).toMatch(/\/44769$/)
          })
        await agent
          .post(`${reportQuestionsUrl(createJourney)}/44769`)
          .send({
            '44769': ['NO'],
            '44919': ['INVESTIGATION INTERNALLY'],
            '45033': ['NO'],
            '44636': ['NO'],
            '44749': ['NO'],
          })
          .redirects(1)
          .expect(res => {
            expect(res.redirects.at(-1)).toMatch(/\/44594$/)
          })

        return agent
          .get(`${reportQuestionsUrl(createJourney)}/44594`)
          .redirects(1)
          .expect(res => {
            expect(res.text).toContain('6. Where was the prisoner prior to the start of the attempted escape?')

            // back link points to previous page
            if (createJourney) {
              expect(res.text).toContain(`"/create-report/${reportWithDetails.id}/questions/44769"`)
            } else {
              expect(res.text).toContain(`"/reports/${reportWithDetails.id}/questions/44769"`)
            }
          })
      })

      it('should show correct title for first page with one question', () => {
        return agent
          .get(reportQuestionsUrl(createJourney))
          .redirects(1)
          .expect(res => {
            expect(res.text).toContain('About the find of illicit items – question 1')
          })
      })

      it('should show correct title for a later page with one question', async () => {
        const questionsResponse: Question[] = [
          {
            code: '67179',
            question: 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
            label: 'Describe how the item was found (select all that apply)',
            additionalInformation: null,
            responses: [
              {
                code: '218687',
                response: 'CELL SEARCH',
                label: 'Cell search',
                responseDate: null,
                additionalInformation: null,
                recordedBy: 'USER_1',
                recordedAt: new Date(),
              },
            ],
          },
        ]
        reportWithDetails.questions = questionsResponse
        incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)

        await agent
          .get(reportQuestionsUrl(createJourney))
          .redirects(1)
          .expect(res => {
            expect(res.redirects.at(-1)).toMatch(/\/67179$/)
          })
        await agent
          .post(`${reportQuestionsUrl(createJourney)}/67179`)
          .send({
            '67179': ['CELL SEARCH'],
          })
          .redirects(1)
          .expect(res => {
            expect(res.redirects.at(-1)).toMatch(/\/67180$/)
          })

        return agent
          .get(`${reportQuestionsUrl(createJourney)}/67180`)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('About the find of illicit items – question 2')
          })
      })

      it('should show correct title for a page with several questions', () => {
        reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_PRISON_1'
        incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce([])
        return agent
          .get(reportQuestionsUrl(createJourney))
          .redirects(1)
          .expect(res => {
            expect(res.text).toContain('About the attempted escape from establishment – questions 1 to 5')
          })
      })
    })

    describe('Single-answer questions', () => {
      /**
       * RELEASE_IN_ERROR_1 questions 45184 ("What date was the error identified?")
       * and 45185 ("What was the category of the person?") each have exactly one active answer.
       *
       * After groupSteps merging, questions 45182+45183+45184+45185 end up on the same
       * form wizard step at URL /45182 (7+8+1+1 = 17 answers ≤ MAX_ANSWERS_PER_PAGE=20).
       * Questions 45179+45180+45181 are on the prior step at URL /45179.
       *
       * Pre-requisite: provide answers for step /45179 (questions 45179→45181) so that
       * the form wizard allows access to step /45182.
       */
      function answeredQuestionsOnStep45179(): Question[] {
        return [
          makeSimpleQuestion('45179', 'HOW WAS THIS PERSON RELEASED', ['Bail', '183020']),
          {
            code: '45180',
            question: 'WHERE DID THE RELEASE OCCUR FROM',
            label: 'Where did the release occur from?',
            additionalInformation: null,
            responses: [
              {
                code: '183026',
                response: 'Establishment : Enter name',
                label: 'Establishment : enter name',
                responseDate: null,
                additionalInformation: 'Test prison',
                recordedBy: 'USER1',
                recordedAt: now,
              },
            ],
          },
          makeSimpleQuestion('45181', 'WHAT WAS THE NATURE OF THE INCIDENT', ['Wrong person released', '183029']),
        ]
      }

      it('single-answer date/comment questions are rendered directly without radio buttons', () => {
        reportWithDetails.type = 'RELEASE_IN_ERROR_1'
        reportWithDetails.questions = answeredQuestionsOnStep45179()

        // Step /45182 is the merged step containing questions 45182, 45183, 45184, 45185
        return agent
          .get(`${reportQuestionsUrl(createJourney)}/45182`)
          .redirects(1)
          .expect(200)
          .expect(res => {
            // Single-answer main fields must NOT render radio buttons
            expect(res.text).not.toContain('name="45184" type="radio"')
            expect(res.text).not.toContain('name="45185" type="radio"')
            // The date and comment sub-fields must be rendered directly (no conditional wrapper)
            expect(res.text).toContain('name="45184-183055-date"')
            expect(res.text).toContain('name="45185-183056-comment"')
            // Question labels are shown as fieldset legends
            expect(res.text).toContain('What date was the error identified?')
            expect(res.text).toContain('What was the category of the person?')
          })
      })

      it('single-answer questions are prefilled from existing report answers', () => {
        reportWithDetails.type = 'RELEASE_IN_ERROR_1'
        reportWithDetails.questions = [
          ...answeredQuestionsOnStep45179(),
          makeSimpleQuestion(
            '45182',
            'WHAT ACTION IS BEING TAKEN TO RETURN THE PERSON TO CUSTODY BY THE ESTABLISHMENT',
            ['Recall procedures', '183040'],
          ),
          makeSimpleQuestion('45183', 'HOW WAS THE ERROR IDENTIFIED', ['Contact from courts', '183048']),
          {
            code: '45184',
            question: 'WHAT DATE WAS THE ERROR IDENTIFIED',
            label: 'What date was the error identified?',
            additionalInformation: null,
            responses: [
              {
                code: '183055',
                response: 'Date:',
                label: 'Date:',
                responseDate: now,
                additionalInformation: null,
                recordedBy: 'USER1',
                recordedAt: now,
              },
            ],
          },
          {
            code: '45185',
            question: 'WHAT WAS THE CATEGORY OF THE PERSON',
            label: 'What was the category of the person?',
            additionalInformation: null,
            responses: [
              {
                code: '183056',
                response: 'Enter details:',
                label: 'Enter details:',
                responseDate: null,
                additionalInformation: 'Category A',
                recordedBy: 'USER1',
                recordedAt: now,
              },
            ],
          },
        ]

        // Step /45182 is the merged step containing questions 45182, 45183, 45184, 45185
        return agent
          .get(`${reportQuestionsUrl(createJourney)}/45182`)
          .redirects(1)
          .expect(200)
          .expect(res => {
            // The date and comment are pre-filled from saved answers
            expect(res.text).toContain('name="45184-183055-date" type="text" value="5/12/2023"')
            expect(res.text).toContain('value="Category A"')
          })
      })
    })

    describe('Moving between question pages', () => {
      it.each([
        { scenario: 'no responses so far', someResponses: false },
        { scenario: 'some responses have been entered', someResponses: true },
      ])(
        'should redirect to first page of questions from form wizard entrypoint when $scenario',
        ({ someResponses }) => {
          reportWithDetails.type = 'FIND_6'
          reportWithDetails.questions = someResponses
            ? [
                makeSimpleQuestion('67179', 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)', [
                  'CELL SEARCH',
                  '218687',
                ]),
              ]
            : []
          return agent
            .get(reportQuestionsUrl(createJourney))
            .redirects(1)
            .expect(200)
            .expect(res => {
              expect(res.redirects.at(-1)).toMatch(/\/questions\/67179$/)
            })
        },
      )

      it.each(['67179', '67180'])(
        'should allow skipping directly to any page that has been started (sample question %d)',
        answeredQuestionCode => {
          reportWithDetails.type = 'FIND_6'
          reportWithDetails.questions = [
            makeSimpleQuestion('67179', 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)', [
              'CELL SEARCH',
              '218687',
            ]),
            makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', ['NO', '218710']),
          ]
          return agent
            .get(`${reportQuestionsUrl(createJourney)}/${answeredQuestionCode}`)
            .redirects(10)
            .expect(200)
            .expect(res => {
              expect(res.redirects).toEqual([])
            })
        },
      )

      it('should allow skipping directly to the next page after existing responses', () => {
        reportWithDetails.type = 'FIND_6'
        reportWithDetails.questions = [
          makeSimpleQuestion('67179', 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)', [
            'CELL SEARCH',
            '218687',
          ]),
          makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', ['NO', '218710']),
        ]
        return agent
          .get(`${reportQuestionsUrl(createJourney)}/67182`)
          .redirects(10)
          .expect(200)
          .expect(res => {
            expect(res.redirects).toEqual([])
          })
      })

      it('should redirect to first page of questions if one tries to skip ahead', () => {
        reportWithDetails.type = 'FIND_6'
        reportWithDetails.questions = [
          makeSimpleQuestion('67179', 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)', [
            'CELL SEARCH',
            '218687',
          ]),
          makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', ['NO', '218710']),
        ]
        return agent
          .get(`${reportQuestionsUrl(createJourney)}/67184`)
          .redirects(10)
          .expect(200)
          .expect(res => {
            expect(res.redirects.at(-1)).toMatch(/\/questions\/67179$/)
          })
      })
    })
  })
})

describe('Editing reports of date-retired incident types', () => {
  // Regression: a type that is only *date*-retired (its registry `active` boolean is still true,
  // e.g. FOOD_REFUSAL_1 / CLOSE_DOWN_SEARCH_1 after the 2026-07-01 switch-over) must keep its
  // existing reports editable. Only genuinely inactive types (boolean false, e.g. DAMAGE_1) 404.
  let agent: Agent
  let reportWithDetails: ReportWithDetails

  const originalActiveDate = config.incidentTypeActiveDate

  beforeEach(() => {
    // Preview the post-switch-over state so the date window would consider v1 retired
    config.incidentTypeActiveDate = '2026-07-01'

    app = appWithAllRoutes()
    agent = request.agent(app)

    reportWithDetails = convertReportDates(
      mockReport({
        type: 'FOOD_REFUSAL_1',
        reportReference: '6544',
        reportDateAndTime: now,
        withDetails: true,
      }),
    )
    reportWithDetails.questions = []
    incidentReportingApi.getReportWithDetailsById.mockResolvedValue(reportWithDetails)
  })

  afterEach(() => {
    config.incidentTypeActiveDate = originalActiveDate
  })

  it.each(['FOOD_REFUSAL_1', 'CLOSE_DOWN_SEARCH_1'] as const)(
    'still allows editing questions of date-retired type %s',
    type => {
      reportWithDetails.type = type
      return agent.get(`/reports/${reportWithDetails.id}/questions`).redirects(1).expect(200)
    },
  )

  it('still 404s for a genuinely inactive type', () => {
    reportWithDetails.type = 'DAMAGE_1'
    return agent
      .get(`/reports/${reportWithDetails.id}/questions`)
      .redirects(1)
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })
})

describe('Submitting questions’ responses', () => {
  let agent: Agent

  // Report type/answers updated in each test
  const reportWithDetails = convertReportDates(
    mockReport({
      type: 'FIND_6',
      reportReference: '6544',
      reportDateAndTime: now,
      withDetails: true,
    }),
  )
  reportWithDetails.questions = []

  beforeEach(() => {
    agent = request.agent(app)
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)
  })

  function reportQuestionsUrl(createJourney: boolean): string {
    if (createJourney) {
      return `/create-report/${reportWithDetails.id}/questions`
    }
    return `/reports/${reportWithDetails.id}/questions`
  }

  describe.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])('$scenario', ({ createJourney }) => {
    it('submitting when single-choice question not answered shows errors', () => {
      reportWithDetails.type = 'DEATH_OTHER_1'
      const firstQuestionStep = DEATH_OTHER_1.startingQuestionCode
      const followingStep = '44434'
      const submittedAnswers = {
        // 'WERE THE POLICE INFORMED OF THE INCIDENT',
        '45054': '',
      }
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)

      const postUrl = `${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`
      return agent
        .post(postUrl)
        .send(submittedAnswers)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).not.toHaveBeenCalled()
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).not.toHaveBeenCalled()
          mockHandleReportEdit.expectNotCalled()
          expect(res.text).toContain('There is a problem')
          expect(fieldNames(res.text)).toEqual(['45054'])
          expect(res.text).toContain(
            '<a href="#45054-item">Select an answer for ‘Were the police informed of the incident?’</a>',
          )
          expect(res.redirects[0]).toMatch(postUrl)
          expect(res.redirects[0]).not.toMatch(`/${followingStep}`)
        })
    })

    it('submitting when multiple-choice question not answered shows errors', () => {
      reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_PRISON_1'
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)
      const submittedAnswers = {
        // WERE THE POLICE INFORMED OF THE INCIDENT
        '44769': 'NO',
        // THE INCIDENT IS SUBJECT TO
        // missing selection
        '44919': '',
        // IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES
        '45033': 'NO',
        // IS THERE ANY MEDIA INTEREST IN THIS INCIDENT
        '44636': 'NO',
        // HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED
        '44749': 'NO',
      }

      const postUrl = `${reportQuestionsUrl(createJourney)}/44769`
      return agent
        .post(postUrl)
        .send(submittedAnswers)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).not.toHaveBeenCalled()
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).not.toHaveBeenCalled()
          mockHandleReportEdit.expectNotCalled()
          expect(res.text).toContain('There is a problem')
          expect(fieldNames(res.text)).toEqual(['44769', '44919', '45033', '44636', '44749'])
          expect(res.text).toContain(
            '<a href="#44919-item">Select one or more options for ‘The incident is subject to’</a>',
          )
          expect(res.redirects[0]).toMatch(postUrl)
          expect(res.redirects[0]).not.toMatch('/44594')
        })
    })

    it('submitting with missing comment shows errors', () => {
      const questionsResponse: Question[] = [
        makeSimpleQuestion('44769', 'WERE THE POLICE INFORMED OF THE INCIDENT', ['NO', '181153']),
        makeSimpleQuestion('44919', 'THE INCIDENT IS SUBJECT TO', ['INVESTIGATION INTERNALLY', '181649']),
        makeSimpleQuestion('45033', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', ['NO', '182083']),
        makeSimpleQuestion('44636', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', ['NO', '180711']),
        makeSimpleQuestion('44749', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', ['NO', '181103']),
      ]
      reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_PRISON_1'
      reportWithDetails.questions = questionsResponse
      const submittedAnswers = {
        // 'WHERE WAS THE PRISONER PRIOR TO THE START OF THE ATTEMPTED ESCAPE',
        '44594': 'CELL (ENTER LOCATION)',
        // missing comment
        '44594-180573-comment': '',
      }
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)

      const postUrl = `${reportQuestionsUrl(createJourney)}/44594`
      return agent
        .post(postUrl)
        .send(submittedAnswers)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).not.toHaveBeenCalled()
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).not.toHaveBeenCalled()
          mockHandleReportEdit.expectNotCalled()
          expect(res.text).toContain('There is a problem')
          expect(fieldNames(res.text)).toEqual(['44594'])
          expect(res.text).toContain(
            '<a href="#44594-180573-comment">Enter a comment for ‘Where was the prisoner prior to the start of the attempted escape?’</a>',
          )
          expect(res.redirects[0]).toMatch(postUrl)
        })
    })

    it('submitting with invalid date shows errors', () => {
      reportWithDetails.type = 'DEATH_OTHER_1'
      const firstQuestionStep = DEATH_OTHER_1.startingQuestionCode
      const followingStep = '44434'
      const submittedAnswers = {
        // 'WERE THE POLICE INFORMED OF THE INCIDENT',
        '45054': 'YES',
        // invalid date
        '45054-182204-date': 'Thu 27th Nov, yesterday',
      }
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)

      const postUrl = `${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`
      return agent
        .post(postUrl)
        .send(submittedAnswers)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).not.toHaveBeenCalled()
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).not.toHaveBeenCalled()
          mockHandleReportEdit.expectNotCalled()
          expect(res.text).toContain('There is a problem')
          expect(fieldNames(res.text)).toEqual(['45054'])
          expect(res.text).toContain(
            '<a href="#45054-182204-date">Enter a valid date for ‘Were the police informed of the incident?’</a>',
          )
          expect(res.redirects[0]).toMatch(postUrl)
          expect(res.redirects[0]).not.toMatch(`/${followingStep}`)
        })
    })

    it('submitting with missing date shows errors', () => {
      reportWithDetails.type = 'DEATH_OTHER_1'
      const firstQuestionStep = DEATH_OTHER_1.startingQuestionCode
      const followingStep = '44434'
      const submittedAnswers = {
        // 'WERE THE POLICE INFORMED OF THE INCIDENT',
        '45054': 'YES',
        // invalid date
        '45054-182204-date': '',
      }
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)

      const postUrl = `${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`
      return agent
        .post(postUrl)
        .send(submittedAnswers)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).not.toHaveBeenCalled()
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).not.toHaveBeenCalled()
          mockHandleReportEdit.expectNotCalled()
          expect(res.text).toContain('There is a problem')
          expect(fieldNames(res.text)).toEqual(['45054'])
          expect(res.text).toContain(
            '<a href="#45054-182204-date">The date for ‘Were the police informed of the incident?’ cannot be empty</a>',
          )
          expect(res.redirects[0]).toMatch(postUrl)
          expect(res.redirects[0]).not.toMatch(`/${followingStep}`)
        })
    })

    it('submitting answers requiring dates', () => {
      reportWithDetails.type = 'DEATH_OTHER_1'
      const firstQuestionStep = DEATH_OTHER_1.startingQuestionCode
      const followingStep = '44434'
      const responseDate = '6/12/2023'
      const submittedAnswers = {
        // 'WERE THE POLICE INFORMED OF THE INCIDENT',
        '45054': 'YES',
        '45054-182204-comment': 'ignored',
        '45054-182204-date': responseDate,
      }
      const expectedRequest: AddOrUpdateQuestionWithResponsesRequest[] = [
        {
          code: '45054',
          question: 'WERE THE POLICE INFORMED OF THE INCIDENT',
          label: 'Were the police informed of the incident?',
          additionalInformation: null,
          responses: [
            {
              code: '182204',
              response: 'YES',
              label: 'Yes',
              responseDate: parseDateInput(responseDate),
              additionalInformation: null,
            },
          ],
        },
      ]

      const questionsResponse: Question[] = [
        {
          code: '45054',
          question: 'WERE THE POLICE INFORMED OF THE INCIDENT',
          label: 'Were the police informed of the incident?',
          additionalInformation: null,
          responses: [
            {
              code: '182204',
              response: 'YES',
              label: 'Yes',
              responseDate: parseDateInput(responseDate),
              recordedAt: new Date(),
              recordedBy: 'USER_1',
              additionalInformation: null,
            },
          ],
        },
      ]
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)
      reportWithDetails.questions = questionsResponse

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`)
        .send(submittedAnswers)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).toHaveBeenCalledWith(
            reportWithDetails.id,
            expectedRequest,
          )
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).not.toHaveBeenCalled()
          mockHandleReportEdit.expectCalled()
          expect(res.text).not.toContain('There is a problem')
          expect(res.redirects[0]).toMatch(`/${followingStep}`)
        })
    })

    it('submitting multiple answers to a question', () => {
      reportWithDetails.type = 'FIND_6'
      const firstQuestionStep = FIND_6.startingQuestionCode
      const followingStep = '67180'
      const submittedAnswers = {
        // 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)'
        '67179': ['BOSS CHAIR', 'DOG SEARCH'],
      }
      const expectedRequest: AddOrUpdateQuestionWithResponsesRequest[] = [
        {
          code: '67179',
          question: 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
          label: 'Describe how the item was found',
          additionalInformation: null,
          responses: [
            {
              code: '218686',
              response: 'BOSS CHAIR',
              label: 'Boss chair',
              responseDate: null,
              additionalInformation: null,
            },
            {
              code: '218688',
              response: 'DOG SEARCH',
              label: 'Dog search',
              responseDate: null,
              additionalInformation: null,
            },
          ],
        },
      ]

      const questionsResponse: Question[] = [
        makeSimpleQuestion(
          '67179',
          'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
          ['BOSS CHAIR', '218686'],
          ['DOG SEARCH', '218688'],
        ),
      ]
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)
      reportWithDetails.questions = questionsResponse

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`)
        .send(submittedAnswers)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).toHaveBeenCalledWith(
            reportWithDetails.id,
            expectedRequest,
          )
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).not.toHaveBeenCalled()
          mockHandleReportEdit.expectCalled()
          expect(res.text).not.toContain('There is a problem')
          expect(res.redirects[0]).toMatch(`/${followingStep}`)
        })
    })

    it('submitting responses to multiple questions', () => {
      reportWithDetails.type = 'ASSAULT_5'
      const firstQuestionStep = ASSAULT_5.startingQuestionCode
      const followingStep = '61285'
      const submittedAnswers = {
        // 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT'
        '61279': 'POLICE REFERRAL',
        // 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES'
        '61280': 'YES',
        // 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT'
        '61281': 'NO',
        // 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED'
        '61282': 'YES',
        // 'IS THE LOCATION OF THE INCDENT KNOWN'
        '61283': 'NO',
      }
      const expectedRequest: AddOrUpdateQuestionWithResponsesRequest[] = [
        {
          code: '61279',
          question: 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT',
          label: 'What was the main management outcome of the incident?',
          additionalInformation: null,
          responses: [
            {
              code: '213065',
              response: 'POLICE REFERRAL',
              label: 'Police referral',
              responseDate: null,
              additionalInformation: null,
            },
          ],
        },
        {
          code: '61280',
          question: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
          label: 'Is any member of staff facing disciplinary charges?',
          additionalInformation: null,
          responses: [
            {
              code: '213066',
              response: 'YES',
              label: 'Yes',
              responseDate: null,
              additionalInformation: null,
            },
          ],
        },
        {
          code: '61281',
          question: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
          label: 'Is there any media interest in this incident?',
          additionalInformation: null,
          responses: [
            {
              code: '213069',
              response: 'NO',
              label: 'No',
              responseDate: null,
              additionalInformation: null,
            },
          ],
        },
        {
          code: '61282',
          question: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
          label: 'Has the prison service press office been informed?',
          additionalInformation: null,
          responses: [
            {
              code: '213070',
              response: 'YES',
              label: 'Yes',
              responseDate: null,
              additionalInformation: null,
            },
          ],
        },
        {
          code: '61283',
          question: 'IS THE LOCATION OF THE INCDENT KNOWN',
          label: 'Is the location of the incident known?',
          additionalInformation: null,
          responses: [
            {
              code: '213073',
              response: 'NO',
              label: 'No',
              responseDate: null,
              additionalInformation: null,
            },
          ],
        },
      ]

      const questionsResponse: Question[] = [
        makeSimpleQuestion('61279', 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT', [
          'POLICE REFERRAL',
          '213065',
        ]),
        makeSimpleQuestion('61280', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', ['YES', '213066']),
        makeSimpleQuestion('61281', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', ['NO', '213069']),
        makeSimpleQuestion('61282', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', ['YES', '213070']),
        // NOTE: Answer changed from 'YES' to 'NO'
        makeSimpleQuestion('61283', 'IS THE LOCATION OF THE INCDENT KNOWN', ['NO', '213073']),
        // NOTE: This question will need to be deleted.
        // Answer to previous question changed so branch where this
        // sits is no longer entered now
        makeSimpleQuestion('61284', 'WHAT WAS THE LOCATION OF THE INCIDENT', ['GYM', '213083']),
        // NOTE: This question asked regardless of branching, will be retained
        makeSimpleQuestion('61285', 'WAS THIS A SEXUAL ASSAULT', ['NO', '213112']),
      ]
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)
      reportWithDetails.questions = questionsResponse

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`)
        .send(submittedAnswers)
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).toHaveBeenCalledWith(
            reportWithDetails.id,
            expectedRequest,
          )
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).toHaveBeenCalledWith(reportWithDetails.id, [
            '61284',
          ])
          mockHandleReportEdit.expectCalled()
          expect(res.text).not.toContain('There is a problem')
          expect(res.redirects[0]).toMatch(`/${followingStep}`)
        })
    })

    it('should allow exiting to report view when saving', () => {
      const questionsResponse: Question[] = [
        makeSimpleQuestion('44769', 'WERE THE POLICE INFORMED OF THE INCIDENT', ['NO', '181153']),
        makeSimpleQuestion('44919', 'THE INCIDENT IS SUBJECT TO', ['INVESTIGATION INTERNALLY', '181649']),
        makeSimpleQuestion('45033', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', ['NO', '182083']),
        makeSimpleQuestion('44636', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', ['NO', '180711']),
        makeSimpleQuestion('44749', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', ['NO', '181103']),
      ]
      reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_PRISON_1'
      reportWithDetails.questions = questionsResponse
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/44769`)
        .send({
          '44769': ['NO'],
          '44919': ['INVESTIGATION INTERNALLY'],
          '45033': ['NO'],
          '44636': ['NO'],
          '44749': ['NO'],
          formAction: 'exit',
        })
        .expect(302)
        .expect(res => {
          expect(res.redirect).toBe(true)
          expect(res.header.location).toEqual(`/reports/${reportWithDetails.id}`)
        })
    })

    it('should redirect to report view once all questions are answered', async () => {
      // simulate last 1-question page being unanswered
      reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_PRISON_1'
      const questionsResponse: Question[] = [
        makeSimpleQuestion('44769', 'WERE THE POLICE INFORMED OF THE INCIDENT', ['NO', '181153']),
        makeSimpleQuestion('44919', 'THE INCIDENT IS SUBJECT TO', ['INVESTIGATION INTERNALLY', '181649']),
        makeSimpleQuestion('45033', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', ['NO', '182083']),
        makeSimpleQuestion('44636', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', ['NO', '180711']),
        makeSimpleQuestion('44749', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', ['NO', '181103']),
        makeSimpleQuestion('44594', 'WHERE WAS THE PRISONER PRIOR TO THE START OF THE ATTEMPTED ESCAPE', [
          'ADMINISTRATION',
          '180575',
        ]),
        makeSimpleQuestion('44545', 'DID PRISONER GAIN ACCESS TO THE EXTERNAL PERIMETER', ['NO', '180421']),
        makeSimpleQuestion('44441', 'DID THE PRISONER ATTEMPT TO GAIN ACCESS TO THE EXTERNAL PERIMETER', [
          'NO',
          '179954',
        ]),
        makeSimpleQuestion('44746', 'ARE THE GROUNDS PATROLLED BY DOGS', ['NO', '181096']),
        makeSimpleQuestion('44595', 'WAS AN AIRCRAFT INVOLVED', ['NO', '180592']),
        makeSimpleQuestion('44983', 'WAS OUTSIDE ASSISTANCE INVOLVED IN THE ATTEMPTED ESCAPE', ['NO', '181911']),
        makeSimpleQuestion('44320', 'WERE ANY WEAPONS USED', ['NO', '179561']),
        makeSimpleQuestion('44731', 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT', ['NO', '181059']),
        makeSimpleQuestion('45073', 'HOW WAS THE ESCAPE ATTEMPT DISCOVERED', ['STAFF VIGILANCE', '182267']),
        makeSimpleQuestion('44349', 'HOW WAS THE ESCAPE ATTEMPT FOILED', ['STAFF INTERVENTION', '179676']),
        makeSimpleQuestion('44447', 'WAS DAMAGE CAUSED TO PRISON PROPERTY', ['NO', '179978']),
        makeSimpleQuestion('44863', 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN DURING THE INCIDENT?', ['NO', '181444']),
      ]
      reportWithDetails.questions = questionsResponse.slice(0, -1)
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/44863`)
        .send({ '44863': 'NO' })
        .expect(302)
        .expect(res => {
          expect(res.redirect).toBe(true)
          expect(res.header.location).toEqual(`/reports/${reportWithDetails.id}`)
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).toHaveBeenCalledWith(reportWithDetails.id, [
            expect.objectContaining({
              code: '44863',
              question: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN DURING THE INCIDENT?',
              responses: [expect.objectContaining({ response: 'NO' })],
            }),
          ])
        })
    })

    it('should remain on last page if incorrectly answered', async () => {
      // simulate last 1-question page being unanswered
      reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_PRISON_1'
      reportWithDetails.questions = [
        makeSimpleQuestion('44769', 'WERE THE POLICE INFORMED OF THE INCIDENT', ['NO', '181153']),
        makeSimpleQuestion('44919', 'THE INCIDENT IS SUBJECT TO', ['INVESTIGATION INTERNALLY', '181649']),
        makeSimpleQuestion('45033', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', ['NO', '182083']),
        makeSimpleQuestion('44636', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', ['NO', '180711']),
        makeSimpleQuestion('44749', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', ['NO', '181103']),
        makeSimpleQuestion('44594', 'WHERE WAS THE PRISONER PRIOR TO THE START OF THE ATTEMPTED ESCAPE', [
          'ADMINISTRATION',
          '180575',
        ]),
        makeSimpleQuestion('44545', 'DID PRISONER GAIN ACCESS TO THE EXTERNAL PERIMETER', ['NO', '180421']),
        makeSimpleQuestion('44441', 'DID THE PRISONER ATTEMPT TO GAIN ACCESS TO THE EXTERNAL PERIMETER', [
          'NO',
          '179954',
        ]),
        makeSimpleQuestion('44746', 'ARE THE GROUNDS PATROLLED BY DOGS', ['NO', '181096']),
        makeSimpleQuestion('44595', 'WAS AN AIRCRAFT INVOLVED', ['NO', '180592']),
        makeSimpleQuestion('44983', 'WAS OUTSIDE ASSISTANCE INVOLVED IN THE ATTEMPTED ESCAPE', ['NO', '181911']),
        makeSimpleQuestion('44320', 'WERE ANY WEAPONS USED', ['NO', '179561']),
        makeSimpleQuestion('44731', 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT', ['NO', '181059']),
        makeSimpleQuestion('45073', 'HOW WAS THE ESCAPE ATTEMPT DISCOVERED', ['STAFF VIGILANCE', '182267']),
        makeSimpleQuestion('44349', 'HOW WAS THE ESCAPE ATTEMPT FOILED', ['STAFF INTERVENTION', '179676']),
        makeSimpleQuestion('44447', 'WAS DAMAGE CAUSED TO PRISON PROPERTY', ['NO', '179978']),
      ]
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(reportWithDetails)

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/44863`)
        .send({})
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).not.toHaveBeenCalled()
          expect(res.redirects[0]).toMatch('/44863')
        })
    })

    it('should use incident type’s field order', () => {
      // NB: this type’s questions are not in numeric order on page 1
      reportWithDetails.type = 'ATTEMPTED_ESCAPE_FROM_PRISON_1'
      const firstQuestionStep = ATTEMPTED_ESCAPE_FROM_PRISON_1.startingQuestionCode
      const submittedAnswers = {
        // WERE THE POLICE INFORMED OF THE INCIDENT
        '44769': 'NO',
        // THE INCIDENT IS SUBJECT TO
        '44919': ['INVESTIGATION INTERNALLY'],
        // IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES
        '45033': 'NO',
        // IS THERE ANY MEDIA INTEREST IN THIS INCIDENT
        '44636': 'NO',
        // HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED
        '44749': 'NO',
      }
      const questionsResponse: Question[] = [
        makeSimpleQuestion('44769', 'WERE THE POLICE INFORMED OF THE INCIDENT', ['NO', '181153']),
        makeSimpleQuestion('44919', 'THE INCIDENT IS SUBJECT TO', ['INVESTIGATION INTERNALLY', '181649']),
        makeSimpleQuestion('45033', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', ['NO', '182083']),
        makeSimpleQuestion('44636', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', ['NO', '180711']),
        makeSimpleQuestion('44749', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', ['NO', '181103']),
      ]
      reportWithDetails.questions = questionsResponse
      incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce(questionsResponse)

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`)
        .send(submittedAnswers)
        .redirects(1)
        .expect(res => {
          expect(res.redirects[0]).toMatch('/44594')
          expect(incidentReportingApi.addOrUpdateQuestionsWithResponses).toHaveBeenCalledWith(expect.any(String), [
            expect.objectContaining({ code: '44769' }),
            expect.objectContaining({ code: '44919' }),
            expect.objectContaining({ code: '45033' }),
            expect.objectContaining({ code: '44636' }),
            expect.objectContaining({ code: '44749' }),
          ])
        })
    })

    it.each([
      {
        scenario: 'adding/updating questions',
        setupFailure() {
          const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
          incidentReportingApi.addOrUpdateQuestionsWithResponses.mockRejectedValueOnce(error)
        },
        extraChecks() {
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).not.toHaveBeenCalled()
        },
      },
      {
        scenario: 'deleting old questions',
        setupFailure: () => {
          incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce([])
          const error = mockThrownError(mockErrorResponse({ status: 500, message: 'External problem' }), 500)
          incidentReportingApi.deleteQuestionsAndTheirResponses.mockRejectedValueOnce(error)
        },
        extraChecks() {
          mockHandleReportEdit.expectCalled()
        },
      },
      {
        scenario: '(possible) status change',
        setupFailure: () => {
          incidentReportingApi.addOrUpdateQuestionsWithResponses.mockResolvedValueOnce([])
          mockHandleReportEdit.failure()
        },
        extraChecks() {
          expect(incidentReportingApi.deleteQuestionsAndTheirResponses).not.toHaveBeenCalled()
        },
      },
    ])('should show an error if API rejects $scenario', ({ setupFailure, extraChecks }) => {
      reportWithDetails.type = 'FIND_6'
      const firstQuestionStep = FIND_6.startingQuestionCode
      const submittedAnswers = {
        // 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)'
        '67179': ['BOSS CHAIR', 'DOG SEARCH'],
      }

      setupFailure()

      return agent
        .post(`${reportQuestionsUrl(createJourney)}/${firstQuestionStep}`)
        .send(submittedAnswers)
        .redirects(1)
        .expect(res => {
          expect(res.text).toContain('Sorry, there is a problem with the service')
          // NB: because each page is an entrypoint, cannot use form wizard to display error summary
          extraChecks()
        })
    })
  })
})

describe('Question editing permissions', () => {
  // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

  const reportWithDetails = convertReportDates(
    mockReport({
      reportReference: '6544',
      reportDateAndTime: now,
      withDetails: true,
    }),
  )
  reportWithDetails.questions = []

  beforeEach(() => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValue(reportWithDetails)
  })

  function reportQuestionsUrl(createJourney: boolean): string {
    if (createJourney) {
      return `/create-report/${reportWithDetails.id}/questions`
    }
    return `/reports/${reportWithDetails.id}/questions`
  }

  const granted = 'granted' as const
  const denied = 'denied' as const

  describe.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])('$scenario', ({ createJourney }) => {
    it.each([
      { userType: 'reporting officer', user: mockReportingOfficer, action: granted },
      { userType: 'data warden', user: mockDataWarden, action: denied },
      { userType: 'HQ view-only user', user: mockHqViewer, action: denied },
      { userType: 'unauthorised user', user: mockUnauthorisedUser, action: denied },
    ])('should be $action to $userType', ({ user, action }) => {
      const testRequest = request
        .agent(appWithAllRoutes({ userSupplier: () => user }))
        .get(reportQuestionsUrl(createJourney))
        .redirects(1)
      if (action === 'granted') {
        return testRequest.expect(200)
      }
      return testRequest.expect(res => {
        expect(res.redirects[0]).toContain('/sign-out')
      })
    })
  })
})

function fieldNames(response: string): string[] {
  const regexp = /<input .* id="([0-9]+)-item"/g

  const matches = [...response.matchAll(regexp)]
  return matches.map(match => match[1])
}
