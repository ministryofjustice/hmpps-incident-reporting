import type FormWizard from 'hmpo-form-wizard'

import { fields as addFields } from '../fields'

const nameFields = {
  firstName: {
    label: 'First name',
    component: 'govukInput',
    validate: ['required'],
  },
  lastName: {
    label: 'Last name',
    component: 'govukInput',
    validate: ['required'],
  },
} satisfies FormWizard.Fields

export const fields = {
  ...nameFields,
  ...addFields,
} satisfies FormWizard.Fields

export type Values = FormWizard.ValuesFromFields<typeof fields>
