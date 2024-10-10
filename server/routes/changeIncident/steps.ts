import type FormWizard from 'hmpo-form-wizard'

import ChangeIncident from '../../controllers/changeIncident/changeIncident'

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'change',
  },
  '/change': {
    fields: ['incidentDate', 'incidentTime', 'prisonId', 'incidentTitle', 'incidentDescription'],
    controller: ChangeIncident,
  },
}

export default steps
