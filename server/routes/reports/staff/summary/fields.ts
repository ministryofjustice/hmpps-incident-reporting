import type FormWizard from 'hmpo-form-wizard'

export const fields = {
  addStaff: {
    label: 'Were any staff involved in the incident?',
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
      {
        value: 'skip',
        label: 'Skip for now',
        hint: 'You can add staff later',
      },
    ],
  },
} satisfies FormWizard.Fields

export type Values = FormWizard.ValuesFromFields<typeof fields>
