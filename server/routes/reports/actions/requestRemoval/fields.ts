import type FormWizard from 'hmpo-form-wizard'

export const fields = {
  reason: {
    component: 'govukRadios',
    validate: ['required'],
    items: [
      {
        label: 'It is a duplicate',
        value: 'duplicate',
      },
      {
        label: 'It is not reportable',
        value: 'notReportable',
      },
    ],
  },
  originalReportReference: {
    label: 'Enter incident report number of the original report',
    component: 'govukInput',
    validate: ['required', 'numeric'],
    dependent: {
      field: 'reason',
      value: 'duplicate',
    },
  },
  duplicateComment: {
    label: 'Describe why it is a duplicate report (optional)',
    component: 'govukTextarea',
    dependent: {
      field: 'reason',
      value: 'duplicate',
    },
  },
  notReportableComment: {
    label: 'Describe why it is not reportable',
    component: 'govukTextarea',
    validate: ['required'],
    dependent: {
      field: 'reason',
      value: 'notReportable',
    },
  },
} satisfies FormWizard.Fields

export type Values = FormWizard.ValuesFromFields<typeof fields>
