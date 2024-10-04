import FormWizard from 'hmpo-form-wizard'
import { IncidentTypeConfiguration, QuestionConfiguration } from '../data/incidentTypeConfiguration/types'
import { convertToTitleCase } from '../utils/utils'

type FieldTypeOptions = 'comment' | 'date'

function createConditionalField(questionId: string, fieldType: FieldTypeOptions): FormWizard.Field {
  if (fieldType === 'comment') {
    return {
      component: 'govukInput',
      text: 'Additional comment',
      label: { text: 'Additional comment' },
      labelClasses: 'govuk-fieldset__legend--m',
      validate: ['required'],
      id: `${questionId}Comment`,
      name: `${questionId}Comment`,
    }
  }
  if (fieldType === 'date') {
    return {
      component: 'mojDatePicker',
      text: 'Date occurred',
      label: { text: 'Date occurred' },
      labelClasses: 'govuk-fieldset__legend--m',
      validate: ['required'],
      id: `${questionId}Date`,
      name: `${questionId}Date`,
    }
  }
  throw new Error('Invalid fieldType')
}

function mapQuestionToField(question: QuestionConfiguration): FormWizard.Fields {
  const questionId = question.id
  let component: string = 'govukRadios'
  if (question.multipleAnswers === true) {
    component = 'govukCheckboxes'
  }

  let commentRequired = false
  let dateRequired = false

  const items: FormWizard.Item[] = question.answers
    .filter(answer => answer.active)
    .map(answer => {
      if (answer.commentRequired === true) {
        commentRequired = true
        return { value: answer.code, text: convertToTitleCase(answer.label), conditional: `${questionId}Comment` }
      }
      if (answer.dateRequired === true) {
        dateRequired = true
        return { value: answer.code, text: convertToTitleCase(answer.label), conditional: `${questionId}Date` }
      }
      return { value: answer.code, text: convertToTitleCase(answer.label) }
    })

  const field: FormWizard.Field = {
    component,
    text: convertToTitleCase(question.label),
    label: { text: convertToTitleCase(question.label) },
    labelClasses: 'govuk-fieldset__legend--m',
    validate: ['required'],
    id: questionId,
    name: questionId,
    items,
  }

  if (commentRequired || dateRequired) {
    if (commentRequired) {
      const additionalField = createConditionalField(questionId, 'comment')
      return { [questionId]: field, [`${questionId}Comment`]: additionalField }
    }
    if (dateRequired) {
      const additionalField = createConditionalField(questionId, 'date')
      return { [questionId]: field, [`${questionId}Date`]: additionalField }
    }
  }

  return { [questionId]: field }
}

export default function createIncidentFields(incidentConfig: IncidentTypeConfiguration): FormWizard.Fields {
  let fields: FormWizard.Fields = {}

  for (const question of Object.values(incidentConfig.questions)) {
    if (question.active === true) {
      const newField = mapQuestionToField(question)
      fields = { ...fields, ...newField }
    }
  }

  return fields
}
