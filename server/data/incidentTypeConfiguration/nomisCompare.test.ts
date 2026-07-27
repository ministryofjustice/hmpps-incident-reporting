import { compareConfigs } from './nomisCompare'
import type { IncidentTypeConfiguration, UpdateIncidentTypeConfigurationRequest } from '../prisonApi'

function sentRequest(): UpdateIncidentTypeConfigurationRequest {
  return {
    incidentTypeDescription: 'Abscond',
    active: true,
    questions: [
      {
        code: '1',
        question: 'Q1',
        active: true,
        multipleAnswers: false,
        answers: [
          {
            code: '11',
            response: 'A11',
            active: true,
            commentRequired: true,
            dateRequired: false,
            nextQuestionCode: '2',
          },
        ],
      },
      {
        code: '2',
        question: 'Q2',
        active: true,
        multipleAnswers: false,
        answers: [
          {
            code: '21',
            response: 'A21',
            active: true,
            commentRequired: false,
            dateRequired: true,
            nextQuestionCode: null,
          },
        ],
      },
    ],
    prisonerRoles: [{ prisonerRole: 'PERP', singleRole: true, active: true }],
  }
}

/** NOMIS response (different field names) that reflects the sent request exactly */
function matchingNomisConfig(): IncidentTypeConfiguration {
  return {
    incidentType: 'ABSCOND',
    incidentTypeDescription: 'Abscond',
    questionnaireId: 1,
    active: true,
    questions: [
      {
        questionnaireQueId: 2,
        questionSeq: 2,
        questionDesc: 'Q2',
        questionListSeq: 2,
        questionActiveFlag: true,
        multipleAnswerFlag: false,
        answers: [
          {
            questionnaireAnsId: 21,
            answerSeq: 1,
            answerDesc: 'A21',
            answerListSeq: 1,
            answerActiveFlag: true,
            dateRequiredFlag: true,
            commentRequiredFlag: false,
          },
        ],
      },
      {
        questionnaireQueId: 1,
        questionSeq: 1,
        questionDesc: 'Q1',
        questionListSeq: 1,
        questionActiveFlag: true,
        multipleAnswerFlag: false,
        answers: [
          {
            questionnaireAnsId: 11,
            answerSeq: 1,
            answerDesc: 'A11',
            answerListSeq: 1,
            answerActiveFlag: true,
            dateRequiredFlag: false,
            commentRequiredFlag: true,
            nextQuestionnaireQueId: 2,
          },
        ],
      },
    ],
    prisonerRoles: [{ prisonerRole: 'PERP', singleRole: true, active: true }],
  }
}

describe('nomisCompare', () => {
  it('reports in sync when NOMIS reflects the sent request (despite different order and field names)', () => {
    const result = compareConfigs(sentRequest(), matchingNomisConfig())
    expect(result).toEqual({ inSync: true, differences: [] })
  })

  it('detects a changed question', () => {
    const got = matchingNomisConfig()
    got.questions[1].questionDesc = 'CHANGED'

    const result = compareConfigs(sentRequest(), got)
    expect(result.inSync).toBe(false)
    expect(result.differences).toContain('Question 1 does not match NOMIS')
  })

  it('detects a missing question and a different description', () => {
    const got = matchingNomisConfig()
    got.incidentTypeDescription = 'Something else'
    got.questions = got.questions.filter(question => question.questionnaireQueId !== 2)

    const result = compareConfigs(sentRequest(), got)
    expect(result.inSync).toBe(false)
    expect(result.differences).toContain('Question 2 is missing in NOMIS')
    expect(result.differences).toContain('Description differs: sent “Abscond”, NOMIS holds “Something else”')
  })

  it('detects an unexpected question held only by NOMIS', () => {
    const got = matchingNomisConfig()
    got.questions.push({
      questionnaireQueId: 9,
      questionSeq: 3,
      questionDesc: 'STALE',
      questionListSeq: 3,
      questionActiveFlag: true,
      multipleAnswerFlag: false,
      answers: [],
    })

    const result = compareConfigs(sentRequest(), got)
    expect(result.inSync).toBe(false)
    expect(result.differences).toContain('NOMIS holds an unexpected question 9')
  })

  it('detects mismatched prisoner roles', () => {
    const got = matchingNomisConfig()
    got.prisonerRoles = [{ prisonerRole: 'PERP', singleRole: false, active: true }]

    const result = compareConfigs(sentRequest(), got)
    expect(result.inSync).toBe(false)
    expect(result.differences).toContain('Prisoner roles do not match NOMIS')
  })
})
