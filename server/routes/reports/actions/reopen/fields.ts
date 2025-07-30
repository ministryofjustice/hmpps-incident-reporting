import type FormWizard from 'hmpo-form-wizard'

import type { UserAction } from '../../../../middleware/permissions'

export const fields = {
  userAction: {
    component: 'hidden',
    validate: ['required'],
    items: [
      {
        label: 'Reopen report',
        value: 'RECALL' satisfies UserAction,
      },
    ],
    default: 'RECALL' satisfies UserAction,
  },
} satisfies FormWizard.Fields

export type Values = FormWizard.ValuesFromFields<typeof fields>
