import type FormWizard from 'hmpo-form-wizard'

import AddPrisoner from '../../controllers/addPrisoner/addPrisoner'

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    fields: ['prisonerRole', 'prisonerOutcome', 'prisonerComment'],
    controller: AddPrisoner,
    template: 'involvement',
  },
}

export default steps
