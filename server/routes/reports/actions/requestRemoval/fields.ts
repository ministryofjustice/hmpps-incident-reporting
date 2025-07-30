import type FormWizard from 'hmpo-form-wizard'

import type { ApiUserAction } from '../../../../middleware/permissions'

export const fields = {
  userAction: {
    component: 'govukRadios',
    validate: ['required'],
    items: [
      {
        label: 'It is a duplicate',
        value: 'REQUEST_DUPLICATE' satisfies ApiUserAction,
      },
      {
        label: 'It is not reportable',
        value: 'REQUEST_NOT_REPORTABLE' satisfies ApiUserAction,
      },
    ],
  },
  originalReportReference: {
    label: 'Enter incident report number of the original report',
    component: 'govukInput',
    validate: ['required', 'numeric'],
    dependent: {
      field: 'userAction',
      value: 'REQUEST_DUPLICATE' satisfies ApiUserAction,
    },
  },
  duplicateComment: {
    label: 'Describe why it is a duplicate report (optional)',
    component: 'govukTextarea',
    dependent: {
      field: 'userAction',
      value: 'REQUEST_DUPLICATE' satisfies ApiUserAction,
    },
  },
  notReportableComment: {
    label: 'Describe why it is not reportable',
    component: 'govukTextarea',
    validate: ['required'],
    dependent: {
      field: 'userAction',
      value: 'REQUEST_NOT_REPORTABLE' satisfies ApiUserAction,
    },
  },
} satisfies FormWizard.Fields

export type Values = FormWizard.ValuesFromFields<typeof fields>
