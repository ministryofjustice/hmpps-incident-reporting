import type FormWizard from 'hmpo-form-wizard'

export const descriptionFields = {
  descriptionAddendum: {
    label: 'Add information to the description',
    component: 'govukTextarea',
    validate: ['required'],
  },
} satisfies FormWizard.Fields

export type Values = FormWizard.ValuesFromFields<typeof descriptionFields>
