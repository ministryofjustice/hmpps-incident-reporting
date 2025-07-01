import { getAllIncidentTypeConfigurations } from '../../reportConfiguration/types'
import { ESCAPE_FROM_PRISON_1 } from '../../reportConfiguration/types/ESCAPE_FROM_PRISON_1'
import { type QuestionConfiguration, type AnswerConfiguration, type IncidentTypeConfiguration } from './types'
import { validateConfig } from './validation'

describe('Active incident type configurations', () => {
  const activeConfigs = getAllIncidentTypeConfigurations().filter(config => config.active)
  const scenarios = activeConfigs.map(config => {
    return { incidentType: config.incidentType, config }
  })

  it.each(scenarios)('Config for $incidentType is valid', ({ incidentType, config }) => {
    const errors = validateConfig(config).map(err => err.message)
    if (errors.length > 0) {
      throw new Error(`Config for '${incidentType}' incident type is invalid: ${errors.join('; ')}`)
    }
  })
})

describe('DPS config validation', () => {
  describe('when config has no known issues', () => {
    it('returns no errors', () => {
      // '1' (START)
      //   - yes  =>  '2'
      //   - no   =>  '2'
      // '2' (END)
      //   - yes  =>  /
      //   - no   =>  /
      const config: IncidentTypeConfiguration = buildValidConfig()

      const errors = validateConfig(config)
      expect(errors).toEqual([])
    })
  })

  describe('when config has invalid starting question code', () => {
    it('returns an error', () => {
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.startingQuestionCode = null

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toContain('startingQuestionCode is null')
    })
  })

  describe('when some of the questions/answers IDs contains an hyphen', () => {
    it('returns an error', () => {
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.questions['2'].code += '-BROKEN'
      config.questions['1'].answers[0].code += '-BROKEN'

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toContain(`active question '2-BROKEN' has hyphen in its code`)
      expect(errors).toContain(`active answer 'yes-BROKEN' has hyphen in its code`)
    })
  })

  describe('when config starting question is unknown', () => {
    it('returns an error', () => {
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.startingQuestionCode = 'unknown question'

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toContain('starting question is unknown')
    })
  })

  describe('when config starting question is inactive', () => {
    it('returns an error', () => {
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.questions[config.startingQuestionCode].active = false

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toContain('starting question is inactive')
    })
  })

  describe('when config has some invalid next questions', () => {
    it('returns an error', () => {
      // '1' (START)
      //   - yes  =>  '42'   // no such a question
      //   - no   =>  '2'
      // '2' (END)
      //   - yes  =>  /
      //   - no   =>  '100'  // no such a question
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.questions['1'].answers[0].nextQuestionCode = '42'
      config.questions['2'].answers[1].nextQuestionCode = '100'

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toContain('some answers lead to these unknown or inactive questions: 42, 100')
    })
  })

  describe('when config has active questions without active answers', () => {
    it('returns an error', () => {
      const config: IncidentTypeConfiguration = {
        incidentType: 'FIND_6',
        startingQuestionCode: '1',
        active: true,
        questions: {
          '1': buildQuestion({
            code: '1',
            label: 'Is this the start?',
            nextQuestionCode: null,
          }),
        },
        prisonerRoles: [
          {
            prisonerRole: 'PRESENT_AT_SCENE',
            onlyOneAllowed: false,
            active: true,
          },
        ],
      }
      config.questions['1'].answers.forEach(answer => {
        // eslint-disable-next-line no-param-reassign
        answer.active = false
      })

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toEqual(['active question 1 has no active answers'])
    })
  })

  describe('when config has some multiple choices questions leading to different next questions', () => {
    it('returns an error', () => {
      // '1' (START)
      //   - yes  =>  '2'
      //   - no   =>  '3'
      // '2' (Multiple choices)
      //   - yes  =>  '3'
      //   - no   =>  '4' // leads to a different next question
      // '3'
      //   - yes    =>  '4'
      //   - no     =>  '4'
      //   - maybe  =>  null // INACTIVE/IGNORED
      // '4' (END)
      //   - yes  =>  null
      //   - no   =>  null
      // 'old' (Multiple choices) // INACTIVE/IGNORED
      //   - yes  =>  '2'
      //   - no   =>  '3'
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.startingQuestionCode = '1'
      config.questions = {
        '1': buildQuestion({
          code: '1',
          label: '1st question?',
          multipleAnswers: false,
          answers: [
            buildAnswer({
              code: 'yes',
              label: 'yes',
              nextQuestionCode: '2',
            }),
            buildAnswer({
              code: 'no',
              label: 'no',
              nextQuestionCode: '3',
            }),
          ],
        }),
        '2': buildQuestion({
          code: '2',
          label: '2nd question?',
          multipleAnswers: true,
          answers: [
            buildAnswer({
              code: 'yes',
              label: 'yes',
              nextQuestionCode: '3',
            }),
            buildAnswer({
              code: 'no',
              label: 'no',
              nextQuestionCode: '4', // leads to a different next question
            }),
          ],
        }),
        '3': buildQuestion({
          code: '3',
          label: '3rd question?',
          multipleAnswers: true,
          answers: [
            buildAnswer({
              code: 'yes',
              label: 'yes',
              nextQuestionCode: '4',
            }),
            buildAnswer({
              code: 'no',
              label: 'no',
              nextQuestionCode: '4',
            }),
            buildAnswer({
              code: 'maybe',
              label: 'maybe',
              active: false,
              nextQuestionCode: null, // leads to a different next question BUT it's inactive
            }),
          ],
        }),
        '4': buildQuestion({ code: '4', label: '4th question?', nextQuestionCode: null }),
        // Inactive question
        old: buildQuestion({
          code: 'old',
          label: 'Old inactive question',
          multipleAnswers: true,
          active: false,
          answers: [
            buildAnswer({
              code: 'yes',
              label: 'yes',
              nextQuestionCode: '2',
            }),
            buildAnswer({
              code: 'no',
              label: 'no',
              nextQuestionCode: '3', // leads to a different next question
            }),
          ],
        }),
      }

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toContain('the following multiple choices questions can lead to different next questions: 2')
    })
  })

  describe('when config has unreachable questions', () => {
    it('returns an error', () => {
      // '1' (START)
      //   - yes  =>  '2'
      //   - no   =>  '2'
      // '2' (END)
      //   - yes  =>  /
      //   - no   =>  /
      // 'unreachable_1' (UNREACHABLE)
      //   - yes  =>  'unreachable_2'
      //   - no   =>  'unreachable_2'
      // 'unreachable_2' (UNREACHABLE)
      //   - yes  =>  /
      //   - no   =>  /
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.questions.unreachable_1 = buildQuestion({
        code: 'unreachable_1',
        label: 'Unreachable 1?',
        nextQuestionCode: 'unreachable_2',
      })
      config.questions.unreachable_2 = buildQuestion({
        code: 'unreachable_2',
        label: 'Unreachable 2?',
        nextQuestionCode: null,
      })

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toContain('the following questions are unreachable: unreachable_1, unreachable_2')
    })
  })

  describe('when config has optional questions but no cycle', () => {
    it('returns no errors', () => {
      // '1' (START)
      //   - yes  =>  '2'
      //   - no   =>  '3'
      // '2' (OPTIONAL)
      //   - yes  =>  '3'
      //   - no   =>  '3'
      // '3'
      //   - yes  =>  '4'
      //   - no   =>  '4'
      // '4' (END)
      //   - yes  =>  null
      //   - no   =>  null
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.startingQuestionCode = '1'
      config.questions = {
        '1': buildQuestion({
          code: '1',
          label: '1st question?',
          answers: [
            buildAnswer({
              code: 'yes',
              label: 'yes',
              nextQuestionCode: '2',
            }),
            buildAnswer({
              code: 'no',
              label: 'no',
              nextQuestionCode: '3',
            }),
          ],
        }),
        '2': buildQuestion({ code: '2', label: '2nd question?', nextQuestionCode: '3' }),
        '3': buildQuestion({
          code: '3',
          label: '3rd question?',
          nextQuestionCode: '4',
        }),
        '4': buildQuestion({ code: '4', label: '4th question?', nextQuestionCode: null }),
      }

      const errors = validateConfig(config)
      expect(errors).toEqual([])
    })
  })

  describe('when config has cycles', () => {
    it('returns an error', () => {
      // '1' (START)
      //   - yes  =>  '2'
      //   - no   =>  '3'
      // '2'
      //   - yes  =>  '3'
      //   - no   =>  '3'
      // '3'
      //   - yes  =>  '4'
      //   - no   =>  '5'
      // '4' (!!! CYCLE to '1')
      //   - yes  =>  '1'
      //   - no   =>  '1'
      // '5' (END)
      //   - yes  =>  null
      //   - no   =>  null
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.startingQuestionCode = '1'
      config.questions = {
        '1': buildQuestion({
          code: '1',
          label: '1st question?',
          answers: [
            buildAnswer({
              code: 'yes',
              label: 'yes',
              nextQuestionCode: '2',
            }),
            buildAnswer({
              code: 'no',
              label: 'no',
              nextQuestionCode: '3',
            }),
          ],
        }),
        '2': buildQuestion({ code: '2', label: '2nd question?', nextQuestionCode: '3' }),
        '3': buildQuestion({
          code: '3',
          label: '3rd question?',
          answers: [
            buildAnswer({
              code: 'yes',
              label: 'yes',
              nextQuestionCode: '4',
            }),
            buildAnswer({
              code: 'no',
              label: 'no',
              nextQuestionCode: '5',
            }),
          ],
        }),
        '4': buildQuestion({ code: '4', label: '4th question cycle?', nextQuestionCode: '1' }),
        '5': buildQuestion({ code: '5', label: '5th question?', nextQuestionCode: null }),
      }

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toContain('question cycle detected: 1,2,3,4,1')
    })
  })

  describe('when config is big/complex', () => {
    it('completes in a reasonable time and without throwing exceptions', () => {
      const config: IncidentTypeConfiguration = ESCAPE_FROM_PRISON_1

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toEqual([])
    })
  })

  describe('when config is missing prisoner roles', () => {
    it('returns an error when none are present', () => {
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.prisonerRoles = []

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toEqual(['no active prisoner roles exist'])
    })

    it('returns an error when all are inactive', () => {
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.prisonerRoles = [
        {
          prisonerRole: 'PRESENT_AT_SCENE',
          onlyOneAllowed: false,
          active: false,
        },
      ]

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toEqual(['no active prisoner roles exist'])
    })
  })
})

function buildValidConfig(): IncidentTypeConfiguration {
  return {
    incidentType: 'FIND_6',
    startingQuestionCode: '1',
    active: true,
    questions: {
      '1': buildQuestion({
        code: '1',
        label: 'Is this the start?',
        nextQuestionCode: '2',
      }),
      '2': buildQuestion({
        code: '2',
        label: 'Do you wanna stop now?',
        nextQuestionCode: null,
      }),
    },
    prisonerRoles: [
      {
        prisonerRole: 'PRESENT_AT_SCENE',
        onlyOneAllowed: false,
        active: true,
      },
    ],
  }
}

function buildQuestion({
  code,
  label,
  active = true,
  multipleAnswers = false,
  answers,
  nextQuestionCode,
}: {
  code: string
  label: string
  active?: boolean
  multipleAnswers?: boolean
  answers?: AnswerConfiguration[] | null
  nextQuestionCode?: string | null
}): QuestionConfiguration {
  return {
    code,
    active,
    question: label.toUpperCase(),
    label,
    multipleAnswers,
    answers: answers ?? yesNoAnswers(nextQuestionCode),
  }
}

function yesNoAnswers(nextQuestionCode: string | null): AnswerConfiguration[] {
  return [
    buildAnswer({ code: 'yes', label: 'yes', nextQuestionCode }),
    buildAnswer({ code: 'no', label: 'no', nextQuestionCode }),
  ]
}

function buildAnswer({
  code,
  label,
  active = true,
  nextQuestionCode,
}: {
  code: string
  label: string
  active?: boolean
  nextQuestionCode: string | null
}): AnswerConfiguration {
  return {
    code,
    response: label.toUpperCase(),
    label,
    active,
    dateRequired: false,
    commentRequired: false,
    nextQuestionCode,
  }
}
