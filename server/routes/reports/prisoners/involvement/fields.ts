import type FormWizard from 'hmpo-form-wizard'

import { prisonerInvolvementOutcomes, prisonerInvolvementRoles } from '../../../../reportConfiguration/constants'

const prisonerRoleOptions: FormWizard.FieldItem[] = prisonerInvolvementRoles.map(role => ({
  label: role.description,
  value: role.code,
}))
const outcomeOptions: FormWizard.FieldItem[] = prisonerInvolvementOutcomes.map(outcome => ({
  label: outcome.description,
  value: outcome.code,
}))
outcomeOptions.unshift({
  label: 'No outcome',
  value: '',
})

export const fields = {
  prisonerRole: {
    label: 'What was the prisoner’s role?',
    component: 'govukRadios',
    validate: ['required'],
    items: prisonerRoleOptions,
  },
  outcome: {
    label: 'What was the outcome?',
    component: 'govukRadios',
    items: outcomeOptions,
  },
  comment: {
    label: 'Details of the prisoner’s involvement (optional)',
    component: 'govukTextarea',
  },
} satisfies FormWizard.Fields

export type Values = FormWizard.ValuesFromFields<typeof fields>
