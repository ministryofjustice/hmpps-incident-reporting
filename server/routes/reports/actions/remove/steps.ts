import type FormWizard from 'hmpo-form-wizard'

import type { Values } from './fields'

// eslint-disable-next-line import/prefer-default-export
export const steps: FormWizard.Steps<Values> = {
  '/': {
    entryPoint: true,
    fields: ['removeReportMethod', 'incidentReportNumber', 'duplicateComment', 'notReportableComment'],
  },
}
