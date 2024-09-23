import ESCAPE_FROM_CUSTODY from '../../reportConfiguration/types/ESCAPE_FROM_CUSTODY'
import { type QuestionConfiguration, type AnswerConfiguration, type IncidentTypeConfiguration } from './types'
import { validateConfig } from './validation'

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

  describe('when config has invalid starting question id', () => {
    it('returns an error', () => {
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.startingQuestionId = null

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toContain('startingQuestionId is null')
    })
  })

  describe('when config starting question is unknown', () => {
    it('returns an error', () => {
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.startingQuestionId = 'unknown question'

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toContain('starting question is unknown')
    })
  })

  describe('when config starting question is inactive', () => {
    it('returns an error', () => {
      const config: IncidentTypeConfiguration = buildValidConfig()
      config.questions[config.startingQuestionId].active = false

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
      config.questions['1'].answers[0].nextQuestionId = '42'
      config.questions['2'].answers[1].nextQuestionId = '100'

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toContain('some answers lead to these unknown or inactive questions: 42, 100')
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
        id: 'unreachable_1',
        label: 'Unreachable 1?',
        nextQuestionId: 'unreachable_2',
      })
      config.questions.unreachable_2 = buildQuestion({
        id: 'unreachable_2',
        label: 'Unreachable 2?',
        nextQuestionId: null,
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
      config.startingQuestionId = '1'
      config.questions = {
        '1': buildQuestion({
          id: '1',
          label: '1st question?',
          answers: [
            buildAnswer({
              label: 'yes',
              nextQuestionId: '2',
            }),
            buildAnswer({
              label: 'no',
              nextQuestionId: '3',
            }),
          ],
        }),
        '2': buildQuestion({ id: '2', label: '2nd question?', nextQuestionId: '3' }),
        '3': buildQuestion({
          id: '3',
          label: '3rd question?',
          nextQuestionId: '4',
        }),
        '4': buildQuestion({ id: '4', label: '4th question?', nextQuestionId: null }),
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
      config.startingQuestionId = '1'
      config.questions = {
        '1': buildQuestion({
          id: '1',
          label: '1st question?',
          answers: [
            buildAnswer({
              label: 'yes',
              nextQuestionId: '2',
            }),
            buildAnswer({
              label: 'no',
              nextQuestionId: '3',
            }),
          ],
        }),
        '2': buildQuestion({ id: '2', label: '2nd question?', nextQuestionId: '3' }),
        '3': buildQuestion({
          id: '3',
          label: '3rd question?',
          answers: [
            buildAnswer({
              label: 'yes',
              nextQuestionId: '4',
            }),
            buildAnswer({
              label: 'no',
              nextQuestionId: '5',
            }),
          ],
        }),
        '4': buildQuestion({ id: '4', label: '4th question cycle?', nextQuestionId: '1' }),
        '5': buildQuestion({ id: '5', label: '5th question?', nextQuestionId: null }),
      }

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toContain('question cycle detected: 1,2,3,4,1')
    })
  })

  describe('when config is big/complex', () => {
    it('completes in a reasonable time and without throwing exceptions', () => {
      const config: IncidentTypeConfiguration = ESCAPE_FROM_CUSTODY

      const errors = validateConfig(config).map(err => err.message)
      expect(errors).toEqual([])
    })
  })
})

function buildValidConfig(): IncidentTypeConfiguration {
  return {
    incidentType: 'FINDS',
    startingQuestionId: '1',
    active: true,
    questions: {
      '1': buildQuestion({
        id: '1',
        label: 'Is this the start?',
        nextQuestionId: '2',
      }),
      '2': buildQuestion({
        id: '2',
        label: 'Do you wanna stop now?',
        nextQuestionId: null,
      }),
    },
  }
}

function buildQuestion({
  id,
  label,
  answers,
  nextQuestionId,
}: {
  id: string
  label: string
  answers?: AnswerConfiguration[] | null
  nextQuestionId?: string | null
}): QuestionConfiguration {
  return {
    id,
    active: true,
    code: label.toUpperCase(),
    label,
    multipleAnswers: false,
    answers: answers ?? yesNoAnswers(nextQuestionId),
  }
}

function yesNoAnswers(nextQuestionId: string | null): AnswerConfiguration[] {
  return [buildAnswer({ label: 'yes', nextQuestionId }), buildAnswer({ label: 'no', nextQuestionId })]
}

function buildAnswer({ label, nextQuestionId }: { label: string; nextQuestionId: string | null }): AnswerConfiguration {
  return {
    code: label.toUpperCase(),
    active: true,
    label,
    dateRequired: false,
    commentRequired: false,
    nextQuestionId,
  }
}
