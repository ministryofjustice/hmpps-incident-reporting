import FormWizard from 'hmpo-form-wizard'
import type { IncidentTypeConfiguration } from './types'
import QuestionsController from '../../controllers/wip/questionsController'

// TODO: Add tests once steps structure is more stable
export function generateSteps(config: IncidentTypeConfiguration): FormWizard.Steps {
  const steps: FormWizard.Steps = {
    '/': {
      entryPoint: true,
      reset: true,
      resetJourney: true,
      // TODO: first step ought to not be skipped so let's try to put the first question here
      skip: true,
      next: config.startingQuestionId,
    },
  }

  Object.values(config.questions)
    .filter(question => question.active)
    .forEach(question => {
      const activeAnswers = question.answers.filter(answer => answer.active)

      // TODO: Maybe coalesce answers leading to same next question
      const next = activeAnswers.map(answer => {
        return { field: question.id, value: answer.code, next: answer.nextQuestionId }
      })

      steps[`/${question.id}`] = {
        next,
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
      label: question.label,
      validate: ['required'],
      // TODO: having `multiple: true` causes the progression to next page to not work
      //       in pages with checkboxes. Interestingly if selecting multiple answers,
      //       they're posted in the form data - so maybe this is only affecting how the
      //       data is posted rather than whether multiple values are posted or not.
      //       Commenting this out but it may be one of these things that depend on how
      //       we write the controller.
      // multiple: question.multipleAnswers,
      component: question.multipleAnswers ? 'govukCheckboxes' : 'govukRadios',
      items: question.answers
        .filter(answer => answer.active)
        .map(answer => {
          return {
            text: answer.label,
            value: answer.code,
            dateRequired: answer.dateRequired,
            commentRequired: answer.commentRequired,
          }
        }),
    }
  })

  // console.log(JSON.stringify(fields, null, 2))

  return fields
}
