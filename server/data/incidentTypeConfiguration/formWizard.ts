import FormWizard from 'hmpo-form-wizard'
import { IncidentTypeConfiguration } from './types'

export function generateSteps(config: IncidentTypeConfiguration): FormWizard.Steps {
  const steps: FormWizard.Steps = {}

  Object.values(config.questions).forEach(question => {
    if (question.active) {
      steps[`/${question.id}`] = {
        // TODO: Maybe coalesce answers leading to same next question
        next: question.answers
          .filter(answer => answer.active)
          .map(answer => {
            return { field: question.id, value: answer.code, next: answer.nextQuestionId }
          }),
        fields: [question.id],
        template: 'index',
      }
    }
  })

  steps[`/${config.startingQuestionId}`].entryPoint = true
  steps['/'] = steps[`/${config.startingQuestionId}`]

  // console.log(JSON.stringify(steps, null, 2))

  return steps
}

// TODO: Deal with commentRequired/dateRequired
export function generateFields(config: IncidentTypeConfiguration): FormWizard.Fields {
  const fields: FormWizard.Fields = {}
  Object.values(config.questions).forEach(question => {
    fields[question.id] = {
      id: question.id,
      name: question.code,
      text: question.label,
      multiple: question.multipleAnswers,
      fieldset: {
        legend: {
          text: question.label,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      component: question.multipleAnswers ? 'govukCheckboxes' : 'govukRadios',
      items: question.answers.map(answer => {
        return { text: answer.label, value: answer.code }
      }),
    }
  })

  // console.log(JSON.stringify(fields, null, 2))

  return fields
}
