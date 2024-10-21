import FormWizard from 'hmpo-form-wizard'
import type { AnswerConfiguration, IncidentTypeConfiguration, QuestionConfiguration } from './types'
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
      const next: FormWizard.NextStepCondition[] = activeAnswers.map(answer => {
        return {
          field: question.id,
          // when checkboxes choices are submitted the value is an array
          // e.g. `['choice-2', 'choice-5']`
          // in these cases this conditional step matches if some of `submittedValues`
          // equals value
          op: question.multipleAnswers ? checkMultipleValues : '===',
          value: answer.code,
          next: answer.nextQuestionId,
        }
      })

      const fields = [question.id]
      for (const answer of activeAnswers) {
        if (answer.dateRequired) {
          const dateFieldName = conditionalFieldName(question, answer, 'date')
          fields.push(dateFieldName)
        }
        if (answer.commentRequired) {
          const commentFieldName = conditionalFieldName(question, answer, 'comment')
          fields.push(commentFieldName)
        }
      }

      steps[`/${question.id}`] = {
        next,
        fields,
        controller: QuestionsController,
        template: 'questionPage',
      }
    })

  return steps
}

// TODO: Deal with commentRequired/dateRequired
// TODO: Add tests once fields structure is more stable
export function generateFields(config: IncidentTypeConfiguration): FormWizard.Fields {
  const fields: FormWizard.Fields = {}
  Object.values(config.questions)
    .filter(question => question.active)
    .forEach(question => {
      const activeAnswers = question.answers.filter(answer => answer.active)

      fields[question.id] = {
        name: question.id,
        label: question.label,
        validate: ['required'],
        // TODO: having `multiple: true` causes the progression to next page to not work
        //       in pages with checkboxes. Interestingly if selecting multiple answers,
        //       they're posted in the form data - so maybe this is only affecting how the
        //       data is posted rather than whether multiple values are posted or not.
        //       Commenting this out but it may be one of these things that depend on how
        //       we write the controller.
        multiple: question.multipleAnswers,
        component: question.multipleAnswers ? 'govukCheckboxes' : 'govukRadios',
        items: activeAnswers.map(answer => {
          return {
            id: answer.id,
            name: answer.id,
            value: answer.code,
            label: answer.label,
            dateRequired: answer.dateRequired,
            commentRequired: answer.commentRequired,
          }
        }),
      }
      // Add comment/date fields
      for (const answer of activeAnswers) {
        if (answer.dateRequired) {
          const fieldName = conditionalFieldName(question, answer, 'date')
          fields[fieldName] = {
            name: fieldName,
            label: 'Date',
            component: 'mojDatePicker',
            validate: ['required', 'ukDate'],
            dependent: {
              field: question.id,
              value: answer.code,
            },
          }
        }
        if (answer.commentRequired) {
          const fieldName = conditionalFieldName(question, answer, 'comment')
          fields[fieldName] = {
            name: fieldName,
            label: 'Comment',
            component: 'govukInput',
            validate: ['required'],
            dependent: {
              field: question.id,
              value: answer.code,
            },
          }
        }
      }
    })

  return fields
}

function conditionalFieldName(question: QuestionConfiguration, answer: AnswerConfiguration, suffix: string): string {
  return `${question.id}-${answer.id}-${suffix}`
}

/**
 * Checks if the values submitted by the user match the condition's value
 *
 * This is used in the next step condition when multiple values are allowed,
 * e.g. when field is rendered as a list checkboxes
 *
 * For example:
 *
 * ```
 * steps = {
 *   '/animals': {
 *      id: '/animals',
 *      fields: ['animal'],
 *      next: [
 *        { value: 'dog', op: checkMultipleValues, next: 'q2', field: 'animal' },
 *        { value: 'cat', op: checkMultipleValues, next: 'q2', field: 'animal' },
 *        { value: 'fox', op: checkMultipleValues, next: 'q2', field: 'animal' },
 *      ]
 *   }
 *   '/q2': { ... }
 * }
 * ```
 *
 * as the field has `multiple: true` the value submitted by the user
 * would be `string[]`, e.g. `['dog', 'fox']`.
 *
 * this function would check if the submitted value contains the value in the
 * condition, and if that's the case then Form Wizard would move the user to
 * the step specificed in the `next` property of the next step condition
 * (`q2` in the example above)
 *
 * @param submittedValues values submitted by the user
 * @param _req request not used
 * @param _res response not used
 * @param condition next step condition with value to match
 * @returns true if the value submitted by the user include `condition.value`
 */
export function checkMultipleValues(
  submittedValues: FormWizard.MultiValue,
  _req: FormWizard.Request,
  _res: Express.Response,
  condition: { value: string },
): boolean {
  // Don't check values if nothing has been submitted
  if (!submittedValues) {
    return false
  }

  return submittedValues.includes(condition.value)
}
