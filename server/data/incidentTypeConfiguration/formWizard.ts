import FormWizard from 'hmpo-form-wizard'

import type { AnswerConfiguration, IncidentTypeConfiguration, QuestionConfiguration } from './types'
import QuestionsController from '../../controllers/wip/questionsController'

/**
 * Generates Form Wizard's steps for the given config
 *
 * @param config questionnaire config
 * @returns the Form Wizard's steps
 */
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
        next: nextSteps(question, activeAnswers),
        fields,
        controller: QuestionsController,
        template: 'questionPage',
      }
    })

  return steps
}

/**
 * Generates Form Wizard's fields for the given config
 *
 * @param config questionnaire config
 * @returns the Form Wizard's fields
 */
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
        multiple: question.multipleAnswers,
        component: question.multipleAnswers ? 'govukCheckboxes' : 'govukRadios',
        items: activeAnswers.map(answer => {
          return {
            value: answer.code,
            label: answer.label,
            dateRequired: answer.dateRequired,
            commentRequired: answer.commentRequired,
          } satisfies FormWizard.FieldItem
        }),
      } satisfies FormWizard.Field

      // Add conditional comment/date fields
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
          } satisfies FormWizard.Field
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
          } satisfies FormWizard.Field
        }
      }
    })

  return fields
}

/**
 * Returns the list of next step conditions for the question/answers
 *
 * Answers leading to the same question are grouped together.
 *
 * @param question
 * @param answers
 * @returns next step conditions
 */
function nextSteps(question: QuestionConfiguration, answers: AnswerConfiguration[]): FormWizard.NextStepCondition[] {
  // Group answers by next question id
  const groupedByNextQuestion: Map<string | null, AnswerConfiguration[]> = new Map()
  answers.forEach(answer => {
    if (groupedByNextQuestion.get(answer.nextQuestionId) === undefined) {
      groupedByNextQuestion.set(answer.nextQuestionId, [])
    }

    groupedByNextQuestion.get(answer.nextQuestionId).push(answer)
  })

  const next: FormWizard.NextStepCondition[] = []
  for (const [nextQuestionId, groupAnswers] of groupedByNextQuestion.entries()) {
    const answerCodes = groupAnswers.map(answer => answer.code)

    next.push({
      field: question.id,
      // - for single values, check if submitted value is
      //   contained **in** `condition.value`
      // - for multiple values, submitted values is an array, e.g.
      //   `['choice-2', 'choice-5']`). Check if any of these values
      //   is in `condition.value`
      //   NOTE: Form Wizard's `some` is NOT doing this on arrays
      op: question.multipleAnswers ? checkMultipleValues : 'in',
      value: answerCodes,
      next: nextQuestionId,
    })
  }

  return next
}

function conditionalFieldName(question: QuestionConfiguration, answer: AnswerConfiguration, suffix: string): string {
  return `${question.id}-${answer.id}-${suffix}`
}

/**
 * Checks if the values submitted by the user match the condition's values
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
 *        {
 *          value: ['dog', 'cat'],
 *          op: checkMultipleValues,
 *          next: 'q-domestic',
 *          field: 'animal'
 *        },
 *        {
 *          value: ['fox'],
 *          op: checkMultipleValues,
 *          next: 'q-wild',
 *          field: 'animal'
 *        },
 *      ]
 *   },
 *   '/q-domestic': { ... },
 *   '/q-wild': { ... },
 * }
 * ```
 *
 * As the field has `multiple: true` the value submitted by the user
 * would be `string[]`, e.g. `['dog', 'fox']`.
 *
 * This operator function matches if any of the values submitted by the user
 * is contained in the condition's value.
 *
 * @param submittedValues values submitted by the user
 * @param _req request not used
 * @param _res response not used
 * @param condition next step condition with values to match
 * @returns true if any of the submitted values is contained in `condition.value`
 */
export function checkMultipleValues(
  submittedValues: string[],
  _req: FormWizard.Request,
  _res: Express.Response,
  condition: { value: string[] },
): boolean {
  // Don't check values if nothing has been submitted
  if (!submittedValues) {
    return false
  }

  return submittedValues.some(submittedValue => condition.value.includes(submittedValue))
}
