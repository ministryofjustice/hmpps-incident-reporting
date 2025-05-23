// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2025-04-01T22:59:48.074Z

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

export const FOOD_REFUSAL_1: IncidentTypeConfiguration = {
  incidentType: 'FOOD_REFUSAL_1',
  active: true,
  startingQuestionId: '44990',
  questions: {
    '44199': {
      id: '44199',
      active: true,
      code: 'IS THE FOOD REFUSAL EFFECTING ANY OTHER MEDICAL CONDITION',
      label: 'Is the food refusal effecting any other medical condition?',
      multipleAnswers: false,
      answers: [
        {
          id: '179164',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44427',
        },
        {
          id: '179163',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'Where is the prisoner currently located?',
      multipleAnswers: false,
      answers: [
        {
          id: '179556',
          code: 'NORMAL LOCATION',
          active: true,
          label: 'Normal location',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          id: '179559',
          code: 'SEGREGATION UNIT',
          active: true,
          label: 'Segregation unit',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          id: '179555',
          code: 'HEALTH CARE CENTRE',
          active: true,
          label: 'Health care centre',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          id: '179558',
          code: 'OUTSIDE HOSPITAL',
          active: true,
          label: 'Outside hospital',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44399',
        },
        {
          id: '179557',
          code: 'OTHER',
          active: true,
          label: 'Other',
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
      label: 'Is the prisoner thought to be obtaining food from other sources?',
      multipleAnswers: false,
      answers: [
        {
          id: '179841',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44688',
        },
        {
          id: '179840',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'Is the food refusal currently considered life threatening?',
      multipleAnswers: false,
      answers: [
        {
          id: '179913',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179912',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'Has the prison service press office been informed?',
      multipleAnswers: false,
      answers: [
        {
          id: '180503',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44887',
        },
        {
          id: '180502',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'Is the food refusal continuing?',
      multipleAnswers: false,
      answers: [
        {
          id: '180875',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44989',
        },
        {
          id: '180874',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'Describe the type of food refusal',
      multipleAnswers: false,
      answers: [
        {
          id: '181149',
          code: 'ALL FOOD AND LIQUIDS',
          active: true,
          label: 'All food and liquids',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44319',
        },
        {
          id: '181151',
          code: 'FOOD ONLY',
          active: true,
          label: 'Food only',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44319',
        },
        {
          id: '181150',
          code: 'FLUIDS ONLY',
          active: true,
          label: 'Fluids only',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44319',
        },
        {
          id: '181152',
          code: 'OTHER',
          active: true,
          label: 'Other',
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
      label: 'What is the reason for this food refusal?',
      multipleAnswers: false,
      answers: [
        {
          id: '181539',
          code: 'FACILITIES',
          active: true,
          label: 'Facilities',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181540',
          code: 'FOOD',
          active: true,
          label: 'Food',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181543',
          code: 'PAY',
          active: true,
          label: 'Pay',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181546',
          code: 'VISITS',
          active: true,
          label: 'Visits',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181544',
          code: 'TIME OUT OF CELL',
          active: true,
          label: 'Time out of cell',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181541',
          code: 'LOCATION',
          active: true,
          label: 'Location',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181545',
          code: 'TRANSFER',
          active: true,
          label: 'Transfer',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181538',
          code: 'CHARGES/CONVICTIONS',
          active: true,
          label: 'Charges/convictions',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44768',
        },
        {
          id: '181542',
          code: 'OTHER',
          active: true,
          label: 'Other',
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
      label: 'Duration of food refusal',
      multipleAnswers: false,
      answers: [
        {
          id: '181926',
          code: 'ENTER HOURS',
          active: true,
          label: 'Enter hours',
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
      label: 'Is there any media interest in this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '181928',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44575',
        },
        {
          id: '181927',
          code: 'NO',
          active: true,
          label: 'No',
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
  requiresPrisoners: true,
}

export default FOOD_REFUSAL_1
