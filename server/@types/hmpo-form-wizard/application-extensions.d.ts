/**
 * Application-specific overrides for HMPO Form Wizard types
 */
declare module 'hmpo-form-wizard' {
  namespace FormWizard {
    interface Field {
      name?: string
      label?: string
      visuallyHiddenText?: string
      hint?: string
      component?:
        | 'hidden'
        | 'govukCheckboxes'
        | 'govukInput'
        | 'govukRadios'
        | 'govukSelect'
        | 'govukTextarea'
        | 'mojDatePicker'
        | 'appTime'
      /** True when this field has only one active answer and is auto-selected (rendered as a hidden input) */
      singleAnswer?: boolean
    }

    interface FieldItem {
      label?: string
      visuallyHiddenText?: string
      hint?: string

      // TODO: set in `generateFields`, but never read?
      dateRequired?: boolean
      commentRequired?: boolean
    }
  }
}
