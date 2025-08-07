import type FormWizard from 'hmpo-form-wizard'

import type { Values } from './fields'
import { AddManualStaffInvolvementController, ManualStaffNameController } from './controllers'

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
