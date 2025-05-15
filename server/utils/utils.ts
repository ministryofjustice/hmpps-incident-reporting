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

export const possessive = (word: string): string => {
  const wordStr = word?.trim() ?? ''
  if (!wordStr) {
    return ''
  }
  return wordStr.toLowerCase().endsWith('s') ? `${wordStr}’` : `${wordStr}’s`
}

/** Years since a given string date (parseable using `new Date()`) or null */
export function yearsSince(dateString: string): number | null {
  if (!dateString) {
    return null
  }
  const date = new Date(dateString)
  if (!date || !date.getDate()) {
    return null
  }
  const now = new Date()
  const years = now.getFullYear() - date.getFullYear()
  date.setFullYear(now.getFullYear())
  return date > now ? years - 1 : years
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
  // Special words (e.g. acronyms) - Preserve case if possible
  const preserveList = [
    'A1',
    'ACCT',
    'ADA',
    'AFFF',
    'AirPods',
    'Amazon',
    'AMD',
    'Apple',
    'BDH',
    'C.I',
    'C.N',
    'C.S',
    'CANDR',
    'CCTV',
    'CO2',
    'CPS',
    'CRC',
    'DIMU',
    'DJI',
    'DMIU',
    'DVD',
    'DYI',
    'EGS',
    'F2052SH',
    'F78A',
    'FES',
    'GOAD',
    'GP',
    'H.C.C.',
    'HCO',
    'HHMD',
    'HMD',
    'HMPPS',
    'HMPS',
    'HMP',
    'HSE',
    'IEP',
    'IMB',
    'iPad',
    'KPI',
    'Lewis',
    'LSD',
    'MiFi',
    'N/A',
    'NDTSG',
    'NOMS',
    'NOU',
    'NPS',
    'NTRG', // TODO: is it NTRG or NRTG?
    'O.C',
    'OMA',
    'ORRU',
    'P.E.',
    'PEMS',
    'PPCS',
    'ROTL',
    'SFO',
    'SIM',
    'SSU',
    'Stockholm',
    'T/R',
    'Tornado',
    'TV',
    'UAL',
    'UAV',
    'UKBA',
    'USB',
    'UV',
    'Vantive',
    'VPU',
    'YO',
    'YOI',
    // 'IT', // IT is problematic: IT (Information Technology) or "it" pronoun?
  ]

  const input = str.trim()
  if (input.length === 0) {
    return ''
  }

  // match words or non-words
  const regex = /(\w+|[^\w\s]+|\s)/g
  const parts = input.match(regex)
  const mapped = parts.map((part, index) => {
    if (/\w+/.test(part)) {
      const word = part

      const preservedWordFound = preserveList.find(preservedWord => preservedWord.toUpperCase() === word.toUpperCase())
      if (preservedWordFound) {
        return preservedWordFound
      }

      if (index === 0) {
        return properCase(word)
      }

      return word.toLowerCase()
    }

    return part
  })
  let result = mapped.join('')

  // remove duplicated spaces
  result = result.replace(/\s+/g, ' ')

  // post-process multi-word case exceptions
  result = postProcessSentenceCase(result)

  return result
}

function postProcessSentenceCase(input: string): string {
  const exceptions: { match: RegExp; replace: string | ((match: string, ...args: string[]) => string) }[] = [
    {
      match: /\bA AND E\b/i,
      replace: 'A&E',
    },
    {
      match: /^IT$/i,
      replace: 'IT',
    },
    {
      match: /\bN\/A\b/i,
      replace: 'N/A',
    },
    {
      match: /\bCategory ([ABCDE])\b/i,
      replace: (_: string, category: string) => `Category ${category.toUpperCase()}`,
    },
  ]
  let output = input
  for (const { match, replace } of exceptions) {
    output = output.replace(match, replace as string)
  }
  return output
}

export function checkForOutliers(inputValues: string | string[], compareValues: string[]): boolean {
  if (Array.isArray(inputValues)) {
    return inputValues.some(value => !compareValues.includes(value))
  }
  return !compareValues.includes(inputValues)
}
