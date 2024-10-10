import type FormWizard from 'hmpo-form-wizard'

import CreateIncident from '../../controllers/createIncident/createIncident'

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    fields: ['incidentType', 'incidentDate', 'incidentTime', 'prisonId', 'incidentTitle', 'incidentDescription'],
    controller: CreateIncident,
    template: 'inputForm',
  },
}

export default steps
