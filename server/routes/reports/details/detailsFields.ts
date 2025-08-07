import type FormWizard from 'hmpo-form-wizard'
import { incidentDateAndTimeFieldNames, incidentDateAndTimeFields } from './incidentDateAndTimeFields'

export const detailsFields = {
  ...incidentDateAndTimeFields,
  description: {
    label: 'Incident description',
    hint:
      'Include details in the answer so the description can stand alone as a report. ' +
      'Do not include sensitive information.',
    component: 'govukTextarea',
    validate: ['required'],
  },
} satisfies FormWizard.Fields
export type DetailsValues = FormWizard.ValuesFromFields<typeof detailsFields>

export const detailsFieldNames = [
  ...incidentDateAndTimeFieldNames,
  'description',
] as const satisfies (keyof typeof detailsFields)[]
export type DetailsFieldNames = (typeof detailsFieldNames)[number]
