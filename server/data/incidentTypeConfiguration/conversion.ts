import {
  type IncidentTypeConfiguration as NomisIncidentTypeConfiguration,
  type QuestionConfiguration as NomisQuestionConfiguration,
  type AnswerConfiguration as NomisAnswerConfiguration,
} from '../prisonApi'
import {
  type IncidentTypeConfiguration as DpsIncidentTypeConfiguration,
  type QuestionConfiguration as DpsQuestionConfiguration,
} from './types'

/**
 * Converts a NOMIS incident type configuration into the new DPS one
 */
// eslint-disable-next-line import/prefer-default-export
export function fromNomis(nomisConfig: NomisIncidentTypeConfiguration): DpsIncidentTypeConfiguration {
  const sortByQuestionSequence = (q1: NomisQuestionConfiguration, q2: NomisQuestionConfiguration) =>
    q1.questionSeq - q2.questionSeq
  const sortByAnswerSequence = (a1: NomisAnswerConfiguration, a2: NomisAnswerConfiguration) =>
    a1.answerSeq - a2.answerSeq

  const nomisQuestions = nomisConfig.questions.sort(sortByQuestionSequence)
  return {
    // TODO: Convert NOMIS report type into DPS one
    incidentType: nomisConfig.incidentType,
    active: nomisConfig.active === true,
    // 1st question is starting question
    startingQuestionId: nomisQuestions[0].questionnaireQueId.toString(),
    questions: nomisQuestions.reduce((qs: Record<string, DpsQuestionConfiguration>, q: NomisQuestionConfiguration) => {
      const nomisAnswers = q.answers.sort(sortByAnswerSequence)

      // eslint-disable-next-line no-param-reassign
      qs[q.questionnaireQueId.toString()] = {
        id: q.questionnaireQueId.toString(),
        label: q.questionDesc,
        multipleAnswers: q.multipleAnswerFlag === true,
        answers: nomisAnswers.map(ans => {
          return {
            label: ans.answerDesc,
            commentRequired: ans.commentRequiredFlag === true,
            dateRequired: ans.dateRequiredFlag === true,
            nextQuestionId: ans.nextQuestionnaireQueId?.toString() || null,
          }
        }),
      }
      return qs
    }, {}),
  }
}
