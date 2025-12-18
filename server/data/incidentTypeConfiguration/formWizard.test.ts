import type express from 'express'
import type FormWizard from 'hmpo-form-wizard'

import { EmptyController } from '../../controllers/empty'
import { QuestionsController } from '../../routes/reports/questions/controller'
import generateFields, { checkMultipleValues, generateSteps } from './formWizard'
import type { IncidentTypeConfiguration } from './types'
import * as FIND_6 from '../testData/FIND_6'
import * as ESCAPE_FROM_PRISON_1 from '../testData/ESCAPE_FROM_PRISON_1'

const testConfig: IncidentTypeConfiguration = {
  incidentType: 'MISCELLANEOUS_1',
  active: true,
  prisonerRoles: [],
  startingQuestionCode: 'qanimals',
  questions: {
    qanimals: {
      code: 'qanimals',
      question: 'WHICH ANIMALS DO YOU LIKE',
      questionHint: 'Please select all that apply',
      label: 'Which animals do you like?',
      active: true,
      multipleAnswers: true,
      answers: [
        {
          code: 'qanimals-a1',
          response: 'DOG',
          responseHint: 'A loyal and friendly companion',
          label: 'Dog',
          active: true,
          dateRequired: false,
          commentRequested: false,
          commentMandatory: false,
          nextQuestionCode: 'qdog',
        },
        {
          code: 'qanimals-a2',
          response: 'CAT',
          responseHint: 'Meow',
          label: 'Cat',
          active: true,
          dateRequired: false,
          commentRequested: false,
          commentMandatory: false,
          nextQuestionCode: 'qicecream',
        },
        {
          code: 'qanimals-a3',
          response: 'FOX',
          responseHint: 'Jumps around',
          label: 'Fox',
          active: true,
          dateRequired: false,
          commentRequested: false,
          commentMandatory: false,
          nextQuestionCode: 'qicecream',
        },
        // Inactive answer
        {
          code: 'qanimals-a4',
          response: 'HONEY BADGER',
          label: 'Honey badger',
          active: false,
          dateRequired: false,
          commentRequested: false,
          commentMandatory: false,
          nextQuestionCode: 'qicecream',
        },
      ],
    },
    qdog: {
      code: 'qdog',
      question: 'DO YOU HAVE A DOG',
      questionHint: 'Please select one option',
      label: 'Do you have a dog?',
      active: true,
      multipleAnswers: false,
      answers: [
        {
          code: 'qdog-a1',
          response: 'YES',
          label: 'Yes',
          active: true,
          dateRequired: true,
          commentRequested: true,
          commentMandatory: true,
          nextQuestionCode: 'qicecream',
        },
        {
          code: 'qdog-a2',
          response: 'NO',
          label: 'No',
          active: true,
          dateRequired: false,
          commentRequested: false,
          commentMandatory: false,
          nextQuestionCode: 'qicecream',
        },
      ],
    },
    qicecream: {
      code: 'qicecream',
      question: 'DO YOU LIKE ICE CREAM',
      questionHint:
        'This question is trying to find out if you like ice cream. If you do, please specify your favourite flavour.',
      label: 'Do you like ice cream?',
      active: true,
      multipleAnswers: false,
      answers: [
        {
          code: 'qicecream-a1',
          response: 'YES (SPECIFY FAVOURITE FLAVOUR)',
          responseHint: 'If yes then please specify your favourite flavour',
          label: 'Yes (specify favourite flavour)',
          active: true,
          dateRequired: false,
          commentLabel: 'Enter ice cream flavour',
          commentRequested: true,
          commentMandatory: true,
          nextQuestionCode: 'qend',
        },
        {
          code: 'q2-a2',
          response: 'no',
          label: 'No',
          active: true,
          dateRequired: false,
          commentRequested: false,
          commentMandatory: false,
          nextQuestionCode: 'qend',
        },
      ],
    },
    qend: {
      code: 'qend',
      question: 'DO YOU WANT TO FINISH',
      label: 'Do you want to finish?',
      active: true,
      multipleAnswers: false,
      answers: [
        {
          code: 'q2-a1',
          response: 'yes',
          label: 'Yes',
          active: true,
          dateRequired: false,
          commentRequested: false,
          commentMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: 'q2-a2',
          response: 'no',
          label: 'No',
          active: true,
          dateRequired: false,
          commentRequested: false,
          commentMandatory: false,
          nextQuestionCode: null,
        },
      ],
    },
    // Inactive question
    'q3-inactive': {
      code: 'q3-inactive',
      question: 'REMOVE',
      label: 'Remove this question please',
      active: false,
      multipleAnswers: false,
      answers: [],
    },
  },
}

describe.each([
  { scenario: 'skipping inactive questions', includeInactive: false },
  { scenario: '*including* inactive questions', includeInactive: true },
])('generateSteps() $scenario', ({ includeInactive }) => {
  it('returns list of steps for the given config', () => {
    const steps = generateSteps(testConfig, includeInactive)

    const expectedSteps: FormWizard.Steps<FormWizard.MultiValues> = {
      '/': {
        entryPoint: true,
        reset: true,
        resetJourney: true,
        skip: true,
        next: 'qanimals',
        controller: EmptyController,
      },
      '/qanimals': {
        controller: QuestionsController,
        fields: ['qanimals'],
        next: [
          {
            field: 'qanimals',
            value: ['DOG'],
            op: checkMultipleValues,
            next: 'qdog',
          },
          {
            field: 'qanimals',
            value: includeInactive ? ['CAT', 'FOX', 'HONEY BADGER'] : ['CAT', 'FOX'],
            op: checkMultipleValues,
            next: 'qicecream',
          },
        ],
        entryPoint: true,
      },
      '/qdog': {
        controller: QuestionsController,
        fields: ['qdog', 'qdog-qdog-a1-date', 'qdog-qdog-a1-comment'],
        next: [
          {
            field: 'qdog',
            op: 'in',
            value: ['YES', 'NO'],
            next: 'qicecream',
          },
        ],
        entryPoint: true,
      },
      // '/qicecream' is the merge of existing '/qicecream' and '/qend'
      // 1. original `/qicecream`'s next replaced with `/qend`'s next
      // 2. `/qend`'s fields added to `/qicecream`'s fields
      // 3. original `/qend` removed from steps
      '/qicecream': {
        controller: QuestionsController,
        fields: ['qicecream', 'qicecream-qicecream-a1-comment', 'qend'],
        next: [
          {
            field: 'qend',
            op: 'in',
            value: ['yes', 'no'],
            next: null,
          },
        ],
        entryPoint: true,
      },
    }
    if (includeInactive) {
      expectedSteps['/q3-inactive'] = {
        controller: QuestionsController,
        fields: ['q3-inactive'],
        next: [],
        entryPoint: true,
      }
    }
    expect(steps).toEqual(expectedSteps)
  })

  it('returns grouped steps for a non-trivial report type config (FIND_6)', () => {
    const steps = generateSteps(FIND_6.config, includeInactive)
    const expectedSteps = FIND_6.steps

    expect(steps).toEqual(expectedSteps)
  })

  it('returns grouped steps for a non-trivial report type config (ESCAPE_FROM_PRISON_1)', () => {
    const steps = generateSteps(ESCAPE_FROM_PRISON_1.config, includeInactive)
    const expectedSteps = ESCAPE_FROM_PRISON_1.steps

    expect(steps).toEqual(expectedSteps)
  })
})

describe('generateFields()', () => {
  it('returns list of fields for the given config', () => {
    const fields = generateFields(testConfig)

    expect(fields).toEqual({
      qanimals: {
        name: 'qanimals',
        label: 'Which animals do you like?',
        hint: 'Please select all that apply',
        validate: ['required'],
        multiple: true,
        component: 'govukCheckboxes',
        items: [
          {
            value: 'DOG',
            label: 'Dog',
            hint: 'A loyal and friendly companion',
            dateRequired: false,
            commentRequired: false,
          },
          {
            value: 'CAT',
            label: 'Cat',
            hint: 'Meow',
            dateRequired: false,
            commentRequired: false,
          },
          {
            value: 'FOX',
            label: 'Fox',
            hint: 'Jumps around',
            dateRequired: false,
            commentRequired: false,
          },
        ],
      },
      qdog: {
        name: 'qdog',
        label: 'Do you have a dog?',
        hint: 'Please select one option',
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
        hint: 'This question is trying to find out if you like ice cream. If you do, please specify your favourite flavour.',
        validate: ['required'],
        multiple: false,
        component: 'govukRadios',
        items: [
          {
            value: 'YES (SPECIFY FAVOURITE FLAVOUR)',
            label: 'Yes (specify favourite flavour)',
            hint: 'If yes then please specify your favourite flavour',
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
        label: 'Enter ice cream flavour',
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

    const result = checkMultipleValues(submittedValues, null as FormWizard.Request, null as express.Response, condition)
    expect(result).toEqual(expected)
  })
})
