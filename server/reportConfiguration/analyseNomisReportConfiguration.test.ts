import { analyseNomisReportConfiguration } from './analyseNomisReportConfiguration'

describe('Analysing NOMIS report configuration', () => {
  describe('id & type uniqueness', () => {
    it('should return an error if some ids are not unique', () => {
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
          questionnaireId: 2, // DUPLICATE
          questions: [],
          prisonerRoles: [],
          active: true,
        },
      ])
      expect(results).toHaveLength(1)
      expect(results[0]).toHaveProperty('message', 'There are 3 configurations but 2 unique ids')
    })

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
          incidentType: 'ASSAULT', // DUPLICATE
          incidentTypeDescription: 'Assaults 2022',
          questionnaireId: 3,
          questions: [],
          prisonerRoles: [],
          active: true,
        },
      ])
      expect(results).toHaveLength(1)
      expect(results[0]).toHaveProperty('message', 'There are 3 configurations but 2 unique types')
    })

    it('should return an error if some question ids are not unique', () => {
      const results = analyseNomisReportConfiguration([
        {
          incidentType: 'ASSAULT1',
          incidentTypeDescription: 'Assaults 2021',
          questionnaireId: 2,
          questions: [
            {
              questionnaireQueId: 1,
              questionSeq: 1,
              questionDesc: 'WAS HEALTHCARE INVOLVED',
              questionListSeq: 1,
              questionActiveFlag: true,
              multipleAnswerFlag: false,
              answers: [],
            },
            {
              questionnaireQueId: 2,
              questionSeq: 2,
              questionDesc: 'WERE THE POLICE INFORMED OF THE INCIDENT',
              questionListSeq: 2,
              questionActiveFlag: true,
              multipleAnswerFlag: false,
              answers: [],
            },
          ],
          prisonerRoles: [],
          active: true,
        },
        {
          incidentType: 'ASSAULT',
          incidentTypeDescription: 'Assaults 2022',
          questionnaireId: 3,
          questions: [
            {
              questionnaireQueId: 3,
              questionSeq: 1,
              questionDesc: 'WAS HEALTHCARE INVOLVED',
              questionListSeq: 1,
              questionActiveFlag: true,
              multipleAnswerFlag: false,
              answers: [],
            },
            {
              questionnaireQueId: 3, // DUPLICATE
              questionSeq: 2,
              questionDesc: 'WERE THE POLICE INFORMED OF THE INCIDENT',
              questionListSeq: 2,
              questionActiveFlag: true,
              multipleAnswerFlag: false,
              answers: [],
            },
          ],
          prisonerRoles: [],
          active: true,
        },
      ])
      expect(results).toHaveLength(1)
      expect(results[0]).toHaveProperty('message', 'There are 4 questions but 3 unique question ids')
    })

    it('should return an error if some answer ids are not unique', () => {
      const results = analyseNomisReportConfiguration([
        {
          incidentType: 'ASSAULT1',
          incidentTypeDescription: 'Assaults 2021',
          questionnaireId: 2,
          questions: [
            {
              questionnaireQueId: 1,
              questionSeq: 1,
              questionDesc: 'WAS HEALTHCARE INVOLVED',
              questionListSeq: 1,
              questionActiveFlag: true,
              multipleAnswerFlag: false,
              answers: [
                {
                  questionnaireAnsId: 1,
                  answerSeq: 1,
                  answerDesc: 'YES (ENTER STAFF NAME)',
                  answerListSeq: 1,
                  answerActiveFlag: true,
                  dateRequiredFlag: false,
                  commentRequiredFlag: true,
                  nextQuestionnaireQueId: 2,
                },
                {
                  questionnaireAnsId: 2,
                  answerSeq: 2,
                  answerDesc: 'NO',
                  answerListSeq: 2,
                  answerActiveFlag: true,
                  dateRequiredFlag: false,
                  commentRequiredFlag: false,
                  nextQuestionnaireQueId: 2,
                },
              ],
            },
            {
              questionnaireQueId: 2,
              questionSeq: 2,
              questionDesc: 'WERE THE POLICE INFORMED OF THE INCIDENT',
              questionListSeq: 2,
              questionActiveFlag: true,
              multipleAnswerFlag: false,
              answers: [
                {
                  questionnaireAnsId: 3,
                  answerSeq: 1,
                  answerDesc: 'YES (ENTER DATE)',
                  answerListSeq: 1,
                  answerActiveFlag: true,
                  dateRequiredFlag: true,
                  commentRequiredFlag: false,
                  nextQuestionnaireQueId: null,
                },
                {
                  questionnaireAnsId: 2, // DUPLICATE
                  answerSeq: 2,
                  answerDesc: 'NO',
                  answerListSeq: 2,
                  answerActiveFlag: true,
                  dateRequiredFlag: false,
                  commentRequiredFlag: false,
                  nextQuestionnaireQueId: null,
                },
              ],
            },
          ],
          prisonerRoles: [],
          active: true,
        },
        {
          incidentType: 'ASSAULT',
          incidentTypeDescription: 'Assaults 2022',
          questionnaireId: 3,
          questions: [
            {
              questionnaireQueId: 3,
              questionSeq: 1,
              questionDesc: 'WAS HEALTHCARE INVOLVED',
              questionListSeq: 1,
              questionActiveFlag: true,
              multipleAnswerFlag: false,
              answers: [
                {
                  questionnaireAnsId: 5,
                  answerSeq: 1,
                  answerDesc: 'YES (ENTER STAFF NAME)',
                  answerListSeq: 1,
                  answerActiveFlag: true,
                  dateRequiredFlag: false,
                  commentRequiredFlag: true,
                  nextQuestionnaireQueId: 4,
                },
                {
                  questionnaireAnsId: 6,
                  answerSeq: 2,
                  answerDesc: 'NO',
                  answerListSeq: 2,
                  answerActiveFlag: true,
                  dateRequiredFlag: false,
                  commentRequiredFlag: false,
                  nextQuestionnaireQueId: 4,
                },
              ],
            },
            {
              questionnaireQueId: 4,
              questionSeq: 2,
              questionDesc: 'WERE THE POLICE INFORMED OF THE INCIDENT',
              questionListSeq: 2,
              questionActiveFlag: true,
              multipleAnswerFlag: false,
              answers: [
                {
                  questionnaireAnsId: 7,
                  answerSeq: 1,
                  answerDesc: 'YES (ENTER DATE)',
                  answerListSeq: 1,
                  answerActiveFlag: true,
                  dateRequiredFlag: true,
                  commentRequiredFlag: false,
                  nextQuestionnaireQueId: null,
                },
                {
                  questionnaireAnsId: 8,
                  answerSeq: 2,
                  answerDesc: 'NO',
                  answerListSeq: 2,
                  answerActiveFlag: true,
                  dateRequiredFlag: false,
                  commentRequiredFlag: false,
                  nextQuestionnaireQueId: null,
                },
              ],
            },
          ],
          prisonerRoles: [],
          active: true,
        },
      ])
      expect(results).toHaveLength(1)
      expect(results[0]).toHaveProperty('message', 'There are 8 answers but 7 unique answer ids')
    })

    it('should pass if all ids & types are unique', () => {
      const results = analyseNomisReportConfiguration([
        {
          incidentType: 'ASSAULT1',
          incidentTypeDescription: 'Assaults 2021',
          questionnaireId: 2,
          questions: [
            {
              questionnaireQueId: 1,
              questionSeq: 1,
              questionDesc: 'WAS HEALTHCARE INVOLVED',
              questionListSeq: 1,
              questionActiveFlag: true,
              multipleAnswerFlag: false,
              answers: [
                {
                  questionnaireAnsId: 1,
                  answerSeq: 1,
                  answerDesc: 'YES (ENTER STAFF NAME)',
                  answerListSeq: 1,
                  answerActiveFlag: true,
                  dateRequiredFlag: false,
                  commentRequiredFlag: true,
                  nextQuestionnaireQueId: 2,
                },
                {
                  questionnaireAnsId: 2,
                  answerSeq: 2,
                  answerDesc: 'NO',
                  answerListSeq: 2,
                  answerActiveFlag: true,
                  dateRequiredFlag: false,
                  commentRequiredFlag: false,
                  nextQuestionnaireQueId: 2,
                },
              ],
            },
            {
              questionnaireQueId: 2,
              questionSeq: 2,
              questionDesc: 'WERE THE POLICE INFORMED OF THE INCIDENT',
              questionListSeq: 2,
              questionActiveFlag: true,
              multipleAnswerFlag: false,
              answers: [
                {
                  questionnaireAnsId: 3,
                  answerSeq: 1,
                  answerDesc: 'YES (ENTER DATE)',
                  answerListSeq: 1,
                  answerActiveFlag: true,
                  dateRequiredFlag: true,
                  commentRequiredFlag: false,
                  nextQuestionnaireQueId: null,
                },
                {
                  questionnaireAnsId: 4,
                  answerSeq: 2,
                  answerDesc: 'NO',
                  answerListSeq: 2,
                  answerActiveFlag: true,
                  dateRequiredFlag: false,
                  commentRequiredFlag: false,
                  nextQuestionnaireQueId: null,
                },
              ],
            },
          ],
          prisonerRoles: [],
          active: true,
        },
        {
          incidentType: 'ASSAULT',
          incidentTypeDescription: 'Assaults 2022',
          questionnaireId: 3,
          questions: [
            {
              questionnaireQueId: 3,
              questionSeq: 1,
              questionDesc: 'WAS HEALTHCARE INVOLVED',
              questionListSeq: 1,
              questionActiveFlag: true,
              multipleAnswerFlag: false,
              answers: [
                {
                  questionnaireAnsId: 5,
                  answerSeq: 1,
                  answerDesc: 'YES (ENTER STAFF NAME)',
                  answerListSeq: 1,
                  answerActiveFlag: true,
                  dateRequiredFlag: false,
                  commentRequiredFlag: true,
                  nextQuestionnaireQueId: 4,
                },
                {
                  questionnaireAnsId: 6,
                  answerSeq: 2,
                  answerDesc: 'NO',
                  answerListSeq: 2,
                  answerActiveFlag: true,
                  dateRequiredFlag: false,
                  commentRequiredFlag: false,
                  nextQuestionnaireQueId: 4,
                },
              ],
            },
            {
              questionnaireQueId: 4,
              questionSeq: 2,
              questionDesc: 'WERE THE POLICE INFORMED OF THE INCIDENT',
              questionListSeq: 2,
              questionActiveFlag: true,
              multipleAnswerFlag: false,
              answers: [
                {
                  questionnaireAnsId: 7,
                  answerSeq: 1,
                  answerDesc: 'YES (ENTER DATE)',
                  answerListSeq: 1,
                  answerActiveFlag: true,
                  dateRequiredFlag: true,
                  commentRequiredFlag: false,
                  nextQuestionnaireQueId: null,
                },
                {
                  questionnaireAnsId: 8,
                  answerSeq: 2,
                  answerDesc: 'NO',
                  answerListSeq: 2,
                  answerActiveFlag: true,
                  dateRequiredFlag: false,
                  commentRequiredFlag: false,
                  nextQuestionnaireQueId: null,
                },
              ],
            },
          ],
          prisonerRoles: [],
          active: true,
        },
      ])
      expect(results).toHaveLength(0)
    })
  })
})
