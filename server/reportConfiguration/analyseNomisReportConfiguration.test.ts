import { basicIncidentReportConfiguration } from '../data/testData/prisonApi'
import { analyseNomisReportConfiguration } from './analyseNomisReportConfiguration'

describe('Analysing NOMIS report configuration', () => {
  describe('id & type uniqueness', () => {
    it('should return an error if some ids are not unique', () => {
      const reportConfiguration = structuredClone(basicIncidentReportConfiguration)
      // make second config id a duplicate
      reportConfiguration[1].questionnaireId = reportConfiguration[0].questionnaireId
      const results = analyseNomisReportConfiguration(reportConfiguration)
      expect(results).toHaveLength(1)
      expect(results[0]).toHaveProperty('message', 'There are 2 configurations but 1 unique ids')
    })

    it('should return an error if some types are not unique', () => {
      const reportConfiguration = structuredClone(basicIncidentReportConfiguration)
      // make second config type a duplicate
      reportConfiguration[1].incidentType = reportConfiguration[0].incidentType
      const results = analyseNomisReportConfiguration(reportConfiguration)
      expect(results).toHaveLength(1)
      expect(results[0]).toHaveProperty('message', 'There are 2 configurations but 1 unique types')
    })

    it('should return an error if some question ids are not unique', () => {
      const reportConfiguration = structuredClone(basicIncidentReportConfiguration)
      // make second question id of second report a duplicate
      reportConfiguration[1].questions[1].questionnaireQueId = reportConfiguration[1].questions[0].questionnaireQueId
      const results = analyseNomisReportConfiguration(reportConfiguration)
      expect(results).toHaveLength(1)
      expect(results[0]).toHaveProperty('message', 'There are 4 questions but 3 unique question ids')
    })

    it('should return an error if some answer ids are not unique', () => {
      const reportConfiguration = structuredClone(basicIncidentReportConfiguration)
      // make second answer id of second question of first report a duplicate
      reportConfiguration[0].questions[1].answers[1].questionnaireAnsId =
        reportConfiguration[0].questions[1].answers[0].questionnaireAnsId
      const results = analyseNomisReportConfiguration(reportConfiguration)
      expect(results).toHaveLength(1)
      expect(results[0]).toHaveProperty('message', 'There are 8 answers but 7 unique answer ids')
    })

    it('should pass if all ids & types are unique', () => {
      const results = analyseNomisReportConfiguration(basicIncidentReportConfiguration)
      expect(results).toHaveLength(0)
    })
  })
})
