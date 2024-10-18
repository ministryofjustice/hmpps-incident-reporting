/**
 * Application-specific overrides for HMPO Form Wizard types
 */
declare module 'hmpo-form-wizard' {
  import type { GovukErrorSummaryItem } from '../../utils/govukFrontend'

  namespace FormWizard {
    interface Field {
      name?: string
      label?: string

      component?: string

      // TODO: custom properties need major cleanup: we should group them into very few nested objects
      nameForErrors?: string
      errorMessage?: GovukErrorSummaryItem
      errorMessages?: Record<string, string>
      prefix?: string
      autocomplete?: 'off'
      rows?: string | number
      attributes?: Record<string, unknown>
    }

    interface FieldItem {
      id?: string
      label?: string

      // TODO: custom properties need major cleanup

      dateRequired?: boolean
      commentRequired?: boolean
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
