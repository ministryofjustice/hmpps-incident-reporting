import { getPrisonerInvolvementRoleDetails } from '../../reportConfiguration/constants'
import type {
  CreateIncidentTypeConfigurationRequest,
  NomisAnswerRequest,
  NomisPrisonerRoleRequest,
  NomisQuestionRequest,
  UpdateIncidentTypeConfigurationRequest,
} from '../prisonApi'
import type { IncidentTypeConfiguration, QuestionConfiguration } from './types'

/**
 * Builds the Prison API request bodies that push a DPS incident-type configuration into NOMIS.
 *
 * This is the shared home for logic that used to live in `scripts/buildNomisIncidentTypePayload.ts`
 * and is now driven by the admin sync screen. Note the DPS→NOMIS field renames:
 *   - `commentRequested` → `commentRequired`
 *   - `dateMandatory`    → `dateRequired`
 *   - `onlyOneAllowed`   → `singleRole`
 * and DPS prisoner-role codes are mapped to their NOMIS reference codes.
 */

/** Metadata (from the `types` constant) needed alongside the DPS config to build a NOMIS payload */
export interface NomisSyncMeta {
  /** NOMIS incident-type code (max 12 chars) — distinct from the DPS type code */
  nomisCode: string
  /** Incident type description */
  description: string
  /**
   * Whether the type is active. In NOMIS this only sets the questionnaire's expiry date and pushes
   * inactive types to the end of the list; it does not hide them from reads. In practice the sync
   * screen only offers active types, so this is always `true` today.
   */
  active: boolean
}

/**
 * Orders questions the way a user would be presented with them:
 * DFS from the starting question, following `nextQuestionCode` on active answers (answer order
 * preserved, cycle-safe), then any questions unreachable from the start appended in a stable,
 * numeric-aware order.
 *
 * This ordering is load-bearing, not cosmetic: Prison API derives a question's `QUE_SEQ` and
 * `LIST_SEQ` from its *position in this array* (`questions.mapIndexed { index, q -> ... }`) and
 * sorts by `LIST_SEQ` on read. The array order therefore becomes the questionnaire order in NOMIS.
 * The same holds for answers within a question, and for prisoner roles.
 *
 * Inactive answers are skipped when following the flow — a retired answer should not route the
 * ordering — but every question and answer still reaches the payload; see {@link buildNomisQuestions}.
 * Appending unreachable questions last also keeps them on the high sequence numbers, clear of the
 * live flow.
 */
export function orderQuestionsByFlow(dpsConfig: IncidentTypeConfiguration): QuestionConfiguration[] {
  const questionsByCode = dpsConfig.questions
  const visited = new Set<string>()
  const orderedCodes: string[] = []

  const dfs = (code: string | null | undefined): void => {
    if (!code) return
    const question = questionsByCode[code]
    if (!question || visited.has(code)) return
    visited.add(code)
    orderedCodes.push(code)

    const seenNext = new Set<string>()
    question.answers.forEach(answer => {
      if (!answer.active) return
      const next = answer.nextQuestionCode
      if (!next || !questionsByCode[next] || seenNext.has(next)) return
      seenNext.add(next)
      dfs(next)
    })
  }

  dfs(dpsConfig.startingQuestionCode)

  const remaining = Object.keys(questionsByCode).filter(code => !visited.has(code))
  const compareCodes = (a: string, b: string): number => {
    const ai = parseInt(a, 10)
    const bi = parseInt(b, 10)
    if (!Number.isNaN(ai) && !Number.isNaN(bi)) return ai - bi
    return a.localeCompare(b)
  }
  remaining.sort(compareCodes)

  return [...orderedCodes, ...remaining].map(code => questionsByCode[code]).filter(Boolean)
}

/**
 * Maps DPS questions/answers into the NOMIS request shape, ordered by question flow.
 *
 * Deliberately sends *every* question and answer, inactive ones included, marked `active: false`
 * (Prison API gives those an expiry date). They must not be filtered out: the update wholesale-
 * replaces the questionnaire (`clear()` + `addAll` under `orphanRemoval = true`), so omitting an
 * inactive question would delete it and its answers from NOMIS, orphaning historic reports that
 * reference them.
 */
export function buildNomisQuestions(dpsConfig: IncidentTypeConfiguration): NomisQuestionRequest[] {
  return orderQuestionsByFlow(dpsConfig).map(question => ({
    code: question.code,
    active: question.active,
    question: question.question,
    multipleAnswers: question.multipleAnswers,
    answers: question.answers.map(
      (answer): NomisAnswerRequest => ({
        code: answer.code,
        response: answer.response,
        active: answer.active,
        // In NOMIS this flag means the comment is requested (it is never mandatory there)
        commentRequired: answer.commentRequested,
        dateRequired: answer.dateMandatory,
        nextQuestionCode: answer.nextQuestionCode,
      }),
    ),
  }))
}

/** Maps DPS prisoner roles into the NOMIS request shape, translating role codes to NOMIS codes */
export function buildNomisPrisonerRoles(dpsConfig: IncidentTypeConfiguration): NomisPrisonerRoleRequest[] {
  return dpsConfig.prisonerRoles.map(prisonerRole => ({
    prisonerRole: getPrisonerInvolvementRoleDetails(prisonerRole.prisonerRole)?.nomisCode ?? prisonerRole.prisonerRole,
    singleRole: prisonerRole.onlyOneAllowed,
    active: prisonerRole.active,
  }))
}

/** Body for `PUT /api/incidents/configuration/{nomisCode}` (updates an existing NOMIS type) */
export function buildUpdateRequest(
  dpsConfig: IncidentTypeConfiguration,
  { description, active }: Pick<NomisSyncMeta, 'description' | 'active'>,
): UpdateIncidentTypeConfigurationRequest {
  return {
    incidentTypeDescription: description,
    active,
    questions: buildNomisQuestions(dpsConfig),
    prisonerRoles: buildNomisPrisonerRoles(dpsConfig),
  }
}

/** Body for `POST /api/incidents/configuration` (creates a new NOMIS type) */
export function buildCreateRequest(
  dpsConfig: IncidentTypeConfiguration,
  { nomisCode, description, active }: NomisSyncMeta,
): CreateIncidentTypeConfigurationRequest {
  return {
    incidentType: nomisCode,
    ...buildUpdateRequest(dpsConfig, { description, active }),
  }
}
