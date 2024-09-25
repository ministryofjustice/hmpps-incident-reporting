import { Type } from '../../reportConfiguration/constants'

export interface IncidentTypeConfiguration {
  incidentType: Type
  active: boolean
  startingQuestionId: string
  questions: Record<string, QuestionConfiguration>
}

export interface QuestionConfiguration {
  id: string
  active: boolean
  /** Question as seen by machines, e.g. it shouldn't change.
   *
   * For example: 'WHAT WAS THE METHOD OF CONCEALMENT'
   */
  code: string
  /** Question as shown to humans.
   *
   * For example: 'What was the method of concealment?'
   */
  label: string
  multipleAnswers: boolean
  answers: AnswerConfiguration[]
}

export interface AnswerConfiguration {
  /** Answer as seen by machines, e.g. it shouldn't change.
   *
   * For example 'DRONE RECOVERY' */
  code: string
  active: boolean
  /** Answer as shown to humans.
   *
   * For example 'Drone recovery' */
  label: string
  dateRequired: boolean
  commentRequired: boolean
  nextQuestionId: string | null
}
