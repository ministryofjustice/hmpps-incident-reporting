import type FormWizard from 'hmpo-form-wizard'

import { staffInvolvementRoles } from '../../../../reportConfiguration/constants'

const staffRoleOptions: FormWizard.FieldItem[] = staffInvolvementRoles.map(role => ({
  label: role.description,
  value: role.code,
}))

export const fields = {
  staffRole: {
    label: 'How was the staff member involved in the incident?',
    component: 'govukRadios',
    validate: ['required'],
    items: staffRoleOptions,
  },
  comment: {
    label: 'Details of the staff member’s involvement (optional)',
    component: 'govukTextarea',
  },
} satisfies FormWizard.Fields

export type Values = FormWizard.ValuesFromFields<typeof fields>
