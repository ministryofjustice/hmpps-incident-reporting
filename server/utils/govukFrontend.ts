type TextOrHtml = { text: string } | { html: string }

/**
 * GOV.UK radios component
 * https://design-system.service.gov.uk/components/radios/
 */
export type GovukRadios = {
  name: string
  items: GovukRadiosItem[]
  value?: string
  hint?: GovukHint
  errorMessage?: GovukErrorMessage | null | false
  idPrefix?: string
  classes?: string
  attributes?: Record<string, unknown>
}

/**
 * An item passed into the `items` property of a GOV.UK radios component
 * https://design-system.service.gov.uk/components/radios/#options-stacked-radios-example--items
 */
export type GovukRadiosItem = TextOrHtml & {
  value: string
  id?: string
  checked?: boolean
  disabled?: boolean
  attributes?: Record<string, unknown>
  label?: {
    classes?: string
    attributes?: Record<string, unknown>
  }
  hint?: GovukHint
  divider?: string
  conditional?: { html: string }
}

/**
 * GOV.UK checkboxes component
 * https://design-system.service.gov.uk/components/checkboxes/
 */
export type GovukCheckboxes = {
  name: string
  items: GovukCheckboxesItem[]
  values?: string[]
  hint?: GovukHint
  errorMessage?: GovukErrorMessage | null | false
  idPrefix?: string
  classes?: string
  attributes?: Record<string, unknown>
}

/**
 * An item passed into the `items` property of a GOV.UK check boxes component
 * https://design-system.service.gov.uk/components/checkboxes/#options-checkboxes-example--items
 */
export type GovukCheckboxesItem = GovukRadiosItem & {
  name?: string
  behaviour?: 'exclusive'
}

type GovukHint = TextOrHtml & {
  id?: string
  classes?: string
  attributes?: Record<string, unknown>
}

/**
 * GOV.UK select component
 * https://design-system.service.gov.uk/components/select/
 */
export type GovukSelect = {
  id: string
  name: string
  items: GovukSelectItem[]
  value?: string
  disabled?: boolean
  describedBy?: string
  label?: TextOrHtml & {
    for?: string
    isPageHeading?: boolean
    classes?: string
    attributes?: Record<string, unknown>
  }
  hint?: GovukHint
  errorMessage?: GovukErrorMessage | null | false
  classes?: string
  attributes?: Record<string, unknown>
}

/**
 * An item passed into the `items` property of a GOV.UK select component
 * https://design-system.service.gov.uk/components/select/
 */
export type GovukSelectItem = {
  text: string
  value?: string
  selected?: boolean
  disabled?: boolean
  attributes?: object
}

/**
 * GOV.UK error message component
 * https://design-system.service.gov.uk/components/error-message/
 */
export type GovukErrorMessage = TextOrHtml & {
  id?: string
  classes?: string
  attributes?: Record<string, unknown>
  visuallyHiddenText?: string
}

/**
 * GOV.UK error summary component
 * https://design-system.service.gov.uk/components/error-summary/
 */
export type GovukErrorSummary = ({ titleText: string } | { titleHtml: string }) &
  Partial<{ descriptionText: string } | { descriptionHtml: string }> & {
    errorList: GovukErrorSummaryItem
    disableAutoFocus?: boolean
    classes?: string
    attributes?: Record<string, unknown>
  }

/**
 * An item passed into the `errorList` property of a GOV.UK error summary component
 * https://design-system.service.gov.uk/components/error-summary/
 */
export type GovukErrorSummaryItem = TextOrHtml & {
  href: string
  attributes?: Record<string, unknown>
}

/**
 * Build error message for a field in error summary list if one is found.
 * Assumes that error summary links to a field by id.
 */
export function findFieldInGovukErrorSummary(
  list: GovukErrorSummaryItem[],
  formFieldId: string,
): GovukErrorMessage | null {
  if (!list) {
    return null
  }
  const item = list.find(error => error.href === `#${formFieldId}`)
  if (item) {
    return 'text' in item ? { text: item.text } : { html: item.html }
  }
  return null
}

/**
 * Marks items as checked depending on value for use with GOV.UK radios and checkboxes components
 */
export function govukCheckedItems<I extends GovukRadiosItem>(items: I[], singleValue: string | undefined): I[] {
  return items.map(item => {
    return {
      ...item,
      checked: item.value === singleValue,
    }
  })
}

/**
 * Marks items as checked depending on values for use with GOV.UK radios and checkboxes components
 */
export function govukMultipleCheckedItems<I extends GovukRadiosItem>(
  items: I[],
  multipleValues: string[] | undefined,
): I[] {
  return items.map(item => {
    return {
      ...item,
      checked: Boolean(multipleValues?.includes(item.value)),
    }
  })
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
  if (!items) {
    return items
  }
  if (value === undefined) {
    return items
  }
  return items.map(item => ({
    ...item,
    selected: 'value' in item ? item.value === value : item.text === value,
  }))
}