import type FormWizard from 'hmpo-form-wizard'

export const fields = {
  removePrisoner: {
    label: 'Are you sure you want to remove this prisoner?',
    component: 'govukRadios',
    validate: ['required'],
    name: 'removePrisoner',
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
