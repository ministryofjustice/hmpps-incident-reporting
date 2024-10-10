import type FormWizard from 'hmpo-form-wizard'

import ChangeIncident from '../../controllers/changeIncident/changeIncident'

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    fields: ['incidentDate', 'incidentTime', 'prisonId', 'incidentTitle', 'incidentDescription'],
    controller: ChangeIncident,
    template: 'change',
  },
}

export default steps
