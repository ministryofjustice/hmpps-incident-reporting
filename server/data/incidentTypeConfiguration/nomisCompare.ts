import { isDeepStrictEqual } from 'node:util'

import type {
  IncidentTypeConfiguration as NomisIncidentTypeConfiguration,
  UpdateIncidentTypeConfigurationRequest,
} from '../prisonApi'

/**
 * Verifies that NOMIS now reflects the configuration we sent.
 *
 * The Prison API *request* and *response* use different field names, so both sides are reduced to a
 * common, comparable shape before diffing. Comparison is order-independent (items sorted by code),
 * so it checks content rather than incidental sequencing.
 */

interface NormalisedAnswer {
  code: string
  response: string
  active: boolean
  commentRequired: boolean
  dateRequired: boolean
  nextQuestionCode: string | null
}

interface NormalisedQuestion {
  code: string
  question: string
  active: boolean
  multipleAnswers: boolean
  answers: NormalisedAnswer[]
}

interface NormalisedRole {
  prisonerRole: string
  singleRole: boolean
  active: boolean
}

export interface NormalisedConfig {
  description: string
  active: boolean
  questions: NormalisedQuestion[]
  prisonerRoles: NormalisedRole[]
}

export interface ComparisonResult {
  inSync: boolean
  differences: string[]
}

const byCode = <T extends { code: string }>(a: T, b: T): number => a.code.localeCompare(b.code)
const byRole = (a: NormalisedRole, b: NormalisedRole): number => a.prisonerRole.localeCompare(b.prisonerRole)

/** Reduce the create/update request body we sent into the comparable shape */
export function normaliseSentRequest(request: UpdateIncidentTypeConfigurationRequest): NormalisedConfig {
  return {
    description: request.incidentTypeDescription,
    active: request.active,
    questions: request.questions
      .map(question => ({
        code: String(question.code),
        question: question.question,
        active: question.active,
        multipleAnswers: question.multipleAnswers,
        answers: question.answers
          .map(answer => ({
            code: String(answer.code),
            response: answer.response,
            active: answer.active,
            commentRequired: answer.commentRequired,
            dateRequired: answer.dateRequired,
            nextQuestionCode: answer.nextQuestionCode == null ? null : String(answer.nextQuestionCode),
          }))
          .sort(byCode),
      }))
      .sort(byCode),
    prisonerRoles: request.prisonerRoles
      .map(role => ({ prisonerRole: role.prisonerRole, singleRole: role.singleRole, active: role.active }))
      .sort(byRole),
  }
}

/** Reduce the config NOMIS returned (Prison API response shape) into the comparable shape */
export function normaliseNomisConfig(
  config: NomisIncidentTypeConfiguration | DatesAsStrings<NomisIncidentTypeConfiguration>,
): NormalisedConfig {
  return {
    description: config.incidentTypeDescription,
    active: config.active ?? true,
    questions: config.questions
      .map(question => ({
        code: String(question.questionnaireQueId),
        question: question.questionDesc,
        active: question.questionActiveFlag,
        multipleAnswers: question.multipleAnswerFlag,
        answers: question.answers
          .map(answer => ({
            code: String(answer.questionnaireAnsId),
            response: answer.answerDesc,
            active: answer.answerActiveFlag,
            commentRequired: answer.commentRequiredFlag,
            dateRequired: answer.dateRequiredFlag,
            nextQuestionCode: answer.nextQuestionnaireQueId == null ? null : String(answer.nextQuestionnaireQueId),
          }))
          .sort(byCode),
      }))
      .sort(byCode),
    prisonerRoles: config.prisonerRoles
      .map(role => ({ prisonerRole: role.prisonerRole, singleRole: role.singleRole, active: role.active }))
      .sort(byRole),
  }
}

/** Human-readable differences between what we sent and what NOMIS now holds */
function describeDifferences(sent: NormalisedConfig, got: NormalisedConfig): string[] {
  const differences: string[] = []

  if (sent.description !== got.description) {
    differences.push(`Description differs: sent “${sent.description}”, NOMIS holds “${got.description}”`)
  }
  if (sent.active !== got.active) {
    differences.push(`Active flag differs: sent ${sent.active}, NOMIS holds ${got.active}`)
  }

  const sentQuestions = new Map(sent.questions.map(question => [question.code, question]))
  const gotQuestions = new Map(got.questions.map(question => [question.code, question]))
  for (const code of sentQuestions.keys()) {
    if (!gotQuestions.has(code)) {
      differences.push(`Question ${code} is missing in NOMIS`)
    } else if (!isDeepStrictEqual(sentQuestions.get(code), gotQuestions.get(code))) {
      differences.push(`Question ${code} does not match NOMIS`)
    }
  }
  for (const code of gotQuestions.keys()) {
    if (!sentQuestions.has(code)) {
      differences.push(`NOMIS holds an unexpected question ${code}`)
    }
  }

  if (!isDeepStrictEqual(sent.prisonerRoles, got.prisonerRoles)) {
    differences.push('Prisoner roles do not match NOMIS')
  }

  return differences
}

/** Compare the sent request against the NOMIS response; reports whether they are in sync */
export function compareConfigs(
  sent: UpdateIncidentTypeConfigurationRequest,
  got: NomisIncidentTypeConfiguration | DatesAsStrings<NomisIncidentTypeConfiguration>,
): ComparisonResult {
  const normalisedSent = normaliseSentRequest(sent)
  const normalisedGot = normaliseNomisConfig(got)

  if (isDeepStrictEqual(normalisedSent, normalisedGot)) {
    return { inSync: true, differences: [] }
  }
  return { inSync: false, differences: describeDifferences(normalisedSent, normalisedGot) }
}
