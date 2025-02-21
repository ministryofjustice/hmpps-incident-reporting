import type FormWizard from 'hmpo-form-wizard'

export const fields = {
  addStaff: {
    label: 'Do you want to add a member of staff?',
    component: 'govukRadios',
    validate: ['required'],
    name: 'addStaff',
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
