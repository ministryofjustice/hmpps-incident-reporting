import type FormWizard from 'hmpo-form-wizard'

import AddPrisoner from '../../controllers/addPrisoner/addPrisoner'

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'involvement',
  },
  '/involvement': {
    fields: ['prisonerRole', 'prisonerOutcome', 'prisonerComment'],
    controller: AddPrisoner,
  },
}

export default steps
