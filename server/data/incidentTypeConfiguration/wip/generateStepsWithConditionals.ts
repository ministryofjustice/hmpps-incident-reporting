import FormWizard from 'hmpo-form-wizard'
import { IncidentTypeConfiguration, QuestionConfiguration } from '../types'
import QuestionsController from '../../../controllers/wip/questionsController'

function mapQuestionToStep(question: QuestionConfiguration): FormWizard.Steps {
  const questionId = question.id

  let commentRequired = false
  let dateRequired = false

  const next: FormWizard.Step.NextStep = question.answers
    .filter(answer => answer.active)
    .map(answer => {
      if (answer.commentRequired === true) {
        commentRequired = true
      }
      if (answer.dateRequired === true) {
        dateRequired = true
      }
      return { field: questionId, value: answer.code, next: answer.nextQuestionId }
    })

  let fields = [questionId]

  if (commentRequired) {
    fields = [questionId, `${questionId}Comment`]
  }
  if (dateRequired) {
    fields = [questionId, `${questionId}Date`]
  }
  return {
    [`/${questionId}`]: {
      fields,
      controller: QuestionsController,
      next,
      template: 'questionPage',
    },
  }
}

export default function generateStepsWithConditionals(incidentConfig: IncidentTypeConfiguration): FormWizard.Steps {
  let steps: FormWizard.Steps = {
    '/': {
      entryPoint: true,
      reset: true,
      resetJourney: true,
      skip: true,
      next: incidentConfig.startingQuestionId,
    },
  }

  for (const question of Object.values(incidentConfig.questions)) {
    if (question.active === true) {
      const newStep = mapQuestionToStep(question)
      steps = { ...steps, ...newStep }
    }
  }

  return steps
}
