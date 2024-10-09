import FormWizard from 'hmpo-form-wizard'
import { IncidentTypeConfiguration } from './types'
import QuestionsController from '../../controllers/wip/questionsController'

// TODO: Add tests once steps structure is more stable
export function generateSteps(config: IncidentTypeConfiguration): FormWizard.Steps {
  const steps: FormWizard.Steps = {
    '/': {
      entryPoint: true,
      reset: true,
      resetJourney: true,
      skip: true,
      next: config.startingQuestionId,
    },
  }

  Object.values(config.questions)
    .filter(question => question.active)
    .forEach(question => {
      steps[`/${question.id}`] = {
        // TODO: Maybe coalesce answers leading to same next question
        next: question.answers
          .filter(answer => answer.active)
          .map(answer => {
            return { field: question.id, value: answer.code, next: answer.nextQuestionId }
          }),
        fields: [question.id],
        controller: QuestionsController,
        template: 'questionPage',
      }
    })

  // console.log(JSON.stringify(steps, null, 2))

  return steps
}

// TODO: Deal with commentRequired/dateRequired
// TODO: Add tests once fields structure is more stable
export function generateFields(config: IncidentTypeConfiguration): FormWizard.Fields {
  const fields: FormWizard.Fields = {}
  Object.values(config.questions).forEach(question => {
    fields[question.id] = {
      id: question.id,
      name: question.id,
      text: question.label,
      label: { text: question.label },
      validate: ['required'],
      multiple: question.multipleAnswers,
      fieldset: {
        legend: {
          text: question.label,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      component: question.multipleAnswers ? 'govukCheckboxes' : 'govukRadios',
      items: question.answers
        .filter(answer => answer.active)
        .map(answer => {
          return { text: answer.label, value: answer.code }
        }),
    }
  })

  // console.log(JSON.stringify(fields, null, 2))

  return fields
}
