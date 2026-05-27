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
  startingQuestionCode: 'qsingledate',
  questions: {
    // Single-answer question with a mandatory date (and a hint via commentLabel)
    qsingledate: {
      code: 'qsingledate',
      question: 'WHEN WAS THE EVENT',
      label: 'When was the event?',
      active: true,
      multipleAnswers: false,
      answers: [
        {
          code: 'qsingledate-a1',
          response: 'DATE ONLY',
          label: 'Enter date',
          active: true,
          dateMandatory: true,
          commentRequested: false,
          commentMandatory: false,
          commentLabel: 'For example, 17/5/2026',
          nextQuestionCode: 'qanimals',
        },
      ],
    },
    qanimals: {
      code: 'qanimals',
      question: 'WHICH ANIMALS DO YOU LIKE',
      questionHint: 'Please select all that apply.',
      label: 'Which animals do you like?',
      active: true,
      multipleAnswers: true,
      answers: [
        {
          code: 'qanimals-a1',
          response: 'DOG',
          responseHint: 'A loyal and friendly companion.',
          label: 'Dog',
          active: true,
          dateMandatory: false,
          commentRequested: false,
          commentMandatory: false,
          nextQuestionCode: 'qdog',
        },
        {
          code: 'qanimals-a2',
          response: 'CAT',
          responseHint: 'Meow.',
          label: 'Cat',
          active: true,
          dateMandatory: false,
          commentRequested: false,
          commentMandatory: false,
          nextQuestionCode: 'qicecream',
        },
        {
          code: 'qanimals-a3',
          response: 'FOX',
          responseHint: 'Jumps around.',
          label: 'Fox',
          active: true,
          dateMandatory: false,
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
          dateMandatory: false,
          commentRequested: false,
          commentMandatory: false,
          nextQuestionCode: 'qicecream',
        },
      ],
    },
    qdog: {
      code: 'qdog',
      question: 'DO YOU HAVE A DOG',
      questionHint: 'Please select one option.',
      label: 'Do you have a dog?',
      active: true,
      multipleAnswers: false,
      answers: [
        {
          code: 'qdog-a1',
          response: 'YES',
          label: 'Yes',
          active: true,
          dateMandatory: true,
          commentRequested: true,
          commentMandatory: true,
          nextQuestionCode: 'qicecream',
        },
        {
          code: 'qdog-a2',
          response: 'NO',
          label: 'No',
          active: true,
          dateMandatory: false,
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
          responseHint: 'If yes then please specify your favourite flavour.',
          label: 'Yes (specify favourite flavour)',
          active: true,
          dateMandatory: false,
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
          dateMandatory: false,
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
          dateMandatory: false,
          commentRequested: false,
          commentMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: 'q2-a2',
          response: 'no',
          label: 'No',
          active: true,
          dateMandatory: false,
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
        next: 'qsingledate',
        controller: EmptyController,
      },
      // Single-answer qsingledate is merged with the following non-branching qanimals step.
      // qanimals is always reached only via qsingledate (single parent), so they are grouped.
      '/qsingledate': {
        controller: QuestionsController,
        fields: ['qsingledate', 'qsingledate-qsingledate-a1-date', 'qanimals'],
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
      // Single-answer question: hidden field + date sub-field with hint from commentLabel
      qsingledate: {
        name: 'qsingledate',
        label: 'When was the event?',
        validate: [],
        multiple: false,
        component: 'hidden',
        singleAnswer: true,
        default: 'DATE ONLY',
        items: [
          {
            value: 'DATE ONLY',
            label: 'Enter date',
            hint: undefined,
            dateRequired: true,
            commentRequired: false,
          },
        ],
      },
      'qsingledate-qsingledate-a1-date': {
        name: 'qsingledate-qsingledate-a1-date',
        label: 'Enter date',
        hint: 'For example, 17/5/2026',
        component: 'mojDatePicker',
        validate: ['required', 'ukDate'],
        dependent: {
          field: 'qsingledate',
          value: 'DATE ONLY',
        },
      },
      qanimals: {
        name: 'qanimals',
        label: 'Which animals do you like?',
        hint: 'Please select all that apply.',
        validate: ['required'],
        multiple: true,
        component: 'govukCheckboxes',
        items: [
          {
            value: 'DOG',
            label: 'Dog',
            hint: 'A loyal and friendly companion.',
            dateRequired: false,
            commentRequired: false,
          },
          {
            value: 'CAT',
            label: 'Cat',
            hint: 'Meow.',
            dateRequired: false,
            commentRequired: false,
          },
          {
            value: 'FOX',
            label: 'Fox',
            hint: 'Jumps around.',
            dateRequired: false,
            commentRequired: false,
          },
        ],
      },
      qdog: {
        name: 'qdog',
        label: 'Do you have a dog?',
        hint: 'Please select one option.',
        validate: ['required'],
        multiple: false,
        component: 'govukRadios',
        items: [
          {
            value: 'YES',
            label: 'Yes',
            visuallyHiddenText: 'If selected, provide details',
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
        visuallyHiddenText: 'for Yes',
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
        visuallyHiddenText: 'for Yes',
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
            visuallyHiddenText: 'If selected, provide details',
            hint: 'If yes then please specify your favourite flavour.',
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
        visuallyHiddenText: 'for Yes (specify favourite flavour)',
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

describe('generateFields() for single-answer questions', () => {
  const singleAnswerConfig: IncidentTypeConfiguration = {
    incidentType: 'MISCELLANEOUS_1',
    active: true,
    prisonerRoles: [],
    startingQuestionCode: 'qdateonly',
    questions: {
      qdateonly: {
        code: 'qdateonly',
        question: 'WHEN WAS THE DATE',
        label: 'When was the date?',
        active: true,
        multipleAnswers: false,
        answers: [
          {
            code: 'qdateonly-a1',
            response: 'DATE_RESPONSE',
            label: 'Enter date',
            active: true,
            dateMandatory: true,
            commentRequested: false,
            commentMandatory: false,
            commentLabel: 'For example, 17/5/2026',
            nextQuestionCode: 'qcommentonly',
          },
        ],
      },
      qcommentonly: {
        code: 'qcommentonly',
        question: 'ENTER A COMMENT',
        label: 'Enter a comment',
        active: true,
        multipleAnswers: false,
        answers: [
          {
            code: 'qcommentonly-a1',
            response: 'COMMENT_RESPONSE',
            label: 'Enter details',
            active: true,
            dateMandatory: false,
            commentRequested: true,
            commentMandatory: true,
            commentLabel: 'Provide your comment here',
            nextQuestionCode: 'qdatepluscomment',
          },
        ],
      },
      qdatepluscomment: {
        code: 'qdatepluscomment',
        question: 'DATE AND COMMENT',
        label: 'Date and comment',
        active: true,
        multipleAnswers: false,
        answers: [
          {
            code: 'qdatepluscomment-a1',
            response: 'DATE_AND_COMMENT_RESPONSE',
            label: 'Enter date and comment',
            active: true,
            dateMandatory: true,
            commentRequested: true,
            commentMandatory: true,
            commentLabel: 'Describe the event',
            nextQuestionCode: null,
          },
        ],
      },
      qnone: {
        code: 'qnone',
        question: 'NO DATE OR COMMENT',
        label: 'No date or comment',
        active: true,
        multipleAnswers: false,
        answers: [
          {
            code: 'qnone-a1',
            response: 'NONE_RESPONSE',
            label: 'Auto answer',
            active: true,
            dateMandatory: false,
            commentRequested: false,
            commentMandatory: false,
            nextQuestionCode: null,
          },
        ],
      },
    },
  }

  it('single-answer with date only: hidden field + date sub-field with commentLabel as hint', () => {
    const fields = generateFields(singleAnswerConfig)

    expect(fields.qdateonly).toEqual({
      name: 'qdateonly',
      label: 'When was the date?',
      validate: [],
      multiple: false,
      component: 'hidden',
      singleAnswer: true,
      default: 'DATE_RESPONSE',
      items: [
        { value: 'DATE_RESPONSE', label: 'Enter date', hint: undefined, dateRequired: true, commentRequired: false },
      ],
    })

    expect(fields['qdateonly-qdateonly-a1-date']).toEqual({
      name: 'qdateonly-qdateonly-a1-date',
      label: 'Enter date',
      hint: 'For example, 17/5/2026',
      component: 'mojDatePicker',
      validate: ['required', 'ukDate'],
      dependent: { field: 'qdateonly', value: 'DATE_RESPONSE' },
    })
  })

  it('single-answer with comment only: hidden field + comment sub-field', () => {
    const fields = generateFields(singleAnswerConfig)

    expect(fields.qcommentonly).toEqual({
      name: 'qcommentonly',
      label: 'Enter a comment',
      validate: [],
      multiple: false,
      component: 'hidden',
      singleAnswer: true,
      default: 'COMMENT_RESPONSE',
      items: [
        {
          value: 'COMMENT_RESPONSE',
          label: 'Enter details',
          hint: undefined,
          dateRequired: false,
          commentRequired: true,
        },
      ],
    })

    expect(fields['qcommentonly-qcommentonly-a1-comment']).toEqual({
      name: 'qcommentonly-qcommentonly-a1-comment',
      label: 'Provide your comment here',
      component: 'govukInput',
      validate: ['required'],
      dependent: { field: 'qcommentonly', value: 'COMMENT_RESPONSE' },
    })

    // No date sub-field generated
    expect(fields['qcommentonly-qcommentonly-a1-date']).toBeUndefined()
  })

  it('single-answer with date + comment: commentLabel is the comment label (not the date hint)', () => {
    const fields = generateFields(singleAnswerConfig)

    expect(fields.qdatepluscomment).toMatchObject({
      component: 'hidden',
      singleAnswer: true,
      default: 'DATE_AND_COMMENT_RESPONSE',
    })

    // Date field uses the answer's descriptive label; no hint (commentLabel belongs to the comment field)
    expect(fields['qdatepluscomment-qdatepluscomment-a1-date']).toEqual({
      name: 'qdatepluscomment-qdatepluscomment-a1-date',
      label: 'Enter date and comment',
      hint: undefined,
      component: 'mojDatePicker',
      validate: ['required', 'ukDate'],
      dependent: { field: 'qdatepluscomment', value: 'DATE_AND_COMMENT_RESPONSE' },
    })

    // Comment field uses commentLabel as its label
    expect(fields['qdatepluscomment-qdatepluscomment-a1-comment']).toEqual({
      name: 'qdatepluscomment-qdatepluscomment-a1-comment',
      label: 'Describe the event',
      component: 'govukInput',
      validate: ['required'],
      dependent: { field: 'qdatepluscomment', value: 'DATE_AND_COMMENT_RESPONSE' },
    })
  })

  it('single-answer with no date or comment: hidden field only, no sub-fields', () => {
    const fields = generateFields(singleAnswerConfig)

    expect(fields.qnone).toEqual({
      name: 'qnone',
      label: 'No date or comment',
      validate: [],
      multiple: false,
      component: 'hidden',
      singleAnswer: true,
      default: 'NONE_RESPONSE',
      items: [
        { value: 'NONE_RESPONSE', label: 'Auto answer', hint: undefined, dateRequired: false, commentRequired: false },
      ],
    })

    expect(fields['qnone-qnone-a1-date']).toBeUndefined()
    expect(fields['qnone-qnone-a1-comment']).toBeUndefined()
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
