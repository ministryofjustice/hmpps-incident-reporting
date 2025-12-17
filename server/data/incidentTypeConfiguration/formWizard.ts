import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { EmptyController } from '../../controllers/empty'
import { QuestionsController } from '../../routes/reports/questions/controller'
import type { AnswerConfiguration, IncidentTypeConfiguration, QuestionConfiguration } from './types'
import { conditionalFieldName } from './utils'

const MAX_ANSWERS_PER_PAGE = 20

/**
 * Generates Form Wizard's steps for the given config
 *
 * @param config questionnaire config
 * @param includeInactive whether to include ALL questions & responses – result must not be used in a real form wizard
 * @returns the Form Wizard's steps
 */
export function generateSteps(
  config: IncidentTypeConfiguration,
  includeInactive = false,
): FormWizard.Steps<FormWizard.MultiValues> {
  const steps: FormWizard.Steps<FormWizard.MultiValues> = {
    '/': {
      entryPoint: true,
      reset: true,
      resetJourney: true,
      skip: true,
      next: config.startingQuestionCode,
      controller: EmptyController,
    },
  }

  Object.values(config.questions)
    .filter(question => includeInactive || question.active)
    .forEach(question => {
      const activeAnswers = question.answers.filter(answer => includeInactive || answer.active)

      const fieldName = question.code
      const fields = [fieldName]
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

      steps[`/${fieldName}`] = {
        next: nextSteps(question, activeAnswers),
        fields,
        controller: QuestionsController,
        entryPoint: true,
      }
    })

  groupSteps(steps)

  return steps
}

/**
 * Merge all contiguous, non-branching steps in steps
 *
 * - If a step always lead to the same next step these can be potentially be
 *   grouped.
 * - Each step/question can only be in a single group.
 *
 * So steps with multiple parents (the right side of the branching)
 * can't be the last step in a group. However these can be the
 * beginning a new group.
 *
 * Example
 * - Q-animals
 *   => Q-dog
 *   => Q-icecream
 * - Q-dog
 *   => Q-icecream
 * - Q-icecream
 *  => Q-end
 * - Q-end
 *  => null
 *
 * Here Q-animals branches and can lead to Q-dog or Q-icecream.
 * This means q-animals would be in its own group.
 * Both Q-animals and Q-dog lead to Q-icecream, so Q-icecream can't
 * be part of these groups (each question belongs to a single group)
 * Finally, Q-icecream always lead to Q-end, and Q-icecream is the only
 * parent Q-end has, this means Q-end can be grouped into q-icecream
 *
 * @param steps to group
 */
function groupSteps(steps: FormWizard.Steps<FormWizard.MultiValues>) {
  const answersCounts: Map<string, number> = new Map()
  const stepsWithSingleParent: Set<string | null> = buildStepsWithSingleParent()
  const stepsAlreadyGrouped: Set<string> = new Set()

  /**
   * Get the current number of answers for a given stepId
   */
  function getAnswersCountForStep(stepId: string) {
    if (!answersCounts.has(stepId)) {
      answersCounts.set(stepId, countStepAnswers(stepId))
    }
    return answersCounts.get(stepId)
  }

  /**
   * Count the number of answers for a given stepId
   */
  function countStepAnswers(stepId: string): number {
    const step = steps[`/${stepId}`]
    if (step === undefined) {
      return 0
    }

    let count = 0
    for (const nextStepCondition of step.next) {
      count += (nextStepCondition as { value: string[] }).value.length
    }

    return count
  }

  /**
   * Internal function attempting to group the given stepId
   *
   * If stepId has only one childStep and stepId is the sole parent
   * of childStep then childStep is merged into stepId.
   */
  function groupStepsStartingAt(stepId: string) {
    if (stepId === null) {
      return
    }

    // Return if step can't be grouped further
    if (stepsAlreadyGrouped.has(stepId)) {
      return
    }

    const step = steps[`/${stepId}`]

    // Checks to determine if current step is eligible for grouping
    const nextStepsConditions = step.next as FormWizard.NextStepCondition[]
    const isBranching = nextStepsConditions.length > 1
    const nextStepHasMultipleParents = !stepsWithSingleParent.has(nextStepsConditions[0].next as string)
    if (isBranching || nextStepHasMultipleParents) {
      // Current step can't be grouped further...
      stepsAlreadyGrouped.add(stepId)
      // ... attempt to group its children
      for (const nextStepCondition of nextStepsConditions) {
        const childStepId = nextStepCondition.next as string
        groupStepsStartingAt(childStepId)
      }
    } else {
      // Single child, step can be potentially be merged...
      const childStepId = nextStepsConditions[0].next as string

      if (childStepId === null) {
        return
      }

      const childStep = steps[`/${childStepId}`]
      const stepAnswersCount = getAnswersCountForStep(stepId)
      const childStepAnswersCount = getAnswersCountForStep(childStepId)
      const newAnswersCount = stepAnswersCount + childStepAnswersCount

      // If combined answers count doesn't exceed threshold merge child step
      if (newAnswersCount <= MAX_ANSWERS_PER_PAGE) {
        // 1. replace current conditions with child conditions
        step.next = childStep.next
        // 2. add child's fields to this step
        step.fields = [...step.fields, ...childStep.fields]
        // 3. update answers count
        answersCounts.set(stepId, newAnswersCount)
        // 4. remove child step from steps
        // eslint-disable-next-line no-param-reassign
        delete steps[`/${childStepId}`]

        // Attempt to group further
        groupStepsStartingAt(stepId)
      } else {
        // child step couldn't be merged because of answers count, process it
        groupStepsStartingAt(childStepId)
      }
    }
  }

  /**
   * Returns the set of steps which have a single parent
   *
   * This is important as only steps with a single parent can be grouped
   * because otherwise a question would be in multiple groups.
   *
   * @returns the set with steps with a single parent
   */
  function buildStepsWithSingleParent(): Set<string | null> {
    // count number of parents of each step
    const stepsParentCount: Map<string | null, number> = new Map()
    for (const step of Object.values(steps)) {
      for (const nextStepCondition of Object.values(step.next)) {
        const nextQuestionCode = nextStepCondition.next
        if (!stepsParentCount.has(nextQuestionCode)) {
          stepsParentCount.set(nextQuestionCode, 0)
        }

        const currentCount = stepsParentCount.get(nextQuestionCode)
        stepsParentCount.set(nextQuestionCode, currentCount + 1)
      }
    }

    // Build a set with all the steps with a single parent
    const result: Set<string | null> = new Set()
    for (const [stepId, count] of stepsParentCount.entries()) {
      if (count === 1) {
        result.add(stepId)
      }
    }

    return result
  }

  const startStepId = steps['/'].next as string
  groupStepsStartingAt(startStepId)
}

/**
 * Generates Form Wizard's fields for the given config
 *
 * @param config questionnaire config
 * @returns the Form Wizard's fields
 */
function generateFields(config: IncidentTypeConfiguration): FormWizard.Fields {
  const fields: FormWizard.Fields = {}
  Object.values(config.questions)
    .filter(question => question.active)
    .forEach(question => {
      const activeAnswers = question.answers.filter(answer => answer.active)

      const fieldName = question.code
      fields[fieldName] = {
        name: fieldName,
        label: question.label,
        hint: question.questionHint,
        validate: ['required'],
        multiple: question.multipleAnswers,
        component: question.multipleAnswers ? 'govukCheckboxes' : 'govukRadios',
        items: activeAnswers.map(answer => {
          return {
            value: answer.response,
            label: answer.label,
            hint: answer.responseHint,
            dateRequired: answer.dateRequired,
            commentRequired: answer.commentRequired,
          } satisfies FormWizard.FieldItem
        }),
      } satisfies FormWizard.Field

      // Add conditional comment/date fields
      for (const answer of activeAnswers) {
        if (answer.dateRequired) {
          const dateFieldName = conditionalFieldName(question, answer, 'date')
          fields[dateFieldName] = {
            name: dateFieldName,
            label: 'Date',
            component: 'mojDatePicker',
            validate: ['required', 'ukDate'],
            dependent: {
              field: fieldName,
              value: answer.response,
            },
          } satisfies FormWizard.Field
        }

        if (answer.commentRequired || answer.commentOptional) {
          const commentFieldName = conditionalFieldName(question, answer, 'comment')
          const optionalText = answer.commentOptional ? ' (optional)' : ''
          const commentLabel = `${answer.commentLabel || 'Comment'}${optionalText}`
          fields[commentFieldName] = {
            name: commentFieldName,
            label: commentLabel,
            component: 'govukInput',
            validate: answer.commentOptional ? null : ['required'],
            dependent: {
              field: fieldName,
              value: answer.response,
            },
          } satisfies FormWizard.Field
        }
      }
    })

  return fields
}

export default generateFields

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
  // Group answers by next question code
  const groupedByNextQuestion: Map<string | null, AnswerConfiguration[]> = new Map()
  answers.forEach(answer => {
    if (!groupedByNextQuestion.has(answer.nextQuestionCode)) {
      groupedByNextQuestion.set(answer.nextQuestionCode, [])
    }

    groupedByNextQuestion.get(answer.nextQuestionCode).push(answer)
  })

  const next: FormWizard.NextStepCondition[] = []
  for (const [nextQuestionCode, groupAnswers] of groupedByNextQuestion.entries()) {
    const answerResponses = groupAnswers.map(answer => answer.response)

    next.push({
      field: question.code,
      // - for single values, check if submitted value is
      //   contained **in** `condition.value`
      // - for multiple values, submitted values is an array, e.g.
      //   `['choice-2', 'choice-5']`). Check if any of these values
      //   is in `condition.value`
      //   NOTE: Form Wizard's `some` is NOT doing this on arrays
      op: question.multipleAnswers ? checkMultipleValues : 'in',
      value: answerResponses,
      next: nextQuestionCode,
    })
  }

  return next
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
  _res: express.Response,
  condition: { value: string[] },
): boolean {
  // Don't check values if nothing has been submitted
  if (!submittedValues) {
    return false
  }

  return submittedValues.some(submittedValue => condition.value.includes(submittedValue))
}
