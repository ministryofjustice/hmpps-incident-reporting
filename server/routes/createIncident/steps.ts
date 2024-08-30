import CreateIncident from '../../controllers/createIncident/createIncident'

const steps = {
  '/': {
    entryPoint: true,
    reset: true,
    resetJourney: true,
    skip: true,
    next: 'inputForm',
  },
  '/inputForm': {
    fields: ['incidentType', 'incidentDate', 'incidentTime', 'prisonId', 'incidentTitle', 'incidentDescription'],
    controller: CreateIncident,
  }
}

export default steps
