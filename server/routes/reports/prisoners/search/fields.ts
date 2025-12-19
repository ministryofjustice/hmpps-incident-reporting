import type FormWizard from 'hmpo-form-wizard'

export const fields = {
  q: {
    label: 'Name or prison number',
    component: 'govukInput',
    validate: ['required'],
  },
  global: {
    label: 'Where to search for the prisoner?',
    component: 'govukRadios',
    items: [
      { label: 'In your active caseload', value: 'no' },
      { label: 'In any establishment (global)', value: 'yes' },
    ],
    default: 'no',
    validate: ['required'],
  },
  prisonerLocationStatus: {
    label: 'Location status of prisoner',
    component: 'govukSelect',
    items: [
      {
        value: 'ALL',
        label: 'All',
      },
      {
        value: 'IN',
        label: 'Inside',
      },
      {
        value: 'OUT',
        label: 'Outside',
      },
    ],
  },
  prisonerGender: {
    label: 'Prisoner gender',
    component: 'govukSelect',
    items: [
      {
        value: 'ALL',
        label: 'All',
      },
      {
        value: 'M',
        label: 'Male',
      },
      {
        value: 'F',
        label: 'Female',
      },
      {
        value: 'NK',
        label: 'Not known',
      },
      {
        value: 'NS',
        label: 'Not specified',
      },
    ],
  },
  prisonerDateOfBirth: {
    component: 'mojDatePicker',
    validate: ['ukDate'],
  },
  page: {
    label: 'Page',
    component: 'hidden',
    default: '1',
    validate: [
      {
        type: 'min',
        fn: (value: unknown): boolean => {
          if (!value) {
            return false
          }
          const n = parseInt(value as string, 10)
          return n >= 1
        },
      },
    ],
  },
} satisfies FormWizard.Fields

export type Values = FormWizard.ValuesFromFields<typeof fields>
