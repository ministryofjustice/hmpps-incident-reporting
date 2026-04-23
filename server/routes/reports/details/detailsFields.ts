import type FormWizard from 'hmpo-form-wizard'

import { incidentDateAndTimeFieldNames, incidentDateAndTimeFields } from './incidentDateAndTimeFields'

export const detailsFields = {
  ...incidentDateAndTimeFields,
  description: {
    label: 'Incident description',
    hint:
      'Include enough detail for the description to stand alone as a full report. ' +
      'Throughout this report, do not include details of staff who may be under investigation.',
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
