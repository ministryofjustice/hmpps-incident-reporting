import type FormWizard from 'hmpo-form-wizard'

export const fields = {
  q: {
    label: 'Name',
    component: 'govukInput',
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
