import { now } from '../../testutils/fakeClock'
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
    incidentType: 'MISCELLANEOUS',
    prisonerRoles: [],
    questions: {
      '1': {
        id: '1',
        active: true,
        code: 'Q1',
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
        code: 'Q2',
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
        code: 'Q3',
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
        code: 'Q4',
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
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    // no responses
    report.questions = []
    const questionProgress = new QuestionProgress(config, steps, report)

    it('should track progress through report questions', () => {
      const progress = Array.from(questionProgress)
      expect(progress).toEqual([
        // on first question, which is incomplete
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '1' }),
          answerConfigs: undefined,
          urlSuffix: '/1',
          questionNumber: 1,
          pageNumber: 1,
          isComplete: false,
        }),
      ])
    })

    it('should return first incomplete question', () => {
      expect(questionProgress.firstIncompleteStep()).toHaveProperty('questionConfig.id', '1')
    })

    it('should state that the report is incomplete', () => {
      expect(questionProgress.isComplete).toBe(false)
    })
  })

  describe('once a response has been entered', () => {
    const report = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    // '11' response for question '1'
    report.questions = [
      {
        code: '1',
        question: 'Q1',
        responses: [
          {
            response: 'A1-1',
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

    it('should track progress through report questions', () => {
      const progress = Array.from(questionProgress)
      expect(progress).toEqual([
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '1' }),
          answerConfigs: [expect.objectContaining({ label: 'Answer 1-1' })],
          urlSuffix: '/1',
          questionNumber: 1,
          pageNumber: 1,
          isComplete: true,
        }),
        // on second question, which is incomplete
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '2' }),
          answerConfigs: undefined,
          urlSuffix: '/2',
          questionNumber: 2,
          pageNumber: 2,
          isComplete: false,
        }),
      ])
    })

    it('should return first incomplete question', () => {
      expect(questionProgress.firstIncompleteStep()).toHaveProperty('questionConfig.id', '2')
    })

    it('should state that the report is incomplete', () => {
      expect(questionProgress.isComplete).toBe(false)
    })
  })

  describe('once a differently branching response has been entered', () => {
    const report = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    // '12' response for question '1'
    report.questions = [
      {
        code: '1',
        question: 'Q1',
        responses: [
          {
            response: 'A1-2',
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

    it('should track progress through report questions', () => {
      const progress = Array.from(questionProgress)
      expect(progress).toEqual([
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '1' }),
          answerConfigs: [expect.objectContaining({ label: 'Answer 1-2' })],
          urlSuffix: '/1',
          questionNumber: 1,
          pageNumber: 1,
          isComplete: true,
        }),
        // on fourth question, which is incomplete
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '4' }),
          answerConfigs: undefined,
          urlSuffix: '/4',
          questionNumber: 2,
          pageNumber: 2,
          isComplete: false,
        }),
      ])
    })

    it('should return first incomplete question', () => {
      expect(questionProgress.firstIncompleteStep()).toHaveProperty('questionConfig.id', '4')
    })

    it('should state that the report is incomplete', () => {
      expect(questionProgress.isComplete).toBe(false)
    })
  })

  describe('once all responses have been entered', () => {
    const report = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
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

    it('should track progress through report questions', () => {
      const progress = Array.from(questionProgress)
      expect(progress).toEqual([
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '1' }),
          answerConfigs: [expect.objectContaining({ label: 'Answer 1-1' })],
          urlSuffix: '/1',
          questionNumber: 1,
          pageNumber: 1,
          isComplete: true,
        }),
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '2' }),
          answerConfigs: [expect.objectContaining({ label: 'Answer 2-2' })],
          urlSuffix: '/2',
          questionNumber: 2,
          pageNumber: 2,
          isComplete: true,
        }),
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '3' }),
          answerConfigs: [expect.objectContaining({ label: 'Answer 3-2' })],
          urlSuffix: '/2',
          questionNumber: 3,
          pageNumber: 2,
          isComplete: true,
        }),
        // on third question, which is complete
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '4' }),
          answerConfigs: [expect.objectContaining({ label: 'Answer 4-1' })],
          urlSuffix: '/4',
          questionNumber: 4,
          pageNumber: 3,
          isComplete: true,
        }),
      ])
    })

    it('should return no first incomplete question', () => {
      expect(questionProgress.firstIncompleteStep()).toBeNull()
    })

    it('should state that the report is complete', () => {
      expect(questionProgress.isComplete).toBe(true)
    })
  })
})
