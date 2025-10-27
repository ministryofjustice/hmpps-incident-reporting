import type FormWizard from 'hmpo-form-wizard'

export const fields = {
  q: {
    label: 'Name or prison number',
    hint: 'If searching by name, enter last name and then first name. For example, Smith John.',
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
