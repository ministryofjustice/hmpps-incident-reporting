import type FormWizard from 'hmpo-form-wizard'

import GenericPage1 from '../../controllers/generic/genericPage1'
import GenericPage2 from '../../controllers/generic/genericPage2'
import GenericPage3 from '../../controllers/generic/genericPage3'

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    fields: ['incidentType'],
    controller: GenericPage1,
    template: 'page1',
    next: 'page2',
  },
  '/page2': {
    fields: ['staffType'],
    controller: GenericPage2,
    next: 'page3',
  },
  '/page3': {
    fields: ['seriousInjuries', 'minorInjuries', 'medicalTreatment', 'outsideHospital'],
    controller: GenericPage3,
  },
}

export default steps
