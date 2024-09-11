import { analyseNomisReportConfiguration } from './analyseNomisReportConfiguration'

describe('Analysing NOMIS report configuration', () => {
  describe('type uniqueness', () => {
    it('should return an error if some types are not unique', () => {
      const results = analyseNomisReportConfiguration([
        {
          incidentType: 'ASSAULT',
          incidentTypeDescription: 'Assaults 2020',
          questionnaireId: 1,
          questions: [],
          prisonerRoles: [],
          active: true,
        },
        {
          incidentType: 'ASSAULT1',
          incidentTypeDescription: 'Assaults 2021',
          questionnaireId: 2,
          questions: [],
          prisonerRoles: [],
          active: true,
        },
        {
          incidentType: 'ASSAULT',
          incidentTypeDescription: 'Assaults 2022',
          questionnaireId: 3,
          questions: [],
          prisonerRoles: [],
          active: true,
        },
      ])
      expect(results).toHaveLength(1)
      expect(results[0]).toHaveProperty('message', 'There are 3 configurations but 2 unique type codes')
    })

    it('should pass if all types are unique', () => {
      const results = analyseNomisReportConfiguration([
        {
          incidentType: 'ASSAULT',
          incidentTypeDescription: 'Assaults 2020',
          questionnaireId: 1,
          questions: [],
          prisonerRoles: [],
          active: true,
        },
        {
          incidentType: 'ASSAULT1',
          incidentTypeDescription: 'Assaults 2021',
          questionnaireId: 2,
          questions: [],
          prisonerRoles: [],
          active: true,
        },
        {
          incidentType: 'ASSAULT2',
          incidentTypeDescription: 'Assaults 2022',
          questionnaireId: 3,
          questions: [],
          prisonerRoles: [],
          active: true,
        },
      ])
      expect(results).toHaveLength(0)
    })
  })
})
