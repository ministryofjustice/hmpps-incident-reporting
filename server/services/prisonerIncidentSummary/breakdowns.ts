import type { Question } from '../../data/incidentReportingApi'

/**
 * Detail breakdowns for the prisoner incident summary page.
 *
 * Each breakdown drills into a report's questions/responses to produce extra sub-counts for a
 * family. To keep this robust we only map the *currently active* type version for each family
 * (ASSAULT_5, DISORDER_2, SELF_HARM_1, FIND_6). Reports of older versions are skipped by these
 * extractors (they still count towards the family total in the overall section).
 *
 * The question/response codes below are taken from the matching config file in
 * `server/reportConfiguration/types/`. If a new active version ships, add a new extractor and
 * re-verify these codes against the new config.
 *
 * A single report may match several buckets (questions can have multiple answers), so the
 * sub-counts are report-counts and are not expected to sum to the family total.
 */

/** A single labelled count within a breakdown. */
export interface BreakdownRow {
  id: string
  label: string
  count: number
}

/** One rule: a stable id, a display label, and a predicate over a report's questions. */
interface BreakdownRule {
  id: string
  label: string
  matches: (questions: Question[]) => boolean
}

/** Run a set of rules across every report's questions, returning ordered labelled counts. */
function runRules(reportsQuestions: Question[][], rules: BreakdownRule[]): BreakdownRow[] {
  return rules.map(({ id, label, matches }) => ({
    id,
    label,
    count: reportsQuestions.filter(questions => matches(questions)).length,
  }))
}

// --- helpers operating on a single report's questions ---

function findQuestion(questions: Question[], code: string): Question | undefined {
  return questions.find(question => question.code === code)
}

/** Uppercase response *values* (the `response` field) given to a question, or [] if unanswered. */
function responseValues(questions: Question[], code: string): string[] {
  return findQuestion(questions, code)?.responses.map(response => response.response) ?? []
}

/** True if the question has any response whose *code* is in `responseCodes`. */
function hasAnyResponseCode(questions: Question[], code: string, responseCodes: string[]): boolean {
  const question = findQuestion(questions, code)
  if (!question) {
    return false
  }
  const wanted = new Set(responseCodes)
  return question.responses.some(response => wanted.has(response.code))
}

/** True if the question was answered "YES" (used for the many yes/no questions). */
function answeredYes(questions: Question[], code: string): boolean {
  return responseValues(questions, code).some(value => value === 'YES')
}

/** True if the question has any response value starting with `prefix` (e.g. "YES - BLUNT..."). */
function hasResponseValueStartingWith(questions: Question[], code: string, prefix: string): boolean {
  return responseValues(questions, code).some(value => value.startsWith(prefix))
}

/** True if the question has any response value outside `excluded` (e.g. a non-NIL quantity). */
function hasResponseValueNotIn(questions: Question[], code: string, excluded: string[]): boolean {
  const exclude = new Set(excluded)
  return responseValues(questions, code).some(value => !exclude.has(value))
}

// --- ASSAULT_5 ---

const ASSAULT_RULES: BreakdownRule[] = [
  // "WHAT TYPE OF ASSAULT WAS IT" (61287)
  { id: 'prisonerOnPrisoner', label: 'Prisoner on prisoner', matches: q => hasAnyResponseCode(q, '61287', ['213115']) },
  { id: 'prisonerOnStaff', label: 'Prisoner on staff', matches: q => hasAnyResponseCode(q, '61287', ['213116']) },
  { id: 'prisonerOnOther', label: 'Prisoner on other', matches: q => hasAnyResponseCode(q, '61287', ['213117']) },
  // "WAS A SERIOUS INJURY SUSTAINED" (61298)
  { id: 'serious', label: 'Serious injury sustained', matches: q => answeredYes(q, '61298') },
  // "WAS THIS A SEXUAL ASSAULT" (61285)
  { id: 'sexual', label: 'Sexual assault', matches: q => answeredYes(q, '61285') },
  // "WAS SPITTING USED IN THIS INCIDENT" (61290)
  { id: 'spitting', label: 'Spitting used', matches: q => answeredYes(q, '61290') },
  // "WAS MEDICAL TREATMENT FOR CONCUSSION OR INTERNAL INJURIES REQUIRED" (61305)
  { id: 'concussion', label: 'Concussion or internal injury treatment', matches: q => answeredYes(q, '61305') },
]

// --- DISORDER_2 ---

const DISORDER_RULES: BreakdownRule[] = [
  // "WHAT TYPE OF DISORDER INCIDENT WAS THIS?" (63179)
  {
    id: 'barricade',
    label: 'Barricade / prevention of access',
    matches: q => hasAnyResponseCode(q, '63179', ['214684']),
  },
  {
    id: 'concertedIndiscipline',
    label: 'Concerted indiscipline',
    matches: q => hasAnyResponseCode(q, '63179', ['214685']),
  },
  { id: 'hostage', label: 'Hostage', matches: q => hasAnyResponseCode(q, '63179', ['214686']) },
  { id: 'incidentAtHeight', label: 'Incident at height', matches: q => hasAnyResponseCode(q, '63179', ['214687']) },
]

// --- SELF_HARM_1 ---

const SELF_HARM_RULES: BreakdownRule[] = [
  // "DID SELF HARM METHOD INVOLVE CUTTING" (44753)
  { id: 'cutting', label: 'Cutting', matches: q => answeredYes(q, '44753') },
  // "DID SELF HARM METHOD INVOLVE SELF STRANGULATION" (44207) or "...HANGING" (44244)
  {
    id: 'strangulationOrHanging',
    label: 'Strangulation or hanging',
    matches: q => answeredYes(q, '44207') || answeredYes(q, '44244'),
  },
  // "DID SELF HARM METHOD INVOLVE BURNING" (45167)
  { id: 'burning', label: 'Burning', matches: q => answeredYes(q, '45167') },
  // "WAS ANY OTHER SELF HARM METHOD INVOLVED" (44552)
  { id: 'other', label: 'Other method', matches: q => answeredYes(q, '44552') },
]

// --- FIND_6 ---
//
// Categories can be recorded two ways: a single-select "PLEASE SELECT CATEGORY OF FIND" (67187),
// or "MULTIPLE TYPES" (67187 -> 218783) which walks each category as its own question. The rules
// below detect a category across both paths.

// "DESCRIBE THE DRUG FOUND" appears twice: single-select path (67190) and multiple-types path (67208).
const DRUG_QUESTION_CODES = ['67190', '67208'] as const
const NO_DRUG_VALUES = ['NONE FOUND', 'NIL'] as const

function drugValues(questions: Question[]): string[] {
  return DRUG_QUESTION_CODES.flatMap(code => responseValues(questions, code))
}

function findInvolvesAlcohol(questions: Question[]): boolean {
  return (
    hasAnyResponseCode(questions, '67187', ['218784']) || // category = ALCOHOL / HOOCH / DISTILLING EQUIPMENT
    hasResponseValueNotIn(questions, '67188', ['NIL']) || // single-path alcohol quantity
    hasResponseValueNotIn(questions, '67205', ['NIL']) || // multiple-types alcohol quantity
    hasResponseValueStartingWith(questions, '67206', 'YES') // distilling equipment found
  )
}

function findInvolvesDrugs(questions: Question[]): boolean {
  return (
    hasAnyResponseCode(questions, '67187', ['218785']) || // category = DRUG / DRUG EQUIPMENT
    answeredYes(questions, '67207') || // multiple-types "WERE ANY DRUGS FOUND"
    drugValues(questions).some(value => !(NO_DRUG_VALUES as readonly string[]).includes(value))
  )
}

function findInvolvesWeapons(questions: Question[]): boolean {
  return (
    hasAnyResponseCode(questions, '67187', ['218789']) || // category = WEAPON
    hasResponseValueStartingWith(questions, '67203', 'YES') || // single-path "WHAT WEAPON WAS FOUND?"
    hasResponseValueStartingWith(questions, '67224', 'YES') // multiple-types "WHAT WEAPON WAS FOUND?"
  )
}

const FIND_CATEGORY_RULES: BreakdownRule[] = [
  { id: 'alcohol', label: 'Alcohol', matches: findInvolvesAlcohol },
  { id: 'drugs', label: 'Drugs', matches: findInvolvesDrugs },
  { id: 'weapons', label: 'Weapons', matches: findInvolvesWeapons },
]

// Drug sub-types are matched on the response value text because the codes differ between the two
// "DESCRIBE THE DRUG FOUND" questions.
const CANNABIS_VALUES = ['CANNABIS', 'CANNABIS PLANT']
const COCAINE_VALUES = ['COCAINE', 'CRACK']
const NPS_VALUES = ['NPS (NEW PSYCHOACTIVE SUBSTANCES)']
const UNKNOWN_DRUG_VALUES = ['UNKNOWN']

function drugMatches(questions: Question[], values: string[]): boolean {
  const present = new Set(drugValues(questions))
  return values.some(value => present.has(value))
}

function drugMatchesOther(questions: Question[]): boolean {
  const accountedFor = new Set<string>([
    ...CANNABIS_VALUES,
    ...COCAINE_VALUES,
    ...NPS_VALUES,
    ...UNKNOWN_DRUG_VALUES,
    ...NO_DRUG_VALUES,
  ])
  return drugValues(questions).some(value => !accountedFor.has(value))
}

const FIND_DRUG_RULES: BreakdownRule[] = [
  { id: 'cannabis', label: 'Cannabis', matches: q => drugMatches(q, CANNABIS_VALUES) },
  { id: 'cocaine', label: 'Cocaine', matches: q => drugMatches(q, COCAINE_VALUES) },
  { id: 'nps', label: 'NPS (new psychoactive substances)', matches: q => drugMatches(q, NPS_VALUES) },
  { id: 'other', label: 'Other drug', matches: drugMatchesOther },
  { id: 'unknown', label: 'Unknown drug', matches: q => drugMatches(q, UNKNOWN_DRUG_VALUES) },
]

// --- public extractors ---

export function assaultBreakdown(reportsQuestions: Question[][]): BreakdownRow[] {
  return runRules(reportsQuestions, ASSAULT_RULES)
}

export function disorderBreakdown(reportsQuestions: Question[][]): BreakdownRow[] {
  return runRules(reportsQuestions, DISORDER_RULES)
}

export function selfHarmBreakdown(reportsQuestions: Question[][]): BreakdownRow[] {
  return runRules(reportsQuestions, SELF_HARM_RULES)
}

export interface FindBreakdown {
  categories: BreakdownRow[]
  drugs: BreakdownRow[]
}

export function findBreakdown(reportsQuestions: Question[][]): FindBreakdown {
  return {
    categories: runRules(reportsQuestions, FIND_CATEGORY_RULES),
    drugs: runRules(reportsQuestions, FIND_DRUG_RULES),
  }
}

/** The active type version that each extractor understands. Used to skip older versions. */
export const ACTIVE_DETAIL_TYPES = {
  ASSAULT: 'ASSAULT_5',
  DISORDER: 'DISORDER_2',
  SELF_HARM: 'SELF_HARM_1',
  FIND: 'FIND_6',
} as const
