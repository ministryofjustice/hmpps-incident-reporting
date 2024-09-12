// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:59.267Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const RADIO_COMPROMISE: IncidentTypeConfiguration = {
  incidentType: 'RADIO_COMPROMISE',
  active: true,
  startingQuestionId: '44802',
  questions: {
    '44125': {
      id: '44125',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44811',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44811',
        },
      ],
    },
    '44132': {
      id: '44132',
      label: 'HAS THE RADIO BEEN RECOVERED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45123',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44173': {
      id: '44173',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44916',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44916',
        },
      ],
    },
    '44184': {
      id: '44184',
      label: 'IS THE INTERFERENCE/JAM THOUGHT TO BE',
      multipleAnswers: false,
      answers: [
        {
          label: 'MALICIOUS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'UNINTENTIONAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44252': {
      id: '44252',
      label: 'HAS THE RADIO BEEN ISOLATED FROM THE NET',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44282',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44282',
        },
      ],
    },
    '44282': {
      id: '44282',
      label: 'HAS THE LOCAL FREQUENCY BEEN CHANGED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44618',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44618',
        },
      ],
    },
    '44453': {
      id: '44453',
      label: 'WHAT IS THE TYPE OF COMPROMISE',
      multipleAnswers: false,
      answers: [
        {
          label: 'INTERFERENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44648',
        },
        {
          label: 'NET JAM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44648',
        },
        {
          label: 'MISSING RADIO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44841',
        },
      ],
    },
    '44618': {
      id: '44618',
      label: 'WHAT ACTION WAS TAKEN TO RECOVER THE RADIO',
      multipleAnswers: false,
      answers: [
        {
          label: 'FULL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44132',
        },
        {
          label: 'PARTIAL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44132',
        },
      ],
    },
    '44648': {
      id: '44648',
      label: 'DESCRIBE THE SOURCE OF THE INTERFERENCE/JAM',
      multipleAnswers: false,
      answers: [
        {
          label: 'INTERNAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44184',
        },
        {
          label: 'EXTERNAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44184',
        },
        {
          label: 'NOT KNOWN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44184',
        },
      ],
    },
    '44712': {
      id: '44712',
      label: 'IS THE RADIO STILL OPERATIONAL',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44252',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44252',
        },
      ],
    },
    '44799': {
      id: '44799',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44173',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44173',
        },
      ],
    },
    '44801': {
      id: '44801',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44125',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44125',
        },
      ],
    },
    '44802': {
      id: '44802',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44801',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44125',
        },
      ],
    },
    '44811': {
      id: '44811',
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44799',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44799',
        },
      ],
    },
    '44841': {
      id: '44841',
      label: 'IS THE MISSING RADIO THOUGHT TO BE',
      multipleAnswers: false,
      answers: [
        {
          label: 'LOST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44856',
        },
        {
          label: 'MISLAID',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44856',
        },
        {
          label: 'STOLEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44856',
        },
      ],
    },
    '44856': {
      id: '44856',
      label: 'IS THE RADIO THOUGHT TO BE IN POSSESSION OF PRISONERS',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44712',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44712',
        },
      ],
    },
    '44916': {
      id: '44916',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44453',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44453',
        },
      ],
    },
    '45123': {
      id: '45123',
      label: 'WHERE WAS THE RADIO FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'PRISONER POSSESSION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'CONCEALED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'DISCARDED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'MISLAID/LOST',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
  },
} as const

export default RADIO_COMPROMISE
