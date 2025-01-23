import { now } from '../../testutils/fakeClock'
import { convertReportWithDetailsDates } from '../incidentReportingApiUtils'
import { mockReport } from '../testData/incidentReporting'
import type { IncidentTypeConfiguration } from './types'
import { QuestionProgress } from './questionProgress'

describe('Question progress', () => {
  /**
   * Simple 3-question config; branching on the first one
   * ```
   * '1' (Page 1, start)
   *   • '1-1'  →  '2'
   *   • '1-2'  →  '3'
   *
   * '2' (Page 2, end)
   *   • '2-1'  →  null
   *   • '2-2'  →  null
   *
   * '3' (Page 2, end)
   *   • '3-1'  →  null
   *   • '3-2'  →  null
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
            nextQuestionId: '3',
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
            nextQuestionId: null,
          },
          {
            id: '2-2',
            code: '2-2',
            active: true,
            label: '2-2',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: null,
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
            nextQuestionId: null,
          },
          {
            id: '3-2',
            code: '3-2',
            active: true,
            label: '3-2',
            dateRequired: false,
            commentRequired: false,
            nextQuestionId: null,
          },
        ],
      },
    },
  }

  describe('before any responses have been entered', () => {
    const report = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    // no responses
    report.questions = []
    const questionProgress = new QuestionProgress(config, report)

    it('should track progress through report questions', () => {
      const progress = Array.from(questionProgress.walkQuestions()).map(({ questionConfig: { id }, isComplete }) => {
        return { id, isComplete }
      })
      expect(progress).toEqual([
        // on first question, which is incomplete
        { id: '1', isComplete: false },
      ])
    })

    it('should return first incomplete question', () => {
      expect(questionProgress.firstIncompleteQuestion().id).toEqual('1')
    })

    it('should state that the report is incomplete', () => {
      expect(questionProgress.isComplete).toBe(false)
    })
  })

  describe('once some responses have been entered', () => {
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
    const questionProgress = new QuestionProgress(config, report)

    it('should track progress through report questions', () => {
      const progress = Array.from(questionProgress.walkQuestions()).map(({ questionConfig: { id }, isComplete }) => {
        return { id, isComplete }
      })
      expect(progress).toEqual([
        { id: '1', isComplete: true },
        // on second question, which is incomplete
        { id: '2', isComplete: false },
      ])
    })

    it('should return first incomplete question', () => {
      expect(questionProgress.firstIncompleteQuestion().id).toEqual('2')
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
    ]
    const questionProgress = new QuestionProgress(config, report)

    it('should track progress through report questions', () => {
      const progress = Array.from(questionProgress.walkQuestions()).map(({ questionConfig: { id }, isComplete }) => {
        return { id, isComplete }
      })
      expect(progress).toEqual([
        { id: '1', isComplete: true },
        // on second question, which is complete
        { id: '2', isComplete: true },
      ])
    })

    it('should return no first incomplete question', () => {
      expect(questionProgress.firstIncompleteQuestion()).toBeNull()
    })

    it('should state that the report is complete', () => {
      expect(questionProgress.isComplete).toBe(true)
    })
  })
})
