import type FormWizard from 'hmpo-form-wizard'

export const addDescriptionFields = {
  descriptionAddendum: {
    label: 'Add information to the description',
    component: 'govukTextarea',
    validate: ['required'],
  },
} satisfies FormWizard.Fields

export type AddDescriptionValues = FormWizard.ValuesFromFields<typeof addDescriptionFields>
