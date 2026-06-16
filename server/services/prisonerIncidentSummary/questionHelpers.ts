import type { Question } from '../../data/incidentReportingApi'

/**
 * Small helpers for reading a report's questions/responses. Shared by the summary breakdowns
 * (`breakdowns.ts`) and the per-incident list extractor (`list.ts`).
 *
 * `response.response` is the upper-case answer text/value, `response.code` the stable answer code,
 * and `response.label` the human-readable display text (e.g. "Cell"). `response.additionalInformation`
 * holds any free-text comment recorded against the answer.
 */

export function findQuestion(questions: Question[], questionCode: string): Question | undefined {
  return questions.find(question => question.code === questionCode)
}

/** Upper-case responses (the `response` field) given to a question, or [] if unanswered. */
export function responses(questions: Question[], questionCode: string): string[] {
  return findQuestion(questions, questionCode)?.responses.map(response => response.response) ?? []
}

/** Human-readable labels of the responses given to a question, or [] if unanswered. */
export function responseLabels(questions: Question[], questionCode: string): string[] {
  return findQuestion(questions, questionCode)?.responses.map(response => response.label) ?? []
}

/** True if the question has any response whose *code* is in `responseCodes`. */
export function hasAnyResponseCode(questions: Question[], questionCode: string, responseCodes: string[]): boolean {
  const question = findQuestion(questions, questionCode)
  if (!question) {
    return false
  }
  const wanted = new Set(responseCodes)
  return question.responses.some(response => wanted.has(response.code))
}

/** True if the question was answered, with any response whose *code* is not in `responseCodes`. */
export function hasResponseCodeOtherThan(
  questions: Question[],
  questionCode: string,
  responseCodes: string[],
): boolean {
  const question = findQuestion(questions, questionCode)
  if (!question) {
    return false
  }
  const excluded = new Set(responseCodes)
  return question.responses.some(response => !excluded.has(response.code))
}

/** True if the question was answered "YES" (used for the many yes/no questions). */
export function answeredYes(questions: Question[], questionCode: string): boolean {
  return responses(questions, questionCode).some(response => response === 'YES')
}

/** True if the question has any response starting with `prefix` (e.g. "YES - BLUNT..."). */
export function hasResponseStartingWith(questions: Question[], questionCode: string, prefix: string): boolean {
  return responses(questions, questionCode).some(response => response.startsWith(prefix))
}

/** True if the question has any response outside `excluded` (e.g. a non-NIL quantity). */
export function hasResponseNotIn(questions: Question[], questionCode: string, excluded: string[]): boolean {
  const exclude = new Set(excluded)
  return responses(questions, questionCode).some(response => !exclude.has(response))
}
