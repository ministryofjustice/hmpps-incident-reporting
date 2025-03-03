import type FormWizard from 'hmpo-form-wizard'

export const fields = {
  removeStaff: {
    label: 'Are you sure you want to remove this staff member?',
    component: 'govukRadios',
    validate: ['required'],
    name: 'removeStaff',
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
