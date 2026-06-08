// Food refusal v2 (live from 2026-07-01): a deliberately short two-question flow defined by the
// Safety team — "which type of refusal" then "where is the prisoner located". Every question/answer
// code is freshly allocated (globally unique) so the config can be back-synced to NOMIS without PK
// clashes.

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

export const FOOD_REFUSAL_2: IncidentTypeConfiguration = {
  incidentType: 'FOOD_REFUSAL_2',
  active: true,
  startingQuestionCode: '900001',
  questions: {
    '900001': {
      code: '900001',
      active: true,
      question: 'Which type of refusal occurred?',
      label: 'Which type of refusal occurred?',
      multipleAnswers: false,
      answers: [
        {
          code: '950001',
          response: 'Food',
          active: true,
          label: 'Food',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: '900002',
        },
        {
          code: '950002',
          response: 'Liquid',
          active: true,
          label: 'Liquid',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: '900002',
        },
        {
          code: '950003',
          response: 'Food and liquid',
          active: true,
          label: 'Food and liquid',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: '900002',
        },
      ],
    },
    '900002': {
      code: '900002',
      active: true,
      question: 'Where is the prisoner currently located?',
      label: 'Where is the prisoner currently located?',
      multipleAnswers: false,
      answers: [
        {
          code: '950004',
          response: 'Normal location',
          active: true,
          label: 'Normal location',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '950005',
          response: 'Segregation unit',
          active: true,
          label: 'Segregation unit',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '950006',
          response: 'Constant supervision cell',
          active: true,
          label: 'Constant supervision cell',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '950007',
          response: 'Health care centre',
          active: true,
          label: 'Health care centre',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '950008',
          response: 'Outside hospital',
          active: true,
          label: 'Outside hospital',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '950009',
          response: 'Other',
          active: true,
          label: 'Other',
          commentRequested: true,
          commentMandatory: true,
          dateMandatory: false,
          nextQuestionCode: null,
        },
      ],
    },
  },
  prisonerRoles: [
    {
      prisonerRole: 'PERPETRATOR',
      onlyOneAllowed: true,
      active: true,
    },
  ],
  requiresPrisoners: true,
}

export default FOOD_REFUSAL_2
