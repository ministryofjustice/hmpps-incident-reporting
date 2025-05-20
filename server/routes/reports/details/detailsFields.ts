import type FormWizard from 'hmpo-form-wizard'

export const hoursFieldName = '_incidentTime-hours' as const
export const minutesFieldName = '_incidentTime-minutes' as const

export const detailsFields = {
  incidentDate: {
    label: 'Date of incident',
    hint: 'For example, 17/5/2024',
    component: 'mojDatePicker',
    validate: ['required', 'ukDate'],
  },
  incidentTime: {
    label: 'Time of incident',
    hint: 'Use the 24 hour clock. For example, 09 08 or 17 32',
    component: 'appTime',
    validate: ['required', 'ukTime'],
  },
  [hoursFieldName]: {},
  [minutesFieldName]: {},
  description: {
    label: 'Incident description',
    hint:
      'Include enough detail that the description can stand alone as a report. ' +
      'Do not include sensitive information.',
    component: 'govukTextarea',
    validate: ['required'],
  },
} satisfies FormWizard.Fields
export type DetailsValues = FormWizard.ValuesFromFields<typeof detailsFields>

export const detailsFieldNames = [
  'incidentDate',
  'incidentTime',
  hoursFieldName,
  minutesFieldName,
  'description',
] as const satisfies (keyof typeof detailsFields)[]
export type DetailsFieldNames = (typeof detailsFieldNames)[number]
