import { type PrisonerInvolvementRole, type Type } from '../../reportConfiguration/constants'

export interface IncidentTypeConfiguration {
  incidentType: Type
  active: boolean
  startingQuestionId: string
  questions: Record<string, QuestionConfiguration>
  /** Allowed prisoner involvement roles for this report type */
  prisonerRoles: PrisonerRoleConfiguration[]
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
  /** Answer ID, useful to generate unique names for comment/date inputs */
  id: string
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

/** Report type prisoner role configuration */
interface PrisonerRoleConfiguration {
  /** Role type for this report type */
  prisonerRole: PrisonerInvolvementRole
  /** If only one prisoner can have this role in a given report */
  onlyOneAllowed: boolean
  /** Indicates this role is active */
  active: boolean
}

/** Finds the Answer config for a given answer code */
export function findAnswerConfigByCode(answerCode: string, questionConfig: QuestionConfiguration): AnswerConfiguration {
  return questionConfig.answers.find(answerConfig => answerConfig.code.trim() === answerCode.trim())
}

/** Strips `QID-0...` prefix and returns the question ID
 *
 * TODO: Remove QID-stripping logic once removed from API
 */
export function stripQidPrefix(code: string): string {
  const re = /^QID-0*/

  return code.replace(re, '')
}
