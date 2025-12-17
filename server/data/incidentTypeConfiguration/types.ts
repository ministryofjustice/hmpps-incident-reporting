import { type PrisonerInvolvementRole, type Type } from '../../reportConfiguration/constants'

/** Describes a question set for a given incident type (not family!) */
export interface IncidentTypeConfiguration {
  incidentType: Type
  active: boolean
  startingQuestionCode: string
  questions: Record<string, QuestionConfiguration>
  /** Allowed prisoner involvement roles for this report type */
  prisonerRoles: PrisonerRoleConfiguration[]
  /** At least one prisoner must be added for report to be valid (irrespective of their role) */
  requiresPrisoners?: boolean
  /** At least one staff member must be added for report to be valid (irrespective of their role) */
  requiresStaff?: boolean
}

/** Describes a question that may appear in a report */
export interface QuestionConfiguration {
  /** Question code (cannot contain hyphens), used to generate field names/ids */
  code: string
  active: boolean
  /** Question as seen by machines, e.g. it shouldn't change.
   *
   * For example, 'WHAT WAS THE METHOD OF CONCEALMENT'
   */
  question: string
  /** Additional hint text to be shown to users for this question */
  questionHint?: string
  /** Question as shown to humans.
   *
   * For example, 'What was the method of concealment?'
   */
  label: string
  multipleAnswers: boolean
  answers: AnswerConfiguration[]
}

/** Describes possible answers for a given question */
export interface AnswerConfiguration {
  /** Answer code (cannot contain hyphens), useful to generate unique names for comment/date inputs */
  code: string
  /** Answer as seen by machines, e.g. it shouldn't change.
   *
   * For example, 'DRONE RECOVERY' */
  response: string
  /** Additional hint text to be shown to users for this answer */
  responseHint?: string
  active: boolean
  /** Answer as shown to humans.
   *
   * For example, 'Drone recovery' */
  label: string
  /** Override the comment text label */
  commentLabel?: string
  dateRequired: boolean
  commentRequired: boolean
  /** Indicates this comment is not mandatory */
  commentNotMandatory?: boolean
  nextQuestionCode: string | null
}

/** Report type prisoner role configuration */
interface PrisonerRoleConfiguration {
  /** Role type for this report type */
  prisonerRole: PrisonerInvolvementRole
  /** If only one prisoner can have this role in a given report */
  onlyOneAllowed: boolean
  /** Indicates this role is active */
  active: boolean
  /** Additional text to be shown to users when they select this role */
  roleInformation?: string
}
