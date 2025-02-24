import type FormWizard from 'hmpo-form-wizard'

import type { Values } from './fields'
import { AddManualStaffInvolvementController, ManualStaffNameController } from './controllers'

// eslint-disable-next-line import/prefer-default-export
export const steps: FormWizard.Steps<Values> = {
  '/': {
    entryPoint: true,
    fields: ['firstName', 'lastName'],
    controller: ManualStaffNameController,
    template: 'pages/staff/manualName',
    next: 'details',
  },
  '/details': {
    fields: ['staffRole', 'comment'],
    controller: AddManualStaffInvolvementController,
    template: 'pages/staff/involvement',
  },
}
