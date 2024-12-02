import nunjucks from 'nunjucks'

import { isBeingTransferred, isOutside, type OffenderSearchResult } from '../data/offenderSearchApi'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

/**
 * Normal display form of a person’s name (often a prisoner)
 * { "firstName": "DAVID", "lastName": "JONES", … } → "David Jones"
 */
export const nameOfPerson = (prisoner: { firstName: string; lastName: string }): string =>
  `${convertToTitleCase(prisoner.firstName)} ${convertToTitleCase(prisoner.lastName)}`.trim()

/**
 * Display form of a person’s name (often a prisoner) for lists and tables
 * { "firstName": "DAVID", "lastName": "JONES", … } → "Jones, David"
 */
export const reversedNameOfPerson = (prisoner: { firstName: string; lastName: string }): string => {
  if (!prisoner.lastName) {
    return convertToTitleCase(prisoner.firstName)
  }
  if (!prisoner.firstName) {
    return convertToTitleCase(prisoner.lastName)
  }
  return `${convertToTitleCase(prisoner.lastName)}, ${convertToTitleCase(prisoner.firstName)}`
}

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

/** Parse date in the form DD/MM/YYYY; the returned time part should be ignored. Throws an error when invalid */
export const parseDateInput = (input: string): Date => {
  const match = input && /^(?<day>\d{1,2})\/(?<month>\d{1,2})\/(?<year>\d{4})$/.exec(input.trim())
  if (!match) throw new Error('Invalid date')
  const { year, month, day } = match.groups
  const y = parseInt(year, 10)
  const m = parseInt(month, 10)
  const d = parseInt(day, 10)
  if (Number.isSafeInteger(y) && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
    const date = new Date(y, m - 1, d, 12)
    if (date && date.getDate() === d) {
      // ensures date is valid and js did not choose to roll forward to the next month
      return date
    }
  }
  throw new Error('Invalid date')
}

/** Parse time in the form HH:MM. Throws an error when invalid */
export const parseTimeInput = (input: string): { hours: number; minutes: number; time: string } => {
  const match = input && /^(?<hours>\d{1,2}):(?<minutes>\d\d)$/.exec(input.trim())
  if (!match) throw new Error('Invalid time')
  const { hours, minutes } = match.groups
  const h = parseInt(hours, 10)
  const m = parseInt(minutes, 10)
  if (h >= 0 && h < 24 && m >= 0 && m < 60)
    return {
      hours: h,
      minutes: m,
      time: `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`,
    }
  throw new Error('Invalid time')
}

/** Make an array of given length with a builder function */
export function buildArray<T>(length: number, builder: (index: number) => T): T[] {
  const array = Array(length)
  for (let index = 0; index < length; index += 1) {
    array[index] = builder(index)
  }
  return array
}

/** Converts all nested Dates into strings */
export function datesAsStrings<T>(obj: T): DatesAsStrings<T> {
  if (
    obj === undefined ||
    obj === null ||
    typeof obj === 'boolean' ||
    typeof obj === 'number' ||
    typeof obj === 'string'
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return obj
  }
  if (obj instanceof Date) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return obj.toISOString()
  }
  if (Array.isArray(obj)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return obj.map(datesAsStrings)
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Object.fromEntries(Object.entries(obj).map(([property, value]) => [property, datesAsStrings(value)]))
}

/**
 * Display location of a prisoner in prison, during transfer and outside/released
 */
export const prisonerLocation = (prisoner: OffenderSearchResult): string => {
  if (isBeingTransferred(prisoner)) {
    return prisoner.locationDescription || 'Transfer'
  }
  if (isOutside(prisoner)) {
    return prisoner.locationDescription || 'Outside'
  }
  return prisoner.cellLocation || 'Not known'
}

/** Convert camelCase or PascalCase into kebab-case */
export function kebabCase(str: string): string {
  return str
    ?.replace(/([A-Z])/g, '-$1')
    ?.replace(/^-/, '')
    ?.toLowerCase()
}

/**
 * Return a filename name for a macro
 * @param {string} macroName
 * @returns {string} returns naming convention based macro name
 */
function macroNameToFilepath(macroName: string): string {
  if (macroName.includes('govuk')) {
    return `govuk/components/${kebabCase(macroName.replace(/^\b(govuk)/, ''))}`
  }

  if (macroName.includes('moj')) {
    return `moj/components/${kebabCase(macroName.replace(/^\b(moj)/, ''))}`
  }

  return kebabCase(macroName.replace(/^\b(app)/, ''))
}

export function getComponentString(macroName: string, params = {}): string {
  const macroParams = JSON.stringify(params, null, 2)
  const filename = macroNameToFilepath(macroName)
  const macroString = `
      {%- from "${filename}/macro.njk" import ${macroName} -%}
      {{- ${macroName}(${macroParams}) -}}
    `

  return nunjucks.renderString(macroString, {})
}

/**
 * Adds missing question mark to a question.
 *
 * If a sentence is a question (based on the start of it) and it's missing
 * the question marks it adds it. The input string is trimmed.
 *
 * Examples:
 * - `'   DO BIRDS FLY  '` => `'DO BIRDS FLY?'`
 * - `'When did this happen?'` => `'When did this happen?'` (unchanged, already ended with question mark)
 * - `'Describe the incident'` => `'Describe the incident'` (unchanged, not a question)
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 *
 * @param label sentence to adjust
 * @returns trimmed sented with a question mark if it's a question.
 */
export function addQuestionMarkToQuestion(label: string): string {
  let result = label.trim()

  const questionsPrefixes = [
    'are',
    'can',
    'did',
    'do',
    'does',
    'from what',
    'from which',
    'has',
    'have',
    'how',
    'is',
    'to which',
    'was',
    'were',
    'what',
    'when',
    'where',
    'which',
    'who',
    'whose',
    'why',
    'with what',
  ]
  const labelStart = result.toLowerCase()
  if (questionsPrefixes.some(prefix => labelStart.startsWith(`${prefix} `))) {
    if (!result.endsWith('?')) {
      result += '?'
    }
  }

  return result
}

/**
 * Converts a string to sentence case
 *
 * First letter upper case, the rest in lower case. Preserve original
 * case of acronyms and other special words.
 *
 * @param str input string
 * @returns string in sentence case
 */
export function convertToSentenceCase(str: string): string {
  const preserveList = [
    'ACCT',
    'C.I',
    'C.N',
    'C.S',
    'CANDR',
    'CCTV',
    'CO2',
    'DIMU',
    'DJI',
    'DMIU',
    'DVD',
    'EGS',
    'F2052SH',
    'F2052SH/ACCT',
    'F78A',
    'FES',
    'GP',
    'H.C.C.',
    'HHMD',
    'HMPS',
    'HSE',
    'IEP',
    'IMB',
    'KPI',
    'Lewis',
    'LSD',
    'N/A',
    'NDTSG',
    'NOMS',
    'NOU',
    'NPS',
    'NTRG',
    'O.C',
    'OMA',
    'PPCS',
    'ROTL',
    'SFO',
    'SIM',
    'Stockholm',
    'T/R',
    'Tornado',
    'TV',
    'UAL',
    'UAV',
    'USB',
    'VPU',
    'YO',
    // 'IT', // IT is problematic: IT (Information Technology) or "it" pronoun?
  ]

  // If sentence ends with a question mark remove it and re-add it at the end
  let input = str.trim()
  let endsWithQuestionMark = false
  if (input.endsWith('?')) {
    endsWithQuestionMark = true
    input = input.substring(0, input.length - 1)
  }

  let words = input.split(/\s+/)
  words = words.map((word, index) => {
    const preservedWordFound = preserveList.find(preservedWord => preservedWord.toUpperCase() === word.toUpperCase())
    if (preservedWordFound) {
      return preservedWordFound
    }

    if (index === 0) {
      return properCase(word)
    }

    return word.toLowerCase()
  })

  let result = words.join(' ')
  if (endsWithQuestionMark) {
    result += '?'
  }
  return result
}
