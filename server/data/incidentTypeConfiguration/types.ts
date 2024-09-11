export interface IncidentTypeConfiguration {
  incidentType: string // TODO: Change to DPS Incident Type?
  active: boolean
  startingQuestionId: string
  questions: Record<string, QuestionConfiguration>
}

export interface QuestionConfiguration {
  id: string
  label: string
  multipleAnswers: boolean
  answers: AnswerConfiguration[]
}

export interface AnswerConfiguration {
  label: string
  dateRequired: boolean
  commentRequired: boolean
  nextQuestionId: string | null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const example: IncidentTypeConfiguration = {
  incidentType: 'LIFE',
  active: true,
  startingQuestionId: 'DOG1',
  questions: {
    DOG1: {
      id: 'DOG1',
      label: 'Do you have any dogs?',
      multipleAnswers: false,
      answers: [
        { label: 'Yes', nextQuestionId: 'DOG2', commentRequired: false, dateRequired: false },
        { label: 'No', nextQuestionId: 'ICE1', commentRequired: false, dateRequired: false },
      ],
    },
    DOG2: {
      id: 'DOG2',
      label: 'How many dogs do you have?',
      multipleAnswers: false,
      answers: [{ label: 'Number of dogs', nextQuestionId: 'ICE1', commentRequired: true, dateRequired: false }],
    },
    ICE1: {
      id: 'ICE1',
      label: 'Favourite ice cream?',
      multipleAnswers: false,
      answers: [
        { label: 'Vanilla', nextQuestionId: null, commentRequired: false, dateRequired: false },
        { label: 'Chocolate', nextQuestionId: null, commentRequired: false, dateRequired: false },
        { label: 'Strawberry', nextQuestionId: null, commentRequired: false, dateRequired: false },
      ],
    },
  },
}
