// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-25T09:26:18.967Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const RADIO_COMPROMISE: IncidentTypeConfiguration = {
  incidentType: 'RADIO_COMPROMISE',
  active: true,
  startingQuestionId: '44802',
  questions: {
    '44125': {
      id: '44125',
      active: true,
      code: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44811',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44811',
        },
      ],
    },
    '44132': {
      id: '44132',
      active: true,
      code: 'HAS THE RADIO BEEN RECOVERED',
      label: 'HAS THE RADIO BEEN RECOVERED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45123',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44173': {
      id: '44173',
      active: true,
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44916',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44916',
        },
      ],
    },
    '44184': {
      id: '44184',
      active: true,
      code: 'IS THE INTERFERENCE/JAM THOUGHT TO BE',
      label: 'IS THE INTERFERENCE/JAM THOUGHT TO BE',
      multipleAnswers: false,
      answers: [
        {
          code: 'MALICIOUS',
          active: true,
          label: 'MALICIOUS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'UNINTENTIONAL',
          active: true,
          label: 'UNINTENTIONAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44252': {
      id: '44252',
      active: true,
      code: 'HAS THE RADIO BEEN ISOLATED FROM THE NET',
      label: 'HAS THE RADIO BEEN ISOLATED FROM THE NET',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44282',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44282',
        },
      ],
    },
    '44282': {
      id: '44282',
      active: true,
      code: 'HAS THE LOCAL FREQUENCY BEEN CHANGED',
      label: 'HAS THE LOCAL FREQUENCY BEEN CHANGED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44618',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44618',
        },
      ],
    },
    '44453': {
      id: '44453',
      active: true,
      code: 'WHAT IS THE TYPE OF COMPROMISE',
      label: 'WHAT IS THE TYPE OF COMPROMISE',
      multipleAnswers: false,
      answers: [
        {
          code: 'INTERFERENCE',
          active: true,
          label: 'INTERFERENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44648',
        },
        {
          code: 'NET JAM',
          active: true,
          label: 'NET JAM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44648',
        },
        {
          code: 'MISSING RADIO',
          active: true,
          label: 'MISSING RADIO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44841',
        },
      ],
    },
    '44618': {
      id: '44618',
      active: true,
      code: 'WHAT ACTION WAS TAKEN TO RECOVER THE RADIO',
      label: 'WHAT ACTION WAS TAKEN TO RECOVER THE RADIO',
      multipleAnswers: false,
      answers: [
        {
          code: 'FULL SEARCH',
          active: true,
          label: 'FULL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44132',
        },
        {
          code: 'PARTIAL SEARCH',
          active: true,
          label: 'PARTIAL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44132',
        },
      ],
    },
    '44648': {
      id: '44648',
      active: true,
      code: 'DESCRIBE THE SOURCE OF THE INTERFERENCE/JAM',
      label: 'DESCRIBE THE SOURCE OF THE INTERFERENCE/JAM',
      multipleAnswers: false,
      answers: [
        {
          code: 'INTERNAL',
          active: true,
          label: 'INTERNAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44184',
        },
        {
          code: 'EXTERNAL',
          active: true,
          label: 'EXTERNAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44184',
        },
        {
          code: 'NOT KNOWN',
          active: true,
          label: 'NOT KNOWN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44184',
        },
      ],
    },
    '44712': {
      id: '44712',
      active: true,
      code: 'IS THE RADIO STILL OPERATIONAL',
      label: 'IS THE RADIO STILL OPERATIONAL',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44252',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44252',
        },
      ],
    },
    '44799': {
      id: '44799',
      active: true,
      code: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44173',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44173',
        },
      ],
    },
    '44801': {
      id: '44801',
      active: true,
      code: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44125',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44125',
        },
      ],
    },
    '44802': {
      id: '44802',
      active: true,
      code: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44801',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44125',
        },
      ],
    },
    '44811': {
      id: '44811',
      active: true,
      code: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44799',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44799',
        },
      ],
    },
    '44841': {
      id: '44841',
      active: true,
      code: 'IS THE MISSING RADIO THOUGHT TO BE',
      label: 'IS THE MISSING RADIO THOUGHT TO BE',
      multipleAnswers: false,
      answers: [
        {
          code: 'LOST',
          active: true,
          label: 'LOST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44856',
        },
        {
          code: 'MISLAID',
          active: true,
          label: 'MISLAID',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44856',
        },
        {
          code: 'STOLEN',
          active: true,
          label: 'STOLEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44856',
        },
      ],
    },
    '44856': {
      id: '44856',
      active: true,
      code: 'IS THE RADIO THOUGHT TO BE IN POSSESSION OF PRISONERS',
      label: 'IS THE RADIO THOUGHT TO BE IN POSSESSION OF PRISONERS',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44712',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44712',
        },
      ],
    },
    '44916': {
      id: '44916',
      active: true,
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44453',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44453',
        },
      ],
    },
    '45123': {
      id: '45123',
      active: true,
      code: 'WHERE WAS THE RADIO FOUND',
      label: 'WHERE WAS THE RADIO FOUND',
      multipleAnswers: false,
      answers: [
        {
          code: 'PRISONER POSSESSION',
          active: true,
          label: 'PRISONER POSSESSION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'CONCEALED',
          active: true,
          label: 'CONCEALED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'DISCARDED',
          active: true,
          label: 'DISCARDED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'MISLAID/LOST',
          active: true,
          label: 'MISLAID/LOST',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
  },
  prisonerRoles: [
    {
      prisonerRole: 'ACTIVE_INVOLVEMENT',
      onlyOneAllowed: false,
      active: true,
    },
    {
      prisonerRole: 'ASSISTED_STAFF',
      onlyOneAllowed: false,
      active: true,
    },
    {
      prisonerRole: 'IMPEDED_STAFF',
      onlyOneAllowed: false,
      active: true,
    },
    {
      prisonerRole: 'PERPETRATOR',
      onlyOneAllowed: false,
      active: true,
    },
    {
      prisonerRole: 'SUSPECTED_INVOLVED',
      onlyOneAllowed: false,
      active: true,
    },
  ],
} as const

export default RADIO_COMPROMISE
