import type FormWizard from 'hmpo-form-wizard'
import RemovePrisoner from '../../../../controllers/removePrisoner/removePrisoner'

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    fields: ['removePrisoner'],
    controller: RemovePrisoner,
    template: 'confirm',
  },
}

export default steps
