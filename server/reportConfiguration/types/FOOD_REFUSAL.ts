// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-10-15T17:17:40.098Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const FOOD_REFUSAL: IncidentTypeConfiguration = {
  incidentType: 'FOOD_REFUSAL',
  active: true,
  startingQuestionId: '44990',
  questions: {
    '44199': {
      id: '44199',
      active: true,
      code: 'IS THE FOOD REFUSAL EFFECTING ANY OTHER MEDICAL CONDITION',
      label: 'IS THE FOOD REFUSAL EFFECTING ANY OTHER MEDICAL CONDITION',
      multipleAnswers: false,
      answers: [
        {
          id: '179164',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44427',
        },
        {
          id: '179163',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44427',
        },
      ],
    },
    '44319': {
      id: '44319',
      active: true,
      code: 'WHERE IS THE PRISONER CURRENTLY LOCATED',
      label: 'WHERE IS THE PRISONER CURRENTLY LOCATED',
      multipleAnswers: false,
      answers: [
        {
          id: '179556',
          code: 'NORMAL LOCATION',
          active: true,
          label: 'NORMAL LOCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          id: '179559',
          code: 'SEGREGATION UNIT',
          active: true,
          label: 'SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          id: '179555',
          code: 'HEALTH CARE CENTRE',
          active: true,
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          id: '179558',
          code: 'OUTSIDE HOSPITAL',
          active: true,
          label: 'OUTSIDE HOSPITAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          id: '179557',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44399',
        },
      ],
    },
    '44399': {
      id: '44399',
      active: true,
      code: 'IS THE PRISONER THOUGHT TO BE OBTAINING FOOD FROM OTHER SOURCES',
      label: 'IS THE PRISONER THOUGHT TO BE OBTAINING FOOD FROM OTHER SOURCES',
      multipleAnswers: false,
      answers: [
        {
          id: '179841',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44688',
        },
        {
          id: '179840',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44688',
        },
      ],
    },
    '44427': {
      id: '44427',
      active: true,
      code: 'IS THE FOOD REFUSAL CURRENTLY CONSIDERED LIFE THREATENING',
      label: 'IS THE FOOD REFUSAL CURRENTLY CONSIDERED LIFE THREATENING',
      multipleAnswers: false,
      answers: [
        {
          id: '179913',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179912',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44575': {
      id: '44575',
      active: true,
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          id: '180503',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44887',
        },
        {
          id: '180502',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44887',
        },
      ],
    },
    '44688': {
      id: '44688',
      active: true,
      code: 'IS THE FOOD REFUSAL CONTINUING',
      label: 'IS THE FOOD REFUSAL CONTINUING',
      multipleAnswers: false,
      answers: [
        {
          id: '180875',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44989',
        },
        {
          id: '180874',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44989',
        },
      ],
    },
    '44768': {
      id: '44768',
      active: true,
      code: 'DESCRIBE THE TYPE OF FOOD REFUSAL',
      label: 'DESCRIBE THE TYPE OF FOOD REFUSAL',
      multipleAnswers: false,
      answers: [
        {
          id: '181149',
          code: 'ALL FOOD AND LIQUIDS',
          active: true,
          label: 'ALL FOOD AND LIQUIDS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44319',
        },
        {
          id: '181151',
          code: 'FOOD ONLY',
          active: true,
          label: 'FOOD ONLY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44319',
        },
        {
          id: '181150',
          code: 'FLUIDS ONLY',
          active: true,
          label: 'FLUIDS ONLY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44319',
        },
        {
          id: '181152',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44319',
        },
      ],
    },
    '44887': {
      id: '44887',
      active: true,
      code: 'WHAT IS THE REASON FOR THIS FOOD REFUSAL',
      label: 'WHAT IS THE REASON FOR THIS FOOD REFUSAL',
      multipleAnswers: false,
      answers: [
        {
          id: '181539',
          code: 'FACILITIES',
          active: true,
          label: 'FACILITIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181540',
          code: 'FOOD',
          active: true,
          label: 'FOOD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181543',
          code: 'PAY',
          active: true,
          label: 'PAY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181546',
          code: 'VISITS',
          active: true,
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181544',
          code: 'TIME OUT OF CELL',
          active: true,
          label: 'TIME OUT OF CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181541',
          code: 'LOCATION',
          active: true,
          label: 'LOCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181545',
          code: 'TRANSFER',
          active: true,
          label: 'TRANSFER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181538',
          code: 'CHARGES/CONVICTIONS',
          active: true,
          label: 'CHARGES/CONVICTIONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181542',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44768',
        },
      ],
    },
    '44989': {
      id: '44989',
      active: true,
      code: 'DURATION OF FOOD REFUSAL',
      label: 'DURATION OF FOOD REFUSAL',
      multipleAnswers: false,
      answers: [
        {
          id: '181926',
          code: 'ENTER HOURS',
          active: true,
          label: 'ENTER HOURS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44199',
        },
      ],
    },
    '44990': {
      id: '44990',
      active: true,
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          id: '181928',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44575',
        },
        {
          id: '181927',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44575',
        },
      ],
    },
  },
  prisonerRoles: [
    {
      prisonerRole: 'PERPETRATOR',
      onlyOneAllowed: false,
      active: true,
    },
  ],
} as const

export default FOOD_REFUSAL
