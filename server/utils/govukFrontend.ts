type TextOrHtml = { text: string } | { html: string }

export type GovukErrorMessage = TextOrHtml & {
  id?: string
  classes?: string
  attributes?: Record<string, unknown>
  visuallyHiddenText?: string
}

export type GovukErrorSummary = ({ titleText: string } | { titleHtml: string }) &
  Partial<{ descriptionText: string } | { descriptionHtml: string }> & {
    errorList: GovukErrorSummaryItem
    disableAutoFocus?: boolean
    classes?: string
    attributes?: Record<string, unknown>
  }

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
