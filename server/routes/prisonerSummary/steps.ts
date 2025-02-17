import type FormWizard from 'hmpo-form-wizard'
import prisonerSummary from '../../controllers/prisonerSummary/prisonerSummary'

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    fields: ['addPrisoner'],
    controller: prisonerSummary,
    template: 'prisonerSummary',
  },
}

export default steps
