import { buildCreateRequest, buildNomisQuestions, buildUpdateRequest, orderQuestionsByFlow } from './nomisPayload'
import type { AnswerConfiguration, IncidentTypeConfiguration, QuestionConfiguration } from './types'

function answer(overrides: Partial<AnswerConfiguration> & Pick<AnswerConfiguration, 'code'>): AnswerConfiguration {
  return {
    response: `RESPONSE ${overrides.code}`,
    active: true,
    label: `Answer ${overrides.code}`,
    commentRequested: false,
    commentMandatory: false,
    dateMandatory: false,
    nextQuestionCode: null,
    ...overrides,
  }
}

function question(
  overrides: Partial<QuestionConfiguration> & Pick<QuestionConfiguration, 'code' | 'answers'>,
): QuestionConfiguration {
  return {
    active: true,
    question: `QUESTION ${overrides.code}`,
    label: `Question ${overrides.code}`,
    multipleAnswers: false,
    ...overrides,
  }
}

/** Linear flow 1 → 2 → end, plus an unreachable question 3 */
function sampleConfig(): IncidentTypeConfiguration {
  return {
    incidentType: 'ABSCOND_1',
    active: true,
    startingQuestionCode: '1',
    questions: {
      '1': question({
        code: '1',
        answers: [answer({ code: '11', nextQuestionCode: '2', commentRequested: true, commentMandatory: true })],
      }),
      '2': question({
        code: '2',
        answers: [answer({ code: '21', dateMandatory: true, nextQuestionCode: null })],
      }),
      '3': question({ code: '3', active: false, answers: [answer({ code: '31', active: false })] }),
    },
    prisonerRoles: [
      { prisonerRole: 'PERPETRATOR', onlyOneAllowed: true, active: true },
      { prisonerRole: 'ACTIVE_INVOLVEMENT', onlyOneAllowed: false, active: true },
    ],
  }
}

describe('nomisPayload', () => {
  describe('orderQuestionsByFlow', () => {
    it('orders questions by following the flow from the start, appending unreachable ones', () => {
      const ordered = orderQuestionsByFlow(sampleConfig()).map(q => q.code)
      expect(ordered).toEqual(['1', '2', '3'])
    })
  })

  describe('buildNomisQuestions', () => {
    it('renames DPS answer fields to the NOMIS request fields', () => {
      const [firstQuestion, secondQuestion] = buildNomisQuestions(sampleConfig())

      expect(firstQuestion).toEqual({
        code: '1',
        active: true,
        question: 'QUESTION 1',
        multipleAnswers: false,
        answers: [
          {
            code: '11',
            response: 'RESPONSE 11',
            active: true,
            commentRequired: true, // commentRequested -> commentRequired
            dateRequired: false, // dateMandatory -> dateRequired
            nextQuestionCode: '2',
          },
        ],
      })
      expect(secondQuestion.answers[0]).toMatchObject({ code: '21', dateRequired: true, nextQuestionCode: null })
    })
  })

  describe('buildUpdateRequest', () => {
    it('maps prisoner roles to NOMIS codes and renames onlyOneAllowed to singleRole', () => {
      const request = buildUpdateRequest(sampleConfig(), { description: 'Abscond', active: true })

      expect(request.incidentTypeDescription).toBe('Abscond')
      expect(request.active).toBe(true)
      expect(request.prisonerRoles).toEqual([
        { prisonerRole: 'PERP', singleRole: true, active: true },
        { prisonerRole: 'ACTINV', singleRole: false, active: true },
      ])
      expect('incidentType' in request).toBe(false)
    })
  })

  describe('buildCreateRequest', () => {
    it('includes the NOMIS incident type code', () => {
      const request = buildCreateRequest(sampleConfig(), { nomisCode: 'ABSCOND', description: 'Abscond', active: true })

      expect(request.incidentType).toBe('ABSCOND')
      expect(request.questions).toHaveLength(3)
    })
  })
})
