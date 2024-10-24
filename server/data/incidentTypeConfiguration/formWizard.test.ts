import { type FormWizard } from 'hmpo-form-wizard'
import QuestionsController from '../../controllers/wip/questionsController'
import { checkMultipleValues, generateFields, generateSteps } from './formWizard'
import { type IncidentTypeConfiguration } from './types'

const testConfig: IncidentTypeConfiguration = {
  incidentType: 'MISCELLANEOUS',
  active: true,
  prisonerRoles: [],
  startingQuestionId: 'qanimals',
  questions: {
    qanimals: {
      id: 'qanimals',
      code: 'WHICH ANIMALS DO YOU LIKE',
      label: 'Which animals do you like?',
      active: true,
      multipleAnswers: true,
      answers: [
        {
          id: 'qanimals-a1',
          code: 'DOG',
          label: 'Dog',
          active: true,
          dateRequired: false,
          commentRequired: false,
          nextQuestionId: 'qdog',
        },
        {
          id: 'qanimals-a2',
          code: 'CAT',
          label: 'Cat',
          active: true,
          dateRequired: false,
          commentRequired: false,
          nextQuestionId: 'icecream',
        },
        {
          id: 'qanimals-a3',
          code: 'FOX',
          label: 'Fox',
          active: true,
          dateRequired: false,
          commentRequired: false,
          nextQuestionId: 'icecream',
        },
        // Inactive answer
        {
          id: 'qanimals-a4',
          code: 'HONEY BADGER',
          label: 'Honey badger',
          active: false,
          dateRequired: false,
          commentRequired: false,
          nextQuestionId: 'icecream',
        },
      ],
    },
    qdog: {
      id: 'qdog',
      code: 'DO YOU HAVE A DOG',
      label: 'Do you have a dog?',
      active: true,
      multipleAnswers: false,
      answers: [
        {
          id: 'qdog-a1',
          code: 'YES',
          label: 'Yes',
          active: true,
          dateRequired: true,
          commentRequired: true,
          nextQuestionId: 'qicecream',
        },
        {
          id: 'qdog-a2',
          code: 'NO',
          label: 'No',
          active: true,
          dateRequired: false,
          commentRequired: false,
          nextQuestionId: 'qicecream',
        },
      ],
    },
    qicecream: {
      id: 'qicecream',
      code: 'DO YOU LIKE ICE CREAM',
      label: 'Do you like ice cream?',
      active: true,
      multipleAnswers: false,
      answers: [
        {
          id: 'qicecream-a1',
          code: 'YES (SPECIFY FAVOURITE FLAVOUR)',
          label: 'Yes (specify favourite flabour)',
          active: true,
          dateRequired: false,
          commentRequired: true,
          nextQuestionId: 'qend',
        },
        {
          id: 'q2-a2',
          code: 'no',
          label: 'No',
          active: true,
          dateRequired: false,
          commentRequired: false,
          nextQuestionId: 'qend',
        },
      ],
    },
    qend: {
      id: 'qend',
      code: 'DO YOU WANT TO FINISH',
      label: 'Do you want to finish?',
      active: true,
      multipleAnswers: false,
      answers: [
        {
          id: 'q2-a1',
          code: 'yes',
          label: 'Yes',
          active: true,
          dateRequired: false,
          commentRequired: false,
          nextQuestionId: null,
        },
        {
          id: 'q2-a2',
          code: 'no',
          label: 'No',
          active: true,
          dateRequired: false,
          commentRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    // Inactive question
    'q3-inactive': {
      id: 'q3-inactive',
      code: 'REMOVE',
      label: 'Remove this question please',
      active: false,
      multipleAnswers: false,
      answers: [],
    },
  },
}

describe('generateSteps()', () => {
  it('returns list of steps for the given config', () => {
    const steps = generateSteps(testConfig)

    expect(steps).toEqual({
      '/': {
        entryPoint: true,
        reset: true,
        resetJourney: true,
        skip: true,
        next: 'qanimals',
      },
      '/qanimals': {
        controller: QuestionsController,
        fields: ['qanimals'],
        template: 'questionPage',
        next: [
          {
            field: 'qanimals',
            value: ['DOG'],
            op: checkMultipleValues,
            next: 'qdog',
          },
          {
            field: 'qanimals',
            value: ['CAT', 'FOX'],
            op: checkMultipleValues,
            next: 'icecream',
          },
        ],
      },
      '/qdog': {
        controller: QuestionsController,
        fields: ['qdog', 'qdog-qdog-a1-date', 'qdog-qdog-a1-comment'],
        template: 'questionPage',
        next: [
          {
            field: 'qdog',
            op: 'in',
            value: ['YES', 'NO'],
            next: 'qicecream',
          },
        ],
      },
      '/qicecream': {
        controller: QuestionsController,
        fields: ['qicecream', 'qicecream-qicecream-a1-comment'],
        template: 'questionPage',
        next: [
          {
            field: 'qicecream',
            op: 'in',
            value: ['YES (SPECIFY FAVOURITE FLAVOUR)', 'no'],
            next: 'qend',
          },
        ],
      },
      '/qend': {
        controller: QuestionsController,
        fields: ['qend'],
        template: 'questionPage',
        next: [
          {
            field: 'qend',
            op: 'in',
            value: ['yes', 'no'],
            next: null,
          },
        ],
      },
    })
  })
})

describe('generateFields()', () => {
  it('returns list of fields for the given config', () => {
    const fields = generateFields(testConfig)

    expect(fields).toEqual({
      qanimals: {
        name: 'qanimals',
        label: 'Which animals do you like?',
        validate: ['required'],
        multiple: true,
        component: 'govukCheckboxes',
        items: [
          {
            value: 'DOG',
            label: 'Dog',
            dateRequired: false,
            commentRequired: false,
          },
          {
            value: 'CAT',
            label: 'Cat',
            dateRequired: false,
            commentRequired: false,
          },
          {
            value: 'FOX',
            label: 'Fox',
            dateRequired: false,
            commentRequired: false,
          },
        ],
      },
      qdog: {
        name: 'qdog',
        label: 'Do you have a dog?',
        validate: ['required'],
        multiple: false,
        component: 'govukRadios',
        items: [
          {
            value: 'YES',
            label: 'Yes',
            dateRequired: true,
            commentRequired: true,
          },
          {
            value: 'NO',
            label: 'No',
            dateRequired: false,
            commentRequired: false,
          },
        ],
      },
      'qdog-qdog-a1-date': {
        name: 'qdog-qdog-a1-date',
        label: 'Date',
        component: 'mojDatePicker',
        validate: ['required', 'ukDate'],
        dependent: {
          field: 'qdog',
          value: 'YES',
        },
      },
      'qdog-qdog-a1-comment': {
        name: 'qdog-qdog-a1-comment',
        label: 'Comment',
        component: 'govukInput',
        validate: ['required'],
        dependent: {
          field: 'qdog',
          value: 'YES',
        },
      },
      qicecream: {
        name: 'qicecream',
        label: 'Do you like ice cream?',
        validate: ['required'],
        multiple: false,
        component: 'govukRadios',
        items: [
          {
            value: 'YES (SPECIFY FAVOURITE FLAVOUR)',
            label: 'Yes (specify favourite flabour)',
            dateRequired: false,
            commentRequired: true,
          },
          {
            value: 'no',
            label: 'No',
            dateRequired: false,
            commentRequired: false,
          },
        ],
      },
      'qicecream-qicecream-a1-comment': {
        name: 'qicecream-qicecream-a1-comment',
        label: 'Comment',
        component: 'govukInput',
        validate: ['required'],
        dependent: {
          field: 'qicecream',
          value: 'YES (SPECIFY FAVOURITE FLAVOUR)',
        },
      },
      qend: {
        name: 'qend',
        label: 'Do you want to finish?',
        validate: ['required'],
        multiple: false,
        component: 'govukRadios',
        items: [
          {
            value: 'yes',
            label: 'Yes',
            dateRequired: false,
            commentRequired: false,
          },
          {
            value: 'no',
            label: 'No',
            dateRequired: false,
            commentRequired: false,
          },
        ],
      },
    })
  })
})

describe('checkMultipleValues()', () => {
  it.each([
    { desc: 'no values submitted yet', submittedValues: undefined, expected: false },
    { desc: 'submitted values do not match', submittedValues: ['cat', 'lizard'], expected: false },
    { desc: 'submitted values match', submittedValues: ['fox', 'dog'], expected: true },
  ])('returns $expected when $desc', ({ submittedValues, expected }) => {
    const condition = { value: ['dog', 'turtle'] }

    const result = checkMultipleValues(submittedValues, null as FormWizard.Request, null as Express.Response, condition)
    expect(result).toEqual(expected)
  })
})
