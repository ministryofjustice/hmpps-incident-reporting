import type FormWizard from 'hmpo-form-wizard'

export const fields = {
  confirmAdd: {
    label: 'Were any prisoners involved in the incident?',
    component: 'govukRadios',
    validate: ['required'],
    name: 'addPrisoner',
    items: [
      {
        value: 'yes',
        label: 'Yes',
      },
      {
        value: 'no',
        label: 'No',
      },
      {
        value: 'skip',
        label: 'Skip for now',
        hint: 'You can add prisoners later',
      },
    ],
  },
} satisfies FormWizard.Fields

export type Values = FormWizard.ValuesFromFields<typeof fields>
