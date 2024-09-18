// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-16T15:42:14.361Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const FOOD_REFUSAL: IncidentTypeConfiguration = {
  incidentType: 'FOOD_REFUSAL',
  active: true,
  startingQuestionId: '44990',
  questions: {
    '44199': {
      id: '44199',
      code: 'IS THE FOOD REFUSAL EFFECTING ANY OTHER MEDICAL CONDITION',
      label: 'IS THE FOOD REFUSAL EFFECTING ANY OTHER MEDICAL CONDITION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44427',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44427',
        },
      ],
    },
    '44319': {
      id: '44319',
      code: 'WHERE IS THE PRISONER CURRENTLY LOCATED',
      label: 'WHERE IS THE PRISONER CURRENTLY LOCATED',
      multipleAnswers: false,
      answers: [
        {
          code: 'NORMAL LOCATION',
          label: 'NORMAL LOCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          code: 'SEGREGATION UNIT',
          label: 'SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          code: 'HEALTH CARE CENTRE',
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          code: 'OUTSIDE HOSPITAL',
          label: 'OUTSIDE HOSPITAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44399',
        },
      ],
    },
    '44399': {
      id: '44399',
      code: 'IS THE PRISONER THOUGHT TO BE OBTAINING FOOD FROM OTHER SOURCES',
      label: 'IS THE PRISONER THOUGHT TO BE OBTAINING FOOD FROM OTHER SOURCES',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44688',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44688',
        },
      ],
    },
    '44427': {
      id: '44427',
      code: 'IS THE FOOD REFUSAL CURRENTLY CONSIDERED LIFE THREATENING',
      label: 'IS THE FOOD REFUSAL CURRENTLY CONSIDERED LIFE THREATENING',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44575': {
      id: '44575',
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44887',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44887',
        },
      ],
    },
    '44688': {
      id: '44688',
      code: 'IS THE FOOD REFUSAL CONTINUING',
      label: 'IS THE FOOD REFUSAL CONTINUING',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44989',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44989',
        },
      ],
    },
    '44768': {
      id: '44768',
      code: 'DESCRIBE THE TYPE OF FOOD REFUSAL',
      label: 'DESCRIBE THE TYPE OF FOOD REFUSAL',
      multipleAnswers: false,
      answers: [
        {
          code: 'ALL FOOD AND LIQUIDS',
          label: 'ALL FOOD AND LIQUIDS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44319',
        },
        {
          code: 'FOOD ONLY',
          label: 'FOOD ONLY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44319',
        },
        {
          code: 'FLUIDS ONLY',
          label: 'FLUIDS ONLY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44319',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44319',
        },
      ],
    },
    '44887': {
      id: '44887',
      code: 'WHAT IS THE REASON FOR THIS FOOD REFUSAL',
      label: 'WHAT IS THE REASON FOR THIS FOOD REFUSAL',
      multipleAnswers: false,
      answers: [
        {
          code: 'FACILITIES',
          label: 'FACILITIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          code: 'FOOD',
          label: 'FOOD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          code: 'PAY',
          label: 'PAY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          code: 'VISITS',
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          code: 'TIME OUT OF CELL',
          label: 'TIME OUT OF CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          code: 'LOCATION',
          label: 'LOCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          code: 'TRANSFER',
          label: 'TRANSFER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          code: 'CHARGES/CONVICTIONS',
          label: 'CHARGES/CONVICTIONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44768',
        },
      ],
    },
    '44989': {
      id: '44989',
      code: 'DURATION OF FOOD REFUSAL',
      label: 'DURATION OF FOOD REFUSAL',
      multipleAnswers: false,
      answers: [
        {
          code: 'ENTER HOURS',
          label: 'ENTER HOURS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44199',
        },
      ],
    },
    '44990': {
      id: '44990',
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44575',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44575',
        },
      ],
    },
  },
} as const

export default FOOD_REFUSAL