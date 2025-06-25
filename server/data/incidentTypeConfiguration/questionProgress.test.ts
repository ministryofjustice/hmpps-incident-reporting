import { now } from '../../testutils/fakeClock'
import type { Response } from '../incidentReportingApi'
import { convertReportWithDetailsDates } from '../incidentReportingApiUtils'
import { mockReport } from '../testData/incidentReporting'
import type { IncidentTypeConfiguration } from './types'
import { generateSteps } from './formWizard'
import { QuestionProgress } from './questionProgress'

describe('Question progress', () => {
  /**
   * Simple 3-question config; branching on the first one
   * ```
   * '1' (Page 1, start)
   *   • '11'  →  '2'
   *   • '12'  →  '4'
   *
   * '2' (Page 2)
   *   • '21'  →  '3'
   *   • '22'  →  '3'
   *
   * '3' (Page 2)
   *   • '31'  →  '4'
   *   • '32'  →  '4'
   *
   * '4' (Page 2 or 3 depending on route, end)
   *   • '41'  →  null
   *   • '42'  →  null
   *
   *  1─────┐
   *  │     ▼
   *  │     2
   *  │     │
   *  │     ▼
   *  ▼     3
   *  4◄────┘
   * ```
   */
  const config: IncidentTypeConfiguration = {
    startingQuestionId: '1',
    active: true,
    incidentType: 'MISCELLANEOUS_1',
    prisonerRoles: [],
    questions: {
      '1': {
        id: '1',
        active: true,
        question: 'Q1',
        label: 'Question 1',
        multipleAnswers: false,
        answers: [
          {
            id: '11',
            code: 'A1-1',
            active: true,
            label: 'Answer 1-1',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: '2',
          },
          {
            id: '12',
            code: 'A1-2',
            active: true,
            label: 'Answer 1-2',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: '4',
          },
        ],
      },
      '2': {
        id: '2',
        active: true,
        question: 'Q2',
        label: 'Question 2',
        multipleAnswers: false,
        answers: [
          {
            id: '21',
            code: 'A2-1',
            active: true,
            label: 'Answer 2-1',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: '3',
          },
          {
            id: '22',
            code: 'A2-2',
            active: true,
            label: 'Answer 2-2',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: '3',
          },
        ],
      },
      '3': {
        id: '3',
        active: true,
        question: 'Q3',
        label: 'Question 3',
        multipleAnswers: false,
        answers: [
          {
            id: '31',
            code: 'A3-1',
            active: true,
            label: 'Answer 3-1',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: '4',
          },
          {
            id: '32',
            code: 'A3-2',
            active: true,
            label: 'Answer 3-2',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: '4',
          },
        ],
      },
      '4': {
        id: '4',
        active: true,
        question: 'Q4',
        label: 'Question 4',
        multipleAnswers: false,
        answers: [
          {
            id: '41',
            code: 'A4-1',
            active: true,
            label: 'Answer 4-1',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: null,
          },
          {
            id: '42',
            code: 'A4-2',
            active: true,
            label: 'Answer 4-2',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: null,
          },
        ],
      },
    },
  }
  const steps = generateSteps(config)

  describe('before any responses have been entered', () => {
    const report = convertReportWithDetailsDates(
      mockReport({ type: 'MISCELLANEOUS_1', reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    // no responses
    report.questions = []

    it('should track progress through report questions', () => {
      const questionProgress = new QuestionProgress(config, steps, report)
      const progress = Array.from(questionProgress)
      expect(progress).toEqual([
        // on first question, which is incomplete
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '1' }),
          responses: undefined,
          urlSuffix: '/1',
          questionNumber: 1,
          pageNumber: 1,
          isComplete: false,
        }),
      ])
    })

    it('should return first incomplete question', () => {
      const questionProgress = new QuestionProgress(config, steps, report)
      expect(questionProgress.firstIncompleteStep()).toHaveProperty('questionConfig.id', '1')
    })

    it('should state that the report is incomplete', () => {
      const questionProgress = new QuestionProgress(config, steps, report)
      expect(questionProgress.isComplete).toBe(false)
    })
  })

  describe('once a response has been entered', () => {
    const report = convertReportWithDetailsDates(
      mockReport({ type: 'MISCELLANEOUS_1', reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    // '11' response for question '1'
    report.questions = [
      {
        code: '1',
        question: 'Q1',
        responses: [
          {
            response: 'A1-1',
            code: '1-1',
            responseDate: null,
            additionalInformation: null,
            recordedAt: new Date(),
            recordedBy: 'some-user',
          },
        ],
        additionalInformation: null,
      },
    ]

    it('should track progress through report questions', () => {
      const questionProgress = new QuestionProgress(config, steps, report)
      const progress = Array.from(questionProgress)
      expect(progress).toEqual([
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '1' }),
          responses: [
            expect.objectContaining({
              response: expect.objectContaining({ response: 'A1-1' }),
              answerConfig: expect.objectContaining({ label: 'Answer 1-1' }),
              isComplete: true,
            }),
          ],
          urlSuffix: '/1',
          questionNumber: 1,
          pageNumber: 1,
          isComplete: true,
        }),
        // on second question, which is incomplete
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '2' }),
          responses: undefined,
          urlSuffix: '/2',
          questionNumber: 2,
          pageNumber: 2,
          isComplete: false,
        }),
      ])
    })

    it('should return first incomplete question', () => {
      const questionProgress = new QuestionProgress(config, steps, report)
      expect(questionProgress.firstIncompleteStep()).toHaveProperty('questionConfig.id', '2')
    })

    it('should state that the report is incomplete', () => {
      const questionProgress = new QuestionProgress(config, steps, report)
      expect(questionProgress.isComplete).toBe(false)
    })
  })

  describe('once a differently branching response has been entered', () => {
    const report = convertReportWithDetailsDates(
      mockReport({ type: 'MISCELLANEOUS_1', reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    // '12' response for question '1'
    report.questions = [
      {
        code: '1',
        question: 'Q1',
        responses: [
          {
            response: 'A1-2',
            code: '1-2',
            responseDate: null,
            additionalInformation: null,
            recordedAt: new Date(),
            recordedBy: 'some-user',
          },
        ],
        additionalInformation: null,
      },
    ]

    it('should track progress through report questions', () => {
      const questionProgress = new QuestionProgress(config, steps, report)
      const progress = Array.from(questionProgress)
      expect(progress).toEqual([
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '1' }),
          responses: [
            expect.objectContaining({
              response: expect.objectContaining({ response: 'A1-2' }),
              answerConfig: expect.objectContaining({ label: 'Answer 1-2' }),
              isComplete: true,
            }),
          ],
          urlSuffix: '/1',
          questionNumber: 1,
          pageNumber: 1,
          isComplete: true,
        }),
        // on fourth question, which is incomplete
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '4' }),
          responses: undefined,
          urlSuffix: '/4',
          questionNumber: 2,
          pageNumber: 2,
          isComplete: false,
        }),
      ])
    })

    it('should return first incomplete question', () => {
      const questionProgress = new QuestionProgress(config, steps, report)
      expect(questionProgress.firstIncompleteStep()).toHaveProperty('questionConfig.id', '4')
    })

    it('should state that the report is incomplete', () => {
      const questionProgress = new QuestionProgress(config, steps, report)
      expect(questionProgress.isComplete).toBe(false)
    })
  })

  describe('once all responses have been entered', () => {
    const report = convertReportWithDetailsDates(
      mockReport({ type: 'MISCELLANEOUS_1', reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    // '11' response for question '1'
    // '22' response for question '2'
    // '32' response for question '3'
    // '41' response for question '4'
    report.questions = [
      {
        code: '1',
        question: 'Q1',
        responses: [
          {
            response: 'A1-1',
            code: '1-1',
            responseDate: null,
            additionalInformation: null,
            recordedAt: new Date(),
            recordedBy: 'some-user',
          },
        ],
        additionalInformation: null,
      },
      {
        code: '2',
        question: 'Q2',
        responses: [
          {
            response: 'A2-2',
            code: '2-2',
            responseDate: null,
            additionalInformation: null,
            recordedAt: new Date(),
            recordedBy: 'some-user',
          },
        ],
        additionalInformation: null,
      },
      {
        code: '3',
        question: 'Q3',
        responses: [
          {
            response: 'A3-2',
            code: '3-2',
            responseDate: null,
            additionalInformation: null,
            recordedAt: new Date(),
            recordedBy: 'some-user',
          },
        ],
        additionalInformation: null,
      },
      {
        code: '4',
        question: 'Q4',
        responses: [
          {
            response: 'A4-1',
            code: '4-1',
            responseDate: null,
            additionalInformation: null,
            recordedAt: new Date(),
            recordedBy: 'some-user',
          },
        ],
        additionalInformation: null,
      },
    ]

    it('should track progress through report questions', () => {
      const questionProgress = new QuestionProgress(config, steps, report)
      const progress = Array.from(questionProgress)
      expect(progress).toEqual([
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '1' }),
          responses: [
            expect.objectContaining({
              response: expect.objectContaining({ response: 'A1-1' }),
              answerConfig: expect.objectContaining({ label: 'Answer 1-1' }),
              isComplete: true,
            }),
          ],
          urlSuffix: '/1',
          questionNumber: 1,
          pageNumber: 1,
          isComplete: true,
        }),
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '2' }),
          responses: [
            expect.objectContaining({
              response: expect.objectContaining({ response: 'A2-2' }),
              answerConfig: expect.objectContaining({ label: 'Answer 2-2' }),
              isComplete: true,
            }),
          ],
          urlSuffix: '/2',
          questionNumber: 2,
          pageNumber: 2,
          isComplete: true,
        }),
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '3' }),
          responses: [
            expect.objectContaining({
              response: expect.objectContaining({ response: 'A3-2' }),
              answerConfig: expect.objectContaining({ label: 'Answer 3-2' }),
              isComplete: true,
            }),
          ],
          urlSuffix: '/2',
          questionNumber: 3,
          pageNumber: 2,
          isComplete: true,
        }),
        // on third question, which is complete
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '4' }),
          responses: [
            expect.objectContaining({
              response: expect.objectContaining({ response: 'A4-1' }),
              answerConfig: expect.objectContaining({ label: 'Answer 4-1' }),
              isComplete: true,
            }),
          ],
          urlSuffix: '/4',
          questionNumber: 4,
          pageNumber: 3,
          isComplete: true,
        }),
      ])
    })

    it('should return no first incomplete question', () => {
      const questionProgress = new QuestionProgress(config, steps, report)
      expect(questionProgress.firstIncompleteStep()).toBeNull()
    })

    it('should state that the report is complete', () => {
      const questionProgress = new QuestionProgress(config, steps, report)
      expect(questionProgress.isComplete).toBe(true)
    })
  })

  describe('should validate comment and/or date responses along the way', () => {
    it('when a response is not one of the possible choices', () => {
      const report = convertReportWithDetailsDates(
        mockReport({ type: 'MISCELLANEOUS_1', reportReference: '6543', reportDateAndTime: now, withDetails: true }),
      )
      // non-existent response for question '1'
      report.questions = [
        {
          code: '1',
          question: 'Q1',
          responses: [
            {
              response: 'A1-10',
              code: '1-10',
              responseDate: null,
              additionalInformation: null,
              recordedAt: new Date(),
              recordedBy: 'some-user',
            },
          ],
          additionalInformation: null,
        },
      ]
      const questionProgress = new QuestionProgress(config, steps, report)

      expect(questionProgress.isComplete).toBe(false)
      const progressSteps = Array.from(questionProgress)
      expect(progressSteps).toHaveLength(1)
      expect(progressSteps[0].isComplete).toBe(false)
    })

    describe('for single-choice questions', () => {
      const simplestConfig: IncidentTypeConfiguration = {
        startingQuestionId: '1',
        active: true,
        incidentType: 'MISCELLANEOUS_1',
        prisonerRoles: [],
        questions: {
          '1': {
            id: '1',
            active: true,
            question: 'Q1',
            label: 'Question 1',
            multipleAnswers: false,
            answers: [
              {
                id: '1',
                code: 'A1',
                active: true,
                label: 'Answer 1',
                dateRequired: false,
                commentRequired: false,
                nextQuestionId: null,
              },
              {
                id: '2',
                code: 'A2',
                active: true,
                label: 'Answer 2 (enter date)',
                dateRequired: true,
                commentRequired: false,
                nextQuestionId: null,
              },
              {
                id: '3',
                code: 'A3',
                active: true,
                label: 'Answer 3 (enter details)',
                dateRequired: false,
                commentRequired: true,
                nextQuestionId: null,
              },
              {
                id: '4',
                code: 'A4',
                active: true,
                label: 'Answer 4 (enter both)',
                dateRequired: true,
                commentRequired: true,
                nextQuestionId: null,
              },
            ],
          },
        },
      }
      const simplestSteps = generateSteps(simplestConfig)
      const report = convertReportWithDetailsDates(
        mockReport({ type: 'MISCELLANEOUS_1', reportReference: '6543', reportDateAndTime: now, withDetails: true }),
      )

      function expectProgressStepValidity(responses: Response[], expectValid: boolean) {
        report.questions = [
          {
            code: '1',
            question: 'Q1',
            responses,
            additionalInformation: null,
          },
        ]
        const questionProgress = new QuestionProgress(simplestConfig, simplestSteps, report)
        const progressStep = Array.from(questionProgress)[0]
        expect(progressStep.isComplete).toBe(expectValid)
        expect(progressStep.responses).toHaveLength(responses.length)
        if (responses.length === 1) {
          // most tests check individual response validity
          expect(progressStep.responses[0].isComplete).toBe(expectValid)
        } else {
          // multi-response test is only invalid because this is a single-choice question
          expect(progressStep.responses.every(response => response.isComplete)).toBe(true)
        }
      }

      it('when neither is required and not provided', () => {
        expectProgressStepValidity(
          [
            {
              response: 'A1',
              code: '1',
              responseDate: null,
              additionalInformation: null,
              recordedAt: new Date(),
              recordedBy: 'some-user',
            },
          ],
          true,
        )
      })

      it.each([
        { scenario: 'provided', provided: true, expectValid: true },
        { scenario: 'not provided', provided: false, expectValid: false },
      ])('when date is required and $scenario', ({ provided, expectValid }) => {
        expectProgressStepValidity(
          [
            {
              response: 'A2',
              code: '2',
              responseDate: provided ? new Date() : null,
              additionalInformation: null,
              recordedAt: new Date(),
              recordedBy: 'some-user',
            },
          ],
          expectValid,
        )
      })

      it.each([
        { scenario: 'provided', provided: true, expectValid: true },
        { scenario: 'not provided', provided: false, expectValid: false },
      ])('when comment is required and $scenario', ({ provided, expectValid }) => {
        expectProgressStepValidity(
          [
            {
              response: 'A3',
              code: '3',
              responseDate: null,
              additionalInformation: provided ? 'COMMENT' : null,
              recordedAt: new Date(),
              recordedBy: 'some-user',
            },
          ],
          expectValid,
        )
      })

      it.each([
        { scenario: 'provided', commentProvided: true, dateProvided: true, expectValid: true },
        { scenario: 'only comment is provided', commentProvided: true, dateProvided: false, expectValid: false },
        { scenario: 'only date is provided', commentProvided: false, dateProvided: true, expectValid: false },
        { scenario: 'not provided', commentProvided: false, dateProvided: false, expectValid: false },
      ])('when comment and date are required and $scenario', ({ commentProvided, dateProvided, expectValid }) => {
        expectProgressStepValidity(
          [
            {
              response: 'A4',
              code: '4',
              responseDate: commentProvided ? new Date() : null,
              additionalInformation: dateProvided ? 'COMMENT' : null,
              recordedAt: new Date(),
              recordedBy: 'some-user',
            },
          ],
          expectValid,
        )
      })

      it('when comment and date are not required, but still provided', () => {
        expectProgressStepValidity(
          [
            {
              response: 'A1',
              code: '1',
              responseDate: new Date(),
              additionalInformation: 'COMMENT',
              recordedAt: new Date(),
              recordedBy: 'some-user',
            },
          ],
          true,
        )
      })

      it('when more than one response is provided', () => {
        expectProgressStepValidity(
          [
            {
              response: 'A1',
              code: '1',
              responseDate: null,
              additionalInformation: null,
              recordedAt: new Date(),
              recordedBy: 'some-user',
            },
            {
              response: 'A4',
              code: '4',
              responseDate: new Date(),
              additionalInformation: 'COMMENT',
              recordedAt: new Date(),
              recordedBy: 'some-user',
            },
          ],
          false,
        )
      })
    })

    describe('for multiple-choice questions', () => {
      const multiChoiceConfig: IncidentTypeConfiguration = {
        startingQuestionId: '1',
        active: true,
        incidentType: 'MISCELLANEOUS_1',
        prisonerRoles: [],
        questions: {
          '1': {
            id: '1',
            active: true,
            question: 'Q1',
            label: 'Question 1',
            multipleAnswers: true,
            answers: [
              {
                id: '1',
                code: 'A1',
                active: true,
                label: 'Answer 1',
                dateRequired: false,
                commentRequired: false,
                nextQuestionId: null,
              },
              {
                id: '2',
                code: 'A2',
                active: true,
                label: 'Answer 2 (enter date)',
                dateRequired: true,
                commentRequired: false,
                nextQuestionId: null,
              },
              {
                id: '3',
                code: 'A3',
                active: true,
                label: 'Answer 3 (enter details)',
                dateRequired: false,
                commentRequired: true,
                nextQuestionId: null,
              },
              {
                id: '4',
                code: 'A4',
                active: true,
                label: 'Answer 4 (enter both)',
                dateRequired: true,
                commentRequired: true,
                nextQuestionId: null,
              },
            ],
          },
        },
      }
      const multiChoiceSteps = generateSteps(multiChoiceConfig)
      const report = convertReportWithDetailsDates(
        mockReport({ type: 'MISCELLANEOUS_1', reportReference: '6543', reportDateAndTime: now, withDetails: true }),
      )

      function expectProgressStepValidity(responses: Response[], expectValid: boolean) {
        report.questions = [
          {
            code: '1',
            question: 'Q1',
            responses,
            additionalInformation: null,
          },
        ]
        const questionProgress = new QuestionProgress(multiChoiceConfig, multiChoiceSteps, report)
        const progressStep = Array.from(questionProgress)[0]
        expect(progressStep.isComplete).toBe(expectValid)
      }

      it('when no responses are provided', () => {
        expectProgressStepValidity([], false)
      })

      it('when some valid responses are provided', () => {
        expectProgressStepValidity(
          [
            // complete
            {
              response: 'A1',
              code: '1',
              responseDate: null,
              additionalInformation: null,
              recordedAt: new Date(),
              recordedBy: 'some-user',
            },
            // complete
            {
              response: 'A3',
              code: '3',
              responseDate: null,
              additionalInformation: 'COMMENT',
              recordedAt: new Date(),
              recordedBy: 'some-user',
            },
          ],
          true,
        )
      })

      it('when some invalid responses are provided', () => {
        expectProgressStepValidity(
          [
            // complete
            {
              response: 'A1',
              code: '1',
              responseDate: null,
              additionalInformation: null,
              recordedAt: new Date(),
              recordedBy: 'some-user',
            },
            // incomplete
            {
              response: 'A3',
              code: '3',
              responseDate: null,
              additionalInformation: null,
              recordedAt: new Date(),
              recordedBy: 'some-user',
            },
          ],
          false,
        )
      })
    })

    describe('for questions with inactive responses', () => {
      const configWithInactiveResponses: IncidentTypeConfiguration = {
        startingQuestionId: '1',
        active: true,
        incidentType: 'MISCELLANEOUS_1',
        prisonerRoles: [],
        questions: {
          '1': {
            id: '1',
            active: true,
            question: 'Q1',
            label: 'Question 1',
            multipleAnswers: false,
            answers: [
              {
                id: '1',
                code: 'A1',
                active: false,
                label: 'Answer 1 (old, inactive)',
                dateRequired: false,
                commentRequired: false,
                nextQuestionId: null,
              },
              {
                id: '2',
                code: 'A1',
                active: true,
                label: 'Answer 1 (new, active)',
                dateRequired: false,
                commentRequired: false,
                nextQuestionId: '2',
              },
            ],
          },
          '2': {
            id: '2',
            active: true,
            question: 'Q2',
            label: 'Question 2',
            multipleAnswers: false,
            answers: [...config.questions['4'].answers],
          },
        },
      }
      const stepsWithInactiveResponses = generateSteps(configWithInactiveResponses)
      const report = convertReportWithDetailsDates(
        mockReport({ type: 'MISCELLANEOUS_1', reportReference: '6543', reportDateAndTime: now, withDetails: true }),
      )
      report.questions = [
        {
          code: '1',
          question: 'Q1',
          responses: [
            {
              response: 'A1',
              code: '1',
              responseDate: null,
              additionalInformation: null,
              recordedAt: new Date(),
              recordedBy: 'some-user',
            },
          ],
          additionalInformation: null,
        },
      ]

      it('should prefer active responses over inactive ones', () => {
        const questionProgress = new QuestionProgress(configWithInactiveResponses, stepsWithInactiveResponses, report)
        const progress = Array.from(questionProgress)
        expect(progress).toHaveLength(2)
        expect(progress[0].isComplete).toBe(true)
        expect(progress[1].isComplete).toBe(false)
      })
    })
  })
})
