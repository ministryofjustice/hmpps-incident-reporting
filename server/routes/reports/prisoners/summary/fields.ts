import type FormWizard from 'hmpo-form-wizard'

export const fields = {
  addPrisoner: {
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
    ],
  },
} satisfies FormWizard.Fields

export type Values = FormWizard.ValuesFromFields<typeof fields>
