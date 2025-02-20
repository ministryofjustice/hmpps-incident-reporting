import type FormWizard from 'hmpo-form-wizard'
import StaffSummary from '../../controllers/staffSummary/staffSummary'

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    fields: ['addStaff'],
    controller: StaffSummary,
    template: 'staffSummary',
  },
}

export default steps
