/**
 * An item passed into the `errorList` property of a GOV.UK error summary component
 * https://design-system.service.gov.uk/components/error-summary/
 */
import nunjucks from 'nunjucks'

import kebabCase from '../formatters/kebabCase'
import { isBeingTransferred, isOutside, type OffenderSearchResult } from '../data/offenderSearchApi'


export interface ErrorSummaryItem {
  text: string
  href: string
}

/**
 * An item passed into the `items` property of a GOV.UK select component
 * https://design-system.service.gov.uk/components/select/
 */
export interface GovukSelectItem {
  text: string
  value?: string
  selected?: boolean
  disabled?: boolean
  attributes?: object
}

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

/** Parse date in the form DD/MM/YYYY. Throws an error when invalid */
export const parseDateInput = (input: string): Date => {
  const match = input && /^(?<day>\d{1,2})\/(?<month>\d{1,2})\/(?<year>\d{4})$/.exec(input.trim())
  if (!match) throw new Error('Invalid date')
  const { year, month, day } = match.groups
  const y = parseInt(year, 10)
  const m = parseInt(month, 10)
  const d = parseInt(day, 10)
  if (Number.isSafeInteger(y) && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
    const date = new Date(y, m - 1, d)
    if (date) return date
  }
  throw new Error('Invalid date')
}

/** Find field error in error summary list */
export const findFieldInErrorSummary = (list: ErrorSummaryItem[], formFieldId: string): { text: string } | null => {
  if (!list) return null
  const item = list.find(error => error.href === `#${formFieldId}`)
  if (item) {
    return {
      text: item.text,
    }
  }
  return null
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

/** Insert an blank default value into a GOV.UK select component `items` list */
export const govukSelectInsertDefault = (
  items: GovukSelectItem[],
  text: string,
  selected = true,
): GovukSelectItem[] => {
  if (!items) return items
  return [
    {
      text,
      value: '',
      selected,
    },
    ...items,
  ]
}

/** Select an item inside a GOV.UK select component `items` list, by value */
export const govukSelectSetSelected = (items: GovukSelectItem[], value: string): GovukSelectItem[] => {
  if (!items) return items
  if (value === undefined) return items
  return items.map(entry => ({
    ...entry,
    selected: 'value' in entry ? entry.value === value : entry.text === value,
  }))
}

const template = '{% from "govuk/components/input/macro.njk" import govukInput %}{{ govukInput(params) }}'

export default function freeTextInput(params: object) {
  return nunjucks.renderString(template, { params })
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

export function getComponentString(macroName: string, params = {}) {
  const macroParams = JSON.stringify(params, null, 2)
  const filename = macroNameToFilepath(macroName)
  const macroString = `
      {%- from "${filename}/macro.njk" import ${macroName} -%}
      {{- ${macroName}(${macroParams}) -}}
    `
  return nunjucks.renderString(macroString, undefined)
}
