type TextOrHtml = { text: string } | { html: string }

/**
 * GOV.UK label sub-component
 */
export type GovukLabel = TextOrHtml & {
  for?: string
  isPageHeading?: boolean
  classes?: string
  attributes?: Record<string, unknown>
}

/**
 * GOV.UK hint sub-component
 */
export type GovukHint = TextOrHtml & {
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
  label?: GovukLabel
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
