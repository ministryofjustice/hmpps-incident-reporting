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
   *   • '1-1'  →  '2'
   *   • '1-2'  →  '4'
   *
   * '2' (Page 2)
   *   • '2-1'  →  '3'
   *   • '2-2'  →  '3'
   *
   * '3' (Page 2)
   *   • '3-1'  →  '4'
   *   • '3-2'  →  '4'
   *
   * '4' (Page 2 or 3 depending on route, end)
   *   • '4-1'  →  null
   *   • '4-2'  →  null
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
        code: '1',
        label: '1',
        multipleAnswers: false,
        answers: [
          {
            id: '1-1',
            code: '1-1',
            active: true,
            label: '1-1',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: '2',
          },
          {
            id: '1-2',
            code: '1-2',
            active: true,
            label: '1-2',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: '4',
          },
        ],
      },
      '2': {
        id: '2',
        active: true,
        code: '2',
        label: '2',
        multipleAnswers: false,
        answers: [
          {
            id: '2-1',
            code: '2-1',
            active: true,
            label: '2-1',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: '3',
          },
          {
            id: '2-2',
            code: '2-2',
            active: true,
            label: '2-2',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: '3',
          },
        ],
      },
      '3': {
        id: '3',
        active: true,
        code: '3',
        label: '3',
        multipleAnswers: false,
        answers: [
          {
            id: '3-1',
            code: '3-1',
            active: true,
            label: '3-1',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: '4',
          },
          {
            id: '3-2',
            code: '3-2',
            active: true,
            label: '3-2',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: '4',
          },
        ],
      },
      '4': {
        id: '4',
        active: true,
        code: '4',
        label: '4',
        multipleAnswers: false,
        answers: [
          {
            id: '4-1',
            code: '4-1',
            active: true,
            label: '4-1',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: null,
          },
          {
            id: '4-2',
            code: '4-2',
            active: true,
            label: '4-2',
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
          urlSuffix: '/1',
          page: 1,
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
    // '1-1' response for question '1'
    report.questions = [
      {
        code: '1',
        question: '1',
        responses: [
          {
            response: '1-1',
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
          urlSuffix: '/1',
          page: 1,
          isComplete: true,
        }),
        // on second question, which is incomplete
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '2' }),
          urlSuffix: '/2',
          page: 2,
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
    // '1-2' response for question '1'
    report.questions = [
      {
        code: '1',
        question: '1',
        responses: [
          {
            response: '1-2',
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
          urlSuffix: '/1',
          page: 1,
          isComplete: true,
        }),
        // on fourth question, which is incomplete
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '4' }),
          urlSuffix: '/4',
          page: 2,
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
    // '1-1' response for question '1'
    // '2-2' response for question '2'
    // '3-2' response for question '3'
    // '4-1' response for question '4'
    report.questions = [
      {
        code: '1',
        question: '1',
        responses: [
          {
            response: '1-1',
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
        question: '2',
        responses: [
          {
            response: '2-2',
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
        question: '3',
        responses: [
          {
            response: '3-2',
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
        question: '4',
        responses: [
          {
            response: '4-1',
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
          urlSuffix: '/1',
          page: 1,
          isComplete: true,
        }),
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '2' }),
          urlSuffix: '/2',
          page: 2,
          isComplete: true,
        }),
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '3' }),
          urlSuffix: '/2',
          page: 2,
          isComplete: true,
        }),
        // on third question, which is complete
        expect.objectContaining({
          questionConfig: expect.objectContaining({ id: '4' }),
          urlSuffix: '/4',
          page: 3,
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
