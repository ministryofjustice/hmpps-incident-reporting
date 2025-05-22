import type FormWizard from 'hmpo-form-wizard'

export const hoursFieldName = '_incidentTime-hours' as const
export const minutesFieldName = '_incidentTime-minutes' as const

export const incidentDateAndTimeFields = {
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
} satisfies FormWizard.Fields
export type IncidentDateAndTimeValues = FormWizard.ValuesFromFields<typeof incidentDateAndTimeFields>

export const incidentDateAndTimeFieldNames = [
  'incidentDate',
  'incidentTime',
  hoursFieldName,
  minutesFieldName,
] as const satisfies (keyof typeof incidentDateAndTimeFields)[]
export type IncidentDateAndTimeFieldNames = (typeof incidentDateAndTimeFieldNames)[number]
