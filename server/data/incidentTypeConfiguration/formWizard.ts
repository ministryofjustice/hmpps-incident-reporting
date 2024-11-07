import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import type { AnswerConfiguration, IncidentTypeConfiguration, QuestionConfiguration } from './types'
import QuestionsController from '../../controllers/wip/questionsController'

const MAX_ANSWERS_PER_PAGE = 20

/**
 * Generates Form Wizard's steps for the given config
 *
 * @param config questionnaire config
 * @returns the Form Wizard's steps
 */
export function generateSteps(config: IncidentTypeConfiguration): FormWizard.Steps<FormWizard.MultiValues> {
  const steps: FormWizard.Steps<FormWizard.MultiValues> = {
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

    const step = steps[`/${stepId}`]

    // Checks to determine if current step is eligible for grouping
    const nextStepsConditions = step.next as FormWizard.NextStepCondition[]
    const isBranching = nextStepsConditions.length > 1
    const nextStepHasMultipleParents = !stepsWithSingleParent.has(nextStepsConditions[0].next as string)
    if (isBranching || nextStepHasMultipleParents) {
      // Current step can't be grouped, attempt to group its children
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
        const nextQuestionId = nextStepCondition.next
        if (!stepsParentCount.has(nextQuestionId)) {
          stepsParentCount.set(nextQuestionId, 0)
        }

        const currentCount = stepsParentCount.get(nextQuestionId)
        stepsParentCount.set(nextQuestionId, currentCount + 1)
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
    if (!groupedByNextQuestion.has(answer.nextQuestionId)) {
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
  _res: express.Response,
  condition: { value: string[] },
): boolean {
  // Don't check values if nothing has been submitted
  if (!submittedValues) {
    return false
  }

  return submittedValues.some(submittedValue => condition.value.includes(submittedValue))
}
