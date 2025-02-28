import type FormWizard from 'hmpo-form-wizard'
import RemoveStaff from '../../../../controllers/removeStaff/removeStaff'

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    fields: ['removeStaff'],
    controller: RemoveStaff,
    template: 'confirm',
  },
}

export default steps
