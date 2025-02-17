import type FormWizard from 'hmpo-form-wizard'
import PrisonerSummary from '../../controllers/prisonerSummary/prisonerSummary'

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    fields: ['addPrisoner'],
    controller: PrisonerSummary,
    template: 'prisonerSummary',
  },
}

export default steps
