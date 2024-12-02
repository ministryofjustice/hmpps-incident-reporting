// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-12-02T17:35:42.090Z

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
      label: 'Is the incident the subject of an internal investigation?',
      multipleAnswers: false,
      answers: [
        {
          id: '178897',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44811',
        },
        {
          id: '178896',
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
      label: 'Has the radio been recovered?',
      multipleAnswers: false,
      answers: [
        {
          id: '178928',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45123',
        },
        {
          id: '178929',
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
      label: 'Is there any media interest in this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '179072',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44916',
        },
        {
          id: '179071',
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
      label: 'Is the interference/jam thought to be?',
      multipleAnswers: false,
      answers: [
        {
          id: '179097',
          code: 'MALICIOUS',
          active: true,
          label: 'MALICIOUS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179098',
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
      label: 'Has the radio been isolated from the net?',
      multipleAnswers: false,
      answers: [
        {
          id: '179328',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44282',
        },
        {
          id: '179327',
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
      label: 'Has the local frequency been changed?',
      multipleAnswers: false,
      answers: [
        {
          id: '179403',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44618',
        },
        {
          id: '179402',
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
      label: 'What is the type of compromise?',
      multipleAnswers: false,
      answers: [
        {
          id: '179991',
          code: 'INTERFERENCE',
          active: true,
          label: 'INTERFERENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44648',
        },
        {
          id: '179992',
          code: 'NET JAM',
          active: true,
          label: 'NET JAM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44648',
        },
        {
          id: '179993',
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
      label: 'What action was taken to recover the radio?',
      multipleAnswers: false,
      answers: [
        {
          id: '180653',
          code: 'FULL SEARCH',
          active: true,
          label: 'FULL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44132',
        },
        {
          id: '180654',
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
      label: 'Describe the source of the interference/jam',
      multipleAnswers: false,
      answers: [
        {
          id: '180744',
          code: 'INTERNAL',
          active: true,
          label: 'INTERNAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44184',
        },
        {
          id: '180743',
          code: 'EXTERNAL',
          active: true,
          label: 'EXTERNAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44184',
        },
        {
          id: '180745',
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
      label: 'Is the radio still operational?',
      multipleAnswers: false,
      answers: [
        {
          id: '180985',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44252',
        },
        {
          id: '180984',
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
      label: 'Is any member of staff facing disciplinary charges?',
      multipleAnswers: false,
      answers: [
        {
          id: '181256',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44173',
        },
        {
          id: '181255',
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
      label: 'Is the incident the subject of a police investigation?',
      multipleAnswers: false,
      answers: [
        {
          id: '181261',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44125',
        },
        {
          id: '181260',
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
      label: 'Were the police informed of the incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '181262',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44801',
        },
        {
          id: '181263',
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
      label: "Is the incident subject to a governor's adjudication?",
      multipleAnswers: false,
      answers: [
        {
          id: '181284',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44799',
        },
        {
          id: '181283',
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
      label: 'Is the missing radio thought to be?',
      multipleAnswers: false,
      answers: [
        {
          id: '181355',
          code: 'LOST',
          active: true,
          label: 'LOST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44856',
        },
        {
          id: '181356',
          code: 'MISLAID',
          active: true,
          label: 'MISLAID',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44856',
        },
        {
          id: '181357',
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
      label: 'Is the radio thought to be in possession of prisoners?',
      multipleAnswers: false,
      answers: [
        {
          id: '181415',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44712',
        },
        {
          id: '181414',
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
      label: 'Has the prison service press office been informed?',
      multipleAnswers: false,
      answers: [
        {
          id: '181638',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44453',
        },
        {
          id: '181637',
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
      label: 'Where was the radio found?',
      multipleAnswers: false,
      answers: [
        {
          id: '182450',
          code: 'PRISONER POSSESSION',
          active: true,
          label: 'PRISONER POSSESSION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182446',
          code: 'CONCEALED',
          active: true,
          label: 'CONCEALED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182447',
          code: 'DISCARDED',
          active: true,
          label: 'DISCARDED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182448',
          code: 'MISLAID/LOST',
          active: true,
          label: 'MISLAID/LOST',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182449',
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
