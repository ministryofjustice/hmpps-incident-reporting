import { type PrisonerInvolvementRole, type Type } from '../../reportConfiguration/constants'

/** Describes a question set for a given incident type (not family!) */
export interface IncidentTypeConfiguration {
  incidentType: Type
  active: boolean
  startingQuestionId: string
  questions: Record<string, QuestionConfiguration>
  /** Allowed prisoner involvement roles for this report type */
  prisonerRoles: PrisonerRoleConfiguration[]
}

/** Describes a question that may appear in a report */
export interface QuestionConfiguration {
  /** Question ID (cannot contain hyphens), used to generate field names/ids */
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

/** Describes possible answers for a given question */
export interface AnswerConfiguration {
  /** Answer ID (cannot contain hyphens), useful to generate unique names for comment/date inputs */
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
