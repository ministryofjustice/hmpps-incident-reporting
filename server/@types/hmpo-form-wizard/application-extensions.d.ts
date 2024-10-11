/**
 * Application-specific overrides for HMPO Form Wizard types
 */
declare module 'hmpo-form-wizard' {
  import type { GovukErrorSummaryItem } from '../../utils/govukFrontend'

  namespace FormWizard {
    interface Field {
      // TODO: custom properties need major cleanup: we should group them into very few nested objects

      id?: string
      name?: string
      text?: string
      nameForErrors?: string
      errorMessage?: GovukErrorSummaryItem
      errorMessages?: Record<string, string>
      value?: unknown // TODO: value should be removed: it is already provided elsewhere
      component?: string
      classes?: string
      labelClasses?: string
      prefix?: string
      leadingZeros?: string
      autocomplete?: 'off'
      rows?: string | number
      attributes?: Record<string, unknown>
      label?: {
        text: string
        classes?: string
      }
      hint?: {
        text: string
        classes?: string
      }
      fieldset?: {
        legend?: {
          text: string
          classes?: string
        }
      }
    }

    interface FieldItem {
      // TODO: custom properties need major cleanup

      text?: string
      label?: string
      dateRequired?: boolean
      commentRequired?: boolean
      hint?: {
        text: string
        classes?: string
      }
      divider?: string
      behaviour?: 'exclusive'
      conditional?: ConditionalFieldItem | ConditionalFieldItem[]
    }

    type ConditionalFieldItem =
      | string
      | {
          id?: string
          name?: string
          html?: string
        }

    interface Locals {
      // TODO: custom properties need major cleanup

      fields: FormWizard.Fields // TODO: fields should be removed as they appear inside options already
      validationErrors: GovukErrorSummaryItem[]
    }
  }
}
