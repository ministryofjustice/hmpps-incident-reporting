/**
 * Application-specific overrides for HMPO Form Wizard types
 */
declare module 'hmpo-form-wizard' {
  namespace FormWizard {
    interface Field {
      name?: string
      label?: string
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
    }

    interface FieldItem {
      label?: string
      hint?: string

      // TODO: set in `generateFields`, but never read?
      dateRequired?: boolean
      commentRequired?: boolean
    }
  }
}
