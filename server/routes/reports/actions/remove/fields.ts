import type FormWizard from 'hmpo-form-wizard'

export const fields = {
  removeReportMethod: {
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
  incidentReportNumber: {
    label: 'Enter incident number of the original report',
    component: 'govukInput',
    validate: ['required', 'numeric'],
    dependent: {
      field: 'removeReportMethod',
      value: 'duplicate',
    },
  },
  duplicateComment: {
    label: 'Describe why it is not reportable',
    component: 'govukTextarea',
    dependent: {
      field: 'removeReportMethod',
      value: 'duplicate',
    },
  },
  notReportableComment: {
    label: 'Describe why it is not reportable',
    component: 'govukTextarea',
    validate: ['required'],
    dependent: {
      field: 'removeReportMethod',
      value: 'notReportable',
    },
  },
} satisfies FormWizard.Fields

export type Values = FormWizard.ValuesFromFields<typeof fields>
