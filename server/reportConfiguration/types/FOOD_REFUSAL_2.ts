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
      question: 'WHICH TYPE OF REFUSAL OCCURRED',
      label: 'Which type of refusal occurred?',
      multipleAnswers: false,
      answers: [
        {
          code: '950001',
          response: 'FOOD',
          active: true,
          label: 'Food',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: '900002',
        },
        {
          code: '950002',
          response: 'LIQUID',
          active: true,
          label: 'Liquid',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: '900002',
        },
        {
          code: '950003',
          response: 'FOOD AND LIQUID',
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
      question: 'WHERE IS THE PRISONER CURRENTLY LOCATED',
      label: 'Where is the prisoner currently located?',
      multipleAnswers: false,
      answers: [
        {
          code: '950004',
          response: 'NORMAL LOCATION',
          active: true,
          label: 'Normal location',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '950005',
          response: 'SEGREGATION UNIT',
          active: true,
          label: 'Segregation unit',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '950006',
          response: 'CONSTANT SUPERVISION CELL',
          active: true,
          label: 'Constant supervision cell',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '950007',
          response: 'HEALTH CARE CENTRE',
          active: true,
          label: 'Health care centre',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '950008',
          response: 'OUTSIDE HOSPITAL',
          active: true,
          label: 'Outside hospital',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '950009',
          response: 'OTHER',
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
