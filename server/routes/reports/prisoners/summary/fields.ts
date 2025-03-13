import type FormWizard from 'hmpo-form-wizard'

export const fields = {
  confirmAdd: {
    label: 'Do you want to add a prisoner?',
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
