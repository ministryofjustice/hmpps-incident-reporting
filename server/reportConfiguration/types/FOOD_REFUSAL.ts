// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:54.920Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const FOOD_REFUSAL: IncidentTypeConfiguration = {
  incidentType: 'FOOD_REFUSAL',
  active: true,
  startingQuestionId: '44990',
  questions: {
    '44199': {
      id: '44199',
      label: 'IS THE FOOD REFUSAL EFFECTING ANY OTHER MEDICAL CONDITION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44427',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44427',
        },
      ],
    },
    '44319': {
      id: '44319',
      label: 'WHERE IS THE PRISONER CURRENTLY LOCATED',
      multipleAnswers: false,
      answers: [
        {
          label: 'NORMAL LOCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          label: 'SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          label: 'OUTSIDE HOSPITAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44399',
        },
      ],
    },
    '44399': {
      id: '44399',
      label: 'IS THE PRISONER THOUGHT TO BE OBTAINING FOOD FROM OTHER SOURCES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44688',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44688',
        },
      ],
    },
    '44427': {
      id: '44427',
      label: 'IS THE FOOD REFUSAL CURRENTLY CONSIDERED LIFE THREATENING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44575': {
      id: '44575',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44887',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44887',
        },
      ],
    },
    '44688': {
      id: '44688',
      label: 'IS THE FOOD REFUSAL CONTINUING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44989',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44989',
        },
      ],
    },
    '44768': {
      id: '44768',
      label: 'DESCRIBE THE TYPE OF FOOD REFUSAL',
      multipleAnswers: false,
      answers: [
        {
          label: 'ALL FOOD AND LIQUIDS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44319',
        },
        {
          label: 'FOOD ONLY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44319',
        },
        {
          label: 'FLUIDS ONLY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44319',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44319',
        },
      ],
    },
    '44887': {
      id: '44887',
      label: 'WHAT IS THE REASON FOR THIS FOOD REFUSAL',
      multipleAnswers: false,
      answers: [
        {
          label: 'FACILITIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          label: 'FOOD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          label: 'PAY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          label: 'TIME OUT OF CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          label: 'LOCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          label: 'TRANSFER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          label: 'CHARGES/CONVICTIONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44768',
        },
      ],
    },
    '44989': {
      id: '44989',
      label: 'DURATION OF FOOD REFUSAL',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER HOURS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44199',
        },
      ],
    },
    '44990': {
      id: '44990',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44575',
        },
        {
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
