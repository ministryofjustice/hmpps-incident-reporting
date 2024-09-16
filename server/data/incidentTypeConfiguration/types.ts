import { Type } from '../../reportConfiguration/constants'

export interface IncidentTypeConfiguration {
  incidentType: Type
  active: boolean
  startingQuestionId: string
  questions: Record<string, QuestionConfiguration>
}

export interface QuestionConfiguration {
  id: string
  label: string
  multipleAnswers: boolean
  answers: AnswerConfiguration[]
}

export interface AnswerConfiguration {
  label: string
  dateRequired: boolean
  commentRequired: boolean
  nextQuestionId: string | null
}
